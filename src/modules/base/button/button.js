import { LightningElement, api, track } from 'lwc';

export default class button extends LightningElement {
  @api variant;

  @api size;

  @track classes;

  connectedCallback() {
    this.classes = [
      ...this.getBase(),
      ...this.getColor(this.variant),
      ...this.getSize(this.size)
    ].join(' ');
  }

  getBase = () => {
    return ['base', 'shadow'];
  };

  getColor = variant => {
    switch (variant) {
      case 'branded':
        return ['background-brand', 'text-white'];
      case 'white':
        return ['background-white', 'text-brand'];
      default:
        return [];
    }
  };

  getSize = size => {
    switch (size) {
      case 'large':
        return ['large'];
      case 'small':
        return ['small'];
      default:
        return [];
    }
  };
}
