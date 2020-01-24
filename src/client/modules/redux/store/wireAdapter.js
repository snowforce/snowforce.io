//  https://github.com/salesforce/lwc/tree/master/packages/%40lwc/wire-service

import { register } from '@lwc/wire-service';

import {
  imperativeArrayFactory,
  imperativeObjectFactory,
  wireArrayFactory,
  wireObjectFactory
} from './wireFactory';

import {
  currentConferenceSelector,
  currentSponsorsSelector,
  currentSpeakersSelector,
  currentSessionsSelector,
  currentOrganizersSelector,
  sessionsSelector,
  speakersSelector,
  speakerByIdSelector,
  sessionByIdSelector,
  sponsorByIdSelector,
  viewSelector
} from 'redux/selectors';

import {
  requestConferences,
  requestSessions,
  requestSpeakers,
  requestSponsors,
  requestOrganizers
} from 'redux/actions';

/***********  Imperative Wire Adapters ***********/

export function wireCurrentConference({ store }) {
  return imperativeObjectFactory(
    store,
    currentSponsorsSelector,
    requestSponsors
  );
}

export function wireCurrentSponsors({ store }) {
  return imperativeArrayFactory(
    store,
    currentSponsorsSelector,
    requestSponsors
  );
}

export function wireCurrentSpeakers({ store }) {
  return imperativeArrayFactory(
    store,
    currentSpeakersSelector,
    requestSpeakers
  );
}

export function wireCurrentSessions({ store }) {
  return imperativeArrayFactory(
    store,
    currentSessionsSelector,
    requestSessions
  );
}

export function wireSessions({ store }) {
  return imperativeArrayFactory(store, sessionsSelector, requestSessions);
}

export function wireCurrentOrganizers({ store }) {
  return imperativeArrayFactory(
    store,
    currentOrganizersSelector,
    requestOrganizers
  );
}

export function wireSpeakerById({ store, selectorParam }) {
  return imperativeObjectFactory(
    store,
    speakerByIdSelector,
    requestSpeakers,
    selectorParam
  );
}

export function wireSpeakers({ store, selectorParam }) {
  return imperativeArrayFactory(
    store,
    speakersSelector,
    requestSpeakers,
    selectorParam
  );
}

export function wireSessionById({ store, selectorParam }) {
  return imperativeObjectFactory(
    store,
    sessionByIdSelector,
    requestSessions,
    selectorParam
  );
}

export function wireSponsorById({ store, selectorParam }) {
  return imperativeObjectFactory(
    store,
    currentSponsorsSelector,
    requestSponsors,
    selectorParam
  );
}

export function wireView({ store }) {
  return imperativeObjectFactory(store, viewSelector);
}

/********* Register Wire Adapters */

const registrations = [
  {
    adapter: wireCurrentConference,
    factory: wireObjectFactory,
    action: requestConferences,
    selector: currentConferenceSelector
  },
  {
    adapter: wireCurrentSponsors,
    factory: wireArrayFactory,
    action: requestSponsors,
    selector: currentSponsorsSelector
  },
  {
    adapter: wireCurrentSpeakers,
    factory: wireArrayFactory,
    action: requestSpeakers,
    selector: currentSpeakersSelector
  },
  {
    adapter: wireCurrentSessions,
    factory: wireArrayFactory,
    action: requestSessions,
    selector: currentSessionsSelector
  },
  {
    adapter: wireCurrentOrganizers,
    factory: wireArrayFactory,
    action: requestOrganizers,
    selector: currentOrganizersSelector
  },
  {
    adapter: wireSponsorById,
    factory: wireObjectFactory,
    action: requestSponsors,
    selector: sponsorByIdSelector
  },
  {
    adapter: wireSpeakerById,
    factory: wireObjectFactory,
    action: requestSpeakers,
    selector: speakerByIdSelector
  },
  {
    adapter: wireSessionById,
    factory: wireObjectFactory,
    action: requestSessions,
    selector: sessionByIdSelector
  },
  {
    adapter: wireSessions,
    factory: wireObjectFactory,
    action: requestSessions,
    selector: sessionsSelector
  },
  {
    adapter: wireSpeakers,
    factory: wireObjectFactory,
    action: requestSpeakers,
    selector: speakersSelector
  },
  {
    adapter: wireView,
    factory: wireObjectFactory,
    selector: viewSelector
  }
];

registrations.forEach(r => {
  register(r.adapter, r.factory(r.selector, r.action));
});
