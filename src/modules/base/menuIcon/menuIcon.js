import { LightningElement, api, track } from 'lwc';

export default class BaseMenuIcon extends LightningElement {
  @track iconClasses = 'menu-icon';

  @api
  get toggle() {
    return this._toggle;
  }
  set toggle(val) {
    this._toggle = val;
    this.iconClasses = 'menu-icon' + (val ? ' change' : '');
  }
}
