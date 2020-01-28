import { LightningElement, track, wire } from 'lwc';
import { wireFilteredSessions, store } from 'redux/store';

export default class ViewSessions extends LightningElement {
  @track sessions;

  @wire(wireFilteredSessions, { store })
  wiredSessions({ data, error }) {
    if (error) throw error;
    this.sessions = data;
  }
}
