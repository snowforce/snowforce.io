import { LightningElement, api, track, wire } from 'lwc';
import { wireSpeakerById, wireSessions, store } from 'redux/store';

export default class ViewSpeaker extends LightningElement {
  @api speakerId;
  @track speaker = { social: {}, sessions: [] };
  sessionIds = [];
  @track sessions = [];

  @wire(wireSpeakerById, { store, selectorParam: '$speakerId' })
  wiredSpeaker({ data, error }) {
    if (error) {
      throw error;
    }
    this.speaker = data;

    if (data.sessions && data.sessions[0]) {
      if (typeof data.sessions[0] === 'string') {
        this.sessionIds = data.sessions;
      } else {
        this.sessions = data.sessions;
        this.sessionIds = data.sessions.map(s => s.id);
      }
    } else {
      this.sessionIds = [];
    }
  }

  @wire(wireSessions, { store, selectorParam: '$sessionIds' })
  wiredSessions({ data, error }) {
    if (error) {
      throw error;
    }
    this.sessions = this.sessionIds.map(s => data[s]);
  }
}
