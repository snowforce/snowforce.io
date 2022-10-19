import { LightningElement, api } from 'lwc';
export default class CmpPluralsight extends LightningElement {
  _title = 'Session Recordings Available At';
  @api
  get title() {
    return this._title;
  }
  set title(val) {
    this._title = val;
  }
}
