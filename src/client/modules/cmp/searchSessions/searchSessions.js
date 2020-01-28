import { LightningElement, track, wire } from 'lwc';

import {
  wireSessionTracks,
  wireSessionAudiences,
  wireSessionLevels,
  wireSessionFormats,
  wireSessionStartTimes,
  store
} from 'redux/store';

export default class CmpSearchSessions extends LightningElement {
  @track tracks = [];
  @track audiences = [];
  @track levels = [];
  @track formats = [];
  @track startTimes = [];

  @track searchTerm = '';

  @track selectedTrack = 'All';
  @track selectedAudience = 'All';
  @track selectedLevel = 'All';
  @track selectedFormat = 'All';
  @track selectedStartTime = 'All';

  selectorChange = event => {
    this[event.target.dataset.filter] = event.target.value;
  };

  @wire(wireSessionTracks, {
    store,
    selectorParam: '$selectedTrack'
  })
  wiredTracks({ data, error }) {
    if (error) throw error;
    this.tracks = data;
  }

  @wire(wireSessionAudiences, {
    store,
    selectorParam: '$selectedAudience'
  })
  wiredAudiences({ data, error }) {
    if (error) throw error;
    this.audiences = data;
  }

  @wire(wireSessionLevels, {
    store,
    selectorParam: '$selectedLevel'
  })
  wiredLevels({ data, error }) {
    if (error) throw error;
    this.levels = data;
  }

  @wire(wireSessionFormats, {
    store,
    selectorParam: '$selectedFormat'
  })
  wiredFormats({ data, error }) {
    if (error) throw error;
    this.formats = data;
  }

  @wire(wireSessionStartTimes, {
    store,
    selectorParam: '$selectedStartTime'
  })
  wiredStartTimes({ data, error }) {
    if (error) throw error;
    this.startTimes = data;
  }
}
