import { createStore, applyMiddleware, combineReducers } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';

import { debounceRequests, fetchRequest } from './middlewares';

import * as reducers from './reducers';

const middlewares = [thunk, debounceRequests, fetchRequest];

export const store = createStore(
  combineReducers(reducers),
  applyMiddleware(...middlewares)
);


export {
  wireBookmarks,
  wireCurrentConference,
  wireCurrentSponsors,
  wireCurrentSpeakers,
  wireCurrentOrganizers,
  wireCurrentSessions,
  wireOrganizerById,
  wireOrganizers,
  wireSessions,
  wireSpeakers,
  wireSpeakerById,
  wireSessionById,
  wireSponsorById,
  wireView,
  wireFilteredSessions,
  wireSessionTracks,
  wireSessionAudiences,
  wireSessionLevels,
  wireSessionFormats,
  wireSessionStartTimes
} from './wireAdapter';
