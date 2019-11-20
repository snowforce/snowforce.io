/* eslint-disable import/namespace */
import { LightningElement, api } from 'lwc';

import * as templates from './templates';
import sharedStylesheet from './icon.css';

export default class Icon extends LightningElement {
  @api name;

  render() {
    const { name } = this;

    if (templates[name]) {
      const temp = templates[name];
      temp.stylesheets = sharedStylesheet;
      return temp;
    }
    // eslint-disable-next-line no-console
    console.warn(`Missing template for icon name "${name}"`);
    return templates.void;
  }
}
