import { LightningElement, api, track, wire } from 'lwc';
import { store, wireSponsorById } from 'redux/store';

export default class ViewSponsor extends LightningElement {
  @api sponsorId;

  @track sponsor = {};

  @wire(wireSponsorById, { store, selectorParam: '$sponsorId' })
  wiredSponsor({ data, error }) {
    if (data) {
      this.sponsor = data;
    } else if (error) {
      throw error;
    }
  }
}
