import { LightningElement, api, track, wire } from 'lwc';
import { wireSessionById, wireSpeakers, store } from 'redux/store';

export default class ViewSession extends LightningElement {
  @api sessionId;

  @track session = { audience: [], speakers: [] };
  @track speakers = [];
  speakerIds = [];

  manualNav = event => {
    const { filter, val } = event.target.dataset;
    this.dispatchEvent(
      new CustomEvent('navigate', {
        bubbles: true,
        composed: true,
        detail: {
          link: `/sessions?${filter}=${val}`
        }
      })
    );
  };

  @wire(wireSessionById, { store, selectorParam: '$sessionId' })
  wiredSession({ data, error }) {
    if (error) {
      throw error;
    }
    this.session = {
      ...data,
      audience: data.audience.split(';')
    };

    if (data.speakers && data.speakers[0]) {
      if (typeof data.speakers[0] === 'string') {
        this.speakerIds = data.speakers;
      } else {
        this.speakers = data.speakers;
        this.speakerIds = data.speakers.map(s => s.id);
      }
    } else {
      this.speakerIds = [];
    }
  }

  @wire(wireSpeakers, { store, selectorParam: '$speakerIds' })
  wiredSpeakers({ data, error }) {
    if (error) {
      throw error;
    }
    this.speakers = this.speakerIds.map(s => data[s]);
  }
}
