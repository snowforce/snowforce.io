import { LightningElement, api } from 'lwc';
export default class CmpOrganizerFlipCard extends LightningElement {
  @api
  get organizer() {
    return this._organizer;
  }
  set organizer(val) {
    let responsibilities = [];
    if (val.responsibilities) {
      responsibilities = val.responsibilities.split(';');
    }
    this._organizer = { ...val, responsibilities };
  }
}
