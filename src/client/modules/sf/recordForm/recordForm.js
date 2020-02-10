/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, api, track } from 'lwc';
import {
  getFieldsForLayout,
  densityValues,
  getCompoundFields,
  compoundFieldIsUpdateable,
  isCompoundField,
  isPersonAccount,
  UNSUPPORTED_REFERENCE_FIELDS
} from 'sf/fieldUtils';
import { normalizeString, deepCopy } from 'sf/utilsPrivate';
import { classSet } from 'sf/utils';

const EDIT_MODE = 'edit';
const VIEW_MODE = 'view';
const READ_ONLY_MODE = 'readonly';

function isUnsupportedReferenceField(name) {
  return UNSUPPORTED_REFERENCE_FIELDS.indexOf(name) !== -1;
}

function extractLayoutFromLayouts(layouts, apiName, layout) {
  const layoutId = Object.keys(layouts[apiName])[0];
  if (
    layoutId &&
    layouts[apiName] &&
    layouts[apiName][layoutId] &&
    layouts[apiName][layoutId][layout] &&
    layouts[apiName][layoutId][layout].View
  ) {
    return layouts[apiName][layoutId][layout].View;
  }
  return null;
}

export default class sfRecordForm extends LightningElement {
  @track readOnly = false;
  @track _recordId;
  @track _objectApiName;
  @track _fields = [];
  @track _editMode = false;
  @track cols = 1;
  @track _loading = true;
  @track fieldsReady = false;

  @api recordTypeId;
  _record;
  _firstLoad = true;
  _loadError = false;
  _layout;
  _dupMapper = {};
  _mode;
  _labelSave = 'Save';
  _labelCancel = 'Cancel';
  _labelLoading = 'Loading';
  _loadedPending = false;
  _fieldsHandled = false;
  _rawFields;
  _isPersonAccount = false;
  @track _density = densityValues.AUTO;

  set mode(val) {
    val = val.toLowerCase();
    this._mode = val;
    switch (val) {
      case EDIT_MODE:
        this.readOnly = false;
        this._editMode = true;
        break;
      case VIEW_MODE:
        this.readOnly = false;
        this._editMode = false;
        break;
      case READ_ONLY_MODE:
        this.readOnly = true;
        this._editMode = false;
        break;
      default:
        this.readOnly = false;
        if (!this._recordId) {
          this._editMode = true;
        } else {
          this._editMode = false;
        }
    }
  }

  @api get mode() {
    return this._mode;
  }

  set layoutType(val) {
    if (val.match(/Full|Compact/)) {
      this._layout = val;
    } else {
      throw new Error(
        `Invalid layout "${val}". Layout must be "Full" or "Compact"`
      );
    }
  }

  @api get layoutType() {
    return this._layout;
  }

  @api get density() {
    return this._density;
  }

  set density(val) {
    this._density = normalizeString(val, {
      fallbackValue: densityValues.AUTO,
      validValues: [
        densityValues.AUTO,
        densityValues.COMPACT,
        densityValues.COMFY
      ]
    });
  }

  set recordId(val) {
    if (!val && !this._mode) {
      this._editMode = true;
    }

    this._recordId = val;
  }

  @api get recordId() {
    return this._recordId;
  }

  set objectApiName(val) {
    this._objectApiName = val;
  }

  @api get objectApiName() {
    return this._objectApiName;
  }

  set columns(val) {
    this.cols = parseInt(val, 10);
    if (isNaN(this.cols) || this.cols < 1) {
      this.cols = 1;
    }
  }

  @api get columns() {
    return this.cols;
  }

  @api
  submit(fields) {
    this.template.querySelector('c-record-edit-form').submit(fields);
  }

  addField(val) {
    const fieldName = val.fieldApiName ? val.fieldApiName : val;
    if (!this._dupMapper[fieldName]) {
      this._fields.push(fieldName);
      this._dupMapper[fieldName] = true;
    }
  }

  connectedCallback() {
    if (!this._recordId && !this._mode) {
      this._editMode = true;
    }
  }

  set fields(val) {
    this.fieldsReady = true;
    this._fields = [];
    this._dupMapper = {};
    if (Array.isArray(val)) {
      for (let i = 0; i < val.length; i++) {
        this.addField(val[i]);
      }
    } else {
      this.addField(val);
    }
  }

  @api get fields() {
    return this._rawFields;
  }

  get _editable() {
    return !this._loading && !this.readOnly && !this._loadError;
  }

  get _viewMode() {
    return !this._editMode;
  }

  set _viewMode(val) {
    this._editMode = !val;
  }

  get _rows() {
    const out = [];

    if (!this._objectInfo) {
      return out;
    }
    const rowLength = this.cols;
    const fields = this._fields.slice();
    let rowkey = 0;
    let thisRow = { fields: [], key: rowkey };
    while (fields.length > 0) {
      if (thisRow.fields.length < rowLength) {
        const field = fields.shift();
        if (this._objectInfo.fields && this._objectInfo.fields[field]) {
          const compound = isCompoundField(
            field,
            this._objectInfo,
            this._isPersonAccount
          );

          let compoundFields = [];
          if (compound) {
            compoundFields = getCompoundFields(
              field,
              this._record,
              this._objectInfo
            );
          }

          const fieldUpdateable = compound
            ? compoundFieldIsUpdateable(
                compoundFields, // eslint-disable-line indent
                this._record, // eslint-disable-line indent
                this._objectInfo // eslint-disable-line indent
              ) // eslint-disable-line indent
            : this._objectInfo &&
              this._objectInfo.fields &&
              this._objectInfo.fields[field].updateable;
          const updateable =
            !isUnsupportedReferenceField(field) && this._objectInfo
              ? fieldUpdateable
              : false;
          const editable =
            !isUnsupportedReferenceField(field) &&
            this._editable &&
            (this._objectInfo &&
            this._objectInfo.fields &&
            this._objectInfo.fields[field]
              ? fieldUpdateable
              : false);
          thisRow.fields.push({
            field,
            editable,
            updateable
          });
        }
      } else {
        out.push(thisRow);
        thisRow = { fields: [], key: ++rowkey };
      }
    }
    if (thisRow.fields.length) {
      out.push(thisRow);
    }
    return out;
  }

  get computedInputClass() {
    if (this.cols === 1) {
      return 'slds-form-element_1-col';
    }
    return '';
  }

  get computedOutputClass() {
    const classnames = classSet(
      'slds-form-element_small slds-form-element_edit slds-hint-parent'
    );

    return classnames
      .add({
        'slds-form-element_1-col': this.cols === 1
      })
      .toString();
  }

  toggleEdit(e) {
    if (e) {
      e.stopPropagation();
    }
    this._editMode = !this._editMode;
  }

  handleLoad(e) {
    e.stopPropagation();
    let fields;
    const apiName = this._objectApiName.objectApiName
      ? this._objectApiName.objectApiName
      : this._objectApiName;

    if (!this._fieldsHandled && this._layout && e.detail.objectInfos) {
      if (e.detail.layout) {
        fields = getFieldsForLayout(
          e.detail.layout,
          e.detail.objectInfos[apiName]
        );
      } else if (e.detail.layouts) {
        const layout = extractLayoutFromLayouts(
          e.detail.layouts,
          apiName,
          this._layout
        );

        if (layout) {
          fields = getFieldsForLayout(layout, e.detail.objectInfos[apiName]);
        }
      }
      this._fieldsHandled = true;
    }

    const record = e.detail.records
      ? e.detail.records[this._recordId]
      : e.detail.record;
    this._record = record;

    this._isPersonAccount = record ? isPersonAccount(record) : false;

    if (fields) {
      this.fields = deepCopy(fields);
    }

    if (this._firstLoad) {
      this._loading = false;
      this._firstLoad = false;
    }

    if (this._loadedPending) {
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => {
        this._loading = false;
        this._loadedPending = false;
      }, 0);
    }
    this._objectInfo = deepCopy(e.detail.objectInfos[apiName]);
    this.dispatchEvent(
      new CustomEvent('load', {
        detail: e.detail
      })
    );
  }

  handleError(e) {
    e.stopPropagation();
    this._loading = false;
    if (this._firstLoad) {
      this._loadError = true;
    }
    this.dispatchEvent(
      new CustomEvent('error', {
        detail: e.detail
      })
    );
  }

  handleSubmit(e) {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this._loading = !e.defaultPrevented;
    }, 0);
  }

  clearForm() {
    const inputFields = this.template.querySelectorAll('lightning-input-field');

    if (inputFields) {
      inputFields.forEach(field => {
        field.reset();
      });
    }
  }

  handleCancel(e) {
    if (this._recordId) {
      this.toggleEdit(e);
    } else {
      this.clearForm();
    }

    this.template.querySelector('lightning-messages').setError(null);

    this.dispatchEvent(new CustomEvent('cancel'));
  }

  handleSuccess(e) {
    e.stopPropagation();
    this._loadedPending = true;
    this._editMode = false;
    this.recordId = e.detail.id;
    this.dispatchEvent(
      new CustomEvent('success', {
        detail: e.detail
      })
    );
  }
}
