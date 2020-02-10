import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import { debounceRequests, fetchRequest } from './middlewares';

import * as reducers from './reducers';

const middlewares = [thunk, debounceRequests, fetchRequest];

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  middlewares.push(logger);
}

export const store = createStore(
  combineReducers(reducers),
  applyMiddleware(...middlewares)
);

export {
  wireBookmarks,
  wireCurrentConference,
  wireCurrentSponsors,
  wireCurrentSpeakers,
  wireCurrentSessions,
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
