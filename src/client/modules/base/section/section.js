import { LightningElement, api } from 'lwc';

export default class BaseSection extends LightningElement {
  @api img;
  @api backgroundPosition;

  renderedCallback() {
    if (this.hasRendered) {
      return;
    }
    this.hasRendered = true;
    const imgNode = this.template.querySelector('.backgroundImg');
    imgNode.style.backgroundImage = `url(${this.img})`;
    imgNode.style.backgroundPosition = this.backgroundPosition;
  }
}
