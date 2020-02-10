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

  @track track = 'All';
  @track audience = 'All';
  @track level = 'All';
  @track format = 'All';
  @track startTime = 'All';

  selectorChange = event => {
    this[event.target.dataset.filter] = event.target.value;
  };

  @wire(wireSessionTracks, {
    store,
    selectorParam: '$track'
  })
  wiredTracks({ data, error }) {
    if (error) throw error;
    this.tracks = data;
  }

  @wire(wireSessionAudiences, {
    store,
    selectorParam: '$audience'
  })
  wiredAudiences({ data, error }) {
    if (error) throw error;
    this.audiences = data;
  }

  @wire(wireSessionLevels, {
    store,
    selectorParam: '$level'
  })
  wiredLevels({ data, error }) {
    if (error) throw error;
    this.levels = data;
  }

  @wire(wireSessionFormats, {
    store,
    selectorParam: '$format'
  })
  wiredFormats({ data, error }) {
    if (error) throw error;
    this.formats = data;
  }

  @wire(wireSessionStartTimes, {
    store,
    selectorParam: '$startTime'
  })
  wiredStartTimes({ data, error }) {
    if (error) throw error;
    this.startTimes = data;
  }

  setUrlParams = true;
  renderedCallback() {
    if (this.setUrlParams) {
      const searchParams = new URL(window.location.href).searchParams.entries();
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const param = searchParams.next();
        if (param.done) break;
        if (this[param.value[0]]) {
          console.log(`${param.value[0]} - ${param.value[1]}`);
          this[param.value[0]] = param.value[1];

          //   const selectInput = this.template.querySelector(
          //     `select[data-filter=${param.value[0]}]`
          //   );

          //   const namedInput = selectInput.namedItem(param.value[1]);
        }
      }
      this.setUrlParams = false;
    }
  }
}
