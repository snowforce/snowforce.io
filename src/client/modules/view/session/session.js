import { LightningElement, api, track, wire } from 'lwc';
import { connectStore, store } from 'redux/store';
import { fetchIfNeeded } from 'redux/actions';
import {
  sessionByIdSelector,
  speakersByIdFilter,
  speakersByYearSelector,
  currentYearSelector
} from 'redux/selectors';

export default class ViewSession extends LightningElement {
  @api sessionId;

  @track speakers = [];
  @track session = {};

  manualNav = event => {
    event.currentTarget.dispatchEvent(
      new CustomEvent('navigate', {
        bubbles: true,
        composed: true,
        detail: {
          link: '/sessions/' + event.currentTarget.dataset.audience
        }
      })
    );
  };

  fetchSessionData = year => {
    store.dispatch(fetchIfNeeded('speakers', year));
    store.dispatch(fetchIfNeeded('sessions', year));
  };

  @wire(connectStore, { store, speakerId: '$sessionId' })
  connectStore(reduxState) {
    const year = currentYearSelector(reduxState);
    this.fetchSessionData(year);

    const reduxSession = sessionByIdSelector(reduxState, this.sessionId);
    let yearSpeakers = speakersByYearSelector(reduxState, year);

    if (reduxSession && yearSpeakers) {
      this.session = sessionByIdSelector(reduxState, this.sessionId);
      this.speakers = this.session.speakers.map(sId =>
        speakersByIdFilter(yearSpeakers, sId)
      );
    }

    // TODO: Go back to previous years for old urls
  }
}
