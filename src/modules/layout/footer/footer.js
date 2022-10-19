import { LightningElement, track, wire } from 'lwc';
import { store, wireCurrentConference } from 'redux/store';

export default class footer extends LightningElement {
  @track conference = {};

  @wire(wireCurrentConference, { store })
  wiredStore({ data, error }) {
    if (error) {
      throw error;
    }
    this.conference = data;
  }
}
