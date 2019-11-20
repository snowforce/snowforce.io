import { LightningElement, api, track, wire } from 'lwc';

import { store, wireCurrentSessions } from 'redux/store';
import {
  sessionsByAudienceFilter,
  speakerByIdSelector,
  currentSessionsSelector,
  currentSpeakersSelector
} from 'redux/selectors';

export default class CmpSessions extends LightningElement {
  @api
  get name() {
    return this._name;
  }
  set name(val) {
    this._name = val;
    this.haveSessions = false;
  }

  @track sessions;
  @track haveSessions = false;

  getTime = hour => {
    const h = hour - 12 > 0 ? hour - 12 : hour;
    return h + (hour >= 12 ? 'pm' : 'am');
  };

  @wire(wireCurrentSessions, { store })
  wireCurrentSessions(reduxState) {
    const currentSessions = currentSessionsSelector(reduxState);
    const currentSpeakers = currentSpeakersSelector(reduxState);

    if (currentSessions && currentSpeakers) {
      if (this.name && this.name.toLowerCase() !== 'all') {
        this.sessions = sessionsByAudienceFilter(currentSessions, this.name);
      } else {
        this.sessions = currentSessions;
      }

      const sorted = this.sessions.sort((a, b) => a.time - b.time);
      this.sessions = sorted.map(se => {
        return {
          ...se,
          time: this.getTime(se.time),
          speakers: se.speakers.map(speakerId => {
            if (typeof speakerId === 'string') {
              return speakerByIdSelector(reduxState, speakerId);
            }
            return { ...speakerId };
          })
        };
      });
      this.haveSessions = true;
    } else {
      this.sessions = [];
    }
  }
}
