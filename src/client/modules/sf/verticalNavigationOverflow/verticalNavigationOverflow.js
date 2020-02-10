/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, track } from 'lwc';

const SLDS_SHOW = 'slds-show';
const SLDS_HIDE = 'slds-hide';
const COLLAPSED_ICON = 'utility:chevronright';
const EXPANDED_ICON = 'utility:chevrondown';

export default class sfVerticalNavigationSection extends LightningElement {
  @track _isExpanded = false;

  get computedActionText() {
    return this._isExpanded ? 'showLess' : 'showMore';
  }

  get computedItemListClass() {
    return this._isExpanded ? SLDS_SHOW : SLDS_HIDE;
  }

  get computedIconName() {
    return this._isExpanded ? EXPANDED_ICON : COLLAPSED_ICON;
  }

  get computedAssistiveText() {
    return this._assistiveText || '';
  }

  toggleOverflow() {
    this._isExpanded = !this._isExpanded;
  }

  updateAssistiveText(assistiveText) {
    this._assistiveText = assistiveText;
  }

  connectedCallback() {
    this.dispatchEvent(
      new CustomEvent('privateoverflowregister', {
        bubbles: true,
        composed: true,
        detail: {
          callbacks: {
            updateAssistiveText: this.updateAssistiveText.bind(this)
          }
        }
      })
    );
  }
}
