import { LightningElement, api, track, wire } from 'lwc';
import { wireCurrentSessions, store } from 'redux/store';

export default class ViewSessions extends LightningElement {
  @api sessionTrack = 'all';

  @track sessions;
  @track sessionTracks;
  @track activeIndex = 0;

  @track displayTrack = 'all';

  @wire(wireCurrentSessions, { store })
  wiredSessions({ data, error }) {
    if (data) {
      this.sessions = data;
      this.sessionTracks = data.map(s => s.track);
    } else if (error) {
      throw error;
    }
  }
}
