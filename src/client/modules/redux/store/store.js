import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import * as reducers from './reducers';

const middlewares = [thunk];

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  middlewares.push(logger);
}

export const store = createStore(
  combineReducers(reducers),
  applyMiddleware(...middlewares)
);

export {
  connectStore,
  wireCurrentSponsors,
  wireCurrentSpeakers,
  wireCurrentSessions,
  wireCurrentTracks
} from './wire-adapter';
