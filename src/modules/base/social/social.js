import { LightningElement, api } from 'lwc';
export default class social extends LightningElement {
  @api social = {
    twitter: '',
    facebook: '',
    linkedin: '',
    instagram: '',
    trailhead: ''
  };
}
