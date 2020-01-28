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
  viewSelector,
  currentSessionsFilteredSelector,
  currentSessionsTracksSelector,
  currentSessionsAudiencesSelector,
  currentSessionsLevelsSelector,
  currentSessionsFormatsSelector,
  currentSessionsStartTimesSelector
} from 'redux/selectors';

import {
  requestConferences,
  requestSessions,
  requestSpeakers,
  requestSponsors,
  requestOrganizers,
  sessionsFilterAudience,
  sessionsFilterTrack,
  sessionsFilterLevel,
  sessionsFilterFormat,
  sessionsFilterStartTime
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

export function wireFilteredSessions({ store }) {
  return imperativeArrayFactory(
    store,
    currentSessionsFilteredSelector,
    requestSessions
  );
}

export function wireSessionTracks({ store, selectorParam }) {
  return imperativeArrayFactory(
    store,
    currentSessionsTracksSelector,
    sessionsFilterTrack,
    selectorParam
  );
}

export function wireSessionAudiences({ store, selectorParam }) {
  return imperativeArrayFactory(
    store,
    currentSessionsAudiencesSelector,
    sessionsFilterAudience,
    selectorParam
  );
}

export function wireSessionLevels({ store, selectorParam }) {
  return imperativeArrayFactory(
    store,
    currentSessionsLevelsSelector,
    sessionsFilterLevel,
    selectorParam
  );
}

export function wireSessionFormats({ store, selectorParam }) {
  return imperativeArrayFactory(
    store,
    currentSessionsFormatsSelector,
    sessionsFilterFormat,
    selectorParam
  );
}

export function wireSessionStartTimes({ store, selectorParam }) {
  return imperativeArrayFactory(
    store,
    currentSessionsStartTimesSelector,
    sessionsFilterStartTime,
    selectorParam
  );
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
  },
  {
    adapter: wireFilteredSessions,
    factory: wireArrayFactory,
    action: requestSessions,
    selector: currentSessionsFilteredSelector
  },
  {
    adapter: wireSessionTracks,
    factory: wireArrayFactory,
    action: sessionsFilterTrack,
    selector: currentSessionsTracksSelector
  },
  {
    adapter: wireSessionAudiences,
    factory: wireArrayFactory,
    action: sessionsFilterAudience,
    selector: currentSessionsAudiencesSelector
  },
  {
    adapter: wireSessionLevels,
    factory: wireArrayFactory,
    action: sessionsFilterLevel,
    selector: currentSessionsLevelsSelector
  },
  {
    adapter: wireSessionFormats,
    factory: wireArrayFactory,
    action: sessionsFilterFormat,
    selector: currentSessionsFormatsSelector
  },
  {
    adapter: wireSessionStartTimes,
    factory: wireArrayFactory,
    action: sessionsFilterStartTime,
    selector: currentSessionsStartTimesSelector
  }
];

registrations.forEach(r => {
  register(r.adapter, r.factory(r.selector, r.action));
});
