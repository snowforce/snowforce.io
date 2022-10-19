import { LightningElement, api, track, wire } from 'lwc';
import { wireOrganizerById, store } from 'redux/store';

export default class ViewOrganizer extends LightningElement {
  @api
  get organizerId() {
    return this._organizerId;
  }
  set organizerId(val) {
    this._organizerId = val;
  }

  @track organizer = { social: {} };

  @wire(wireOrganizerById, {
    store,
    selectorParam: '$organizerId'
  })
  wiredOrganizer({ data, error }) {
    if (error) throw error;
    this.organizer = data;
  }
}
