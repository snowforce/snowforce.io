import { LightningElement, api } from 'lwc';

export default class BaseRichText extends LightningElement {
  @api
  get content() {
    return this._content;
  }
  set content(val) {
    this._content = val;
    this.pushContent();
  }

  renderedCallback() {
    this.pushContent();
  }

  pushContent() {
    const container = this.template.querySelector('.content');
    if (this.content && container) {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }

      let div = document.createElement('div');

      // eslint-disable-next-line @lwc/lwc/no-inner-html
      div.innerHTML = this.content;
      container.appendChild(div);
    }
  }
}
