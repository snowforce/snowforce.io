import { LightningElement, api } from 'lwc';

export default class BaseBanner extends LightningElement {
  @api img;

  renderedCallback() {
    if (this.hasRendered) {
      return;
    }
    this.hasRendered = true;
    const imgNode = this.template.querySelector('.backgroundImg');
    imgNode.style.backgroundImage = `url(${this.img})`;
  }
}
