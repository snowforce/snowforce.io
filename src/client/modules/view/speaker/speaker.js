import { LightningElement, api, track, wire } from 'lwc';

import { connectStore, store } from 'redux/store';
import { fetchIfNeeded } from 'redux/actions';
import {
  currentYearSelector,
  speakerByIdSelector,
  sessionsBySpeakerIdSelector,
  sessionsByYearSelector
} from 'redux/selectors';

export default class ViewSpeaker extends LightningElement {
  @api speakerId;

  @track speaker = { social: {} };
  @track sessions = [];
  @track haveSessions = true;

  yearsBack = 0;

  fetchSessionData = year => {
    store.dispatch(fetchIfNeeded('speakers', year));
    store.dispatch(fetchIfNeeded('sessions', year));
  };

  @wire(connectStore, { store, speakerId: '$speakerId' })
  storeChange(reduxState) {
    let year = currentYearSelector(reduxState) - this.yearsBack;
    const redSpeaker = speakerByIdSelector(reduxState, this.speakerId);
    const yearSessions = sessionsByYearSelector(reduxState, year);

    this.fetchSessionData(year);

    if ('social' in redSpeaker && yearSessions.length) {
      this.yearsBack = 0;
      this.speaker = redSpeaker;
      this.sessions = sessionsBySpeakerIdSelector(reduxState, this.speakerId);
      this.haveSessions = this.sessions.length > 0;
    }

    // TODO: need to look back x number of years for more sessions...
  }
}
