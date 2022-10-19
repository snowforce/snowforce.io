/* eslint-disable import/namespace */
import { LightningElement, api, track } from 'lwc';

export default class BaseBackButton extends LightningElement {
  _scrollTop = 0;

  significantScroll = 5;

  @api
  get scrollTop() {
    return this._scrollTop;
  }
  set scrollTop(val) {
    if (val) {
      const px = val.target.scrollTop;
      const dif = this._scrollTop - px;
      if (dif > this.significantScroll) {
        this.displayButton = 'display';
      } else if (dif < -1 * this.significantScroll) {
        this.displayButton = 'hide';
      }
      this._scrollTop = px;
    }
  }

  @track displayButton = false;

  goBack = () => {
    window.history.back();
  };
}
