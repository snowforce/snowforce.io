import { LightningElement, track, wire } from 'lwc';
import { wireFilteredSessions, store, wireCurrentConference } from 'redux/store';

export default class ViewSessions extends LightningElement {
  @track sessions;
  @track conference = {};

  @wire(wireFilteredSessions, { store })
  wiredSessions({ data, error }) {
    if (error) throw error;
    this.sessions = data;
  }

  @wire(wireCurrentConference, { store })
  wiredStore({ data, error }) {
    if (error) {
      throw error;
    }
    this.conference = data;
  }
}
