import {
  CONFERENCES,
  SESSIONS,
  SPEAKERS,
  SPONSORS,
  REQUEST_CONFERENCES,
  REQUEST_SESSIONS,
  REQUEST_SESSION,
  REQUEST_SPEAKERS,
  REQUEST_SPEAKER,
  REQUEST_SPONSORS,
  REQUEST_SPONSOR
} from 'redux/shared';

import {
  receiveConferences,
  receiveSessions,
  receiveSpeakers,
  receiveSponsors,
  addRequest,
  clearRequest
} from 'redux/actions';

import {
  conferencesSelector,
  requestsSelector,
  speakersSelector,
  sessionsSelector,
  sponsorsSelector,
  sessionByIdSelector,
  sponsorByIdSelector
} from 'redux/selectors';

const serverRequestsMap = {
  [REQUEST_CONFERENCES]: {
    selector: conferencesSelector,
    table: CONFERENCES,
    response: receiveConferences
  },
  [REQUEST_SESSIONS]: {
    selector: sessionsSelector,
    table: SESSIONS,
    response: receiveSessions
  },
  [REQUEST_SPEAKERS]: {
    selector: speakersSelector,
    table: SPEAKERS,
    response: receiveSpeakers
  },
  [REQUEST_SPONSORS]: {
    selector: sponsorsSelector,
    table: SPONSORS,
    response: receiveSponsors
  },
  [REQUEST_SESSION]: {
    selector: sessionByIdSelector,
    table: SESSIONS,
    response: receiveSessions
  },
  [REQUEST_SPEAKER]: {
    selector: speakersSelector,
    table: SPEAKERS,
    response: receiveSpeakers
  },
  [REQUEST_SPONSOR]: {
    selector: sponsorByIdSelector,
    table: SPONSORS,
    response: receiveSponsors
  }
};

const serverRequests = Object.keys(serverRequestsMap);

const fetchData = async table => {
  return fetch('/data/' + table + '.json')
    .then(async res => {
      return res.json();
    })
    .catch(err => {
      throw err;
    });
};

export const fetchRequest = store => next => action => {
  if (serverRequests.includes(action.type)) {
    const r = serverRequestsMap[action.type];
    store.dispatch(addRequest(action.type));
    return fetchData(r.table).then(val => {
      store.dispatch(r.response(val));
      store.dispatch(clearRequest(action.type));
      return val;
    });
  }
  return next(action);
};

export const debounceRequests = store => next => action => {
  if (requestsSelector(store.getState()).includes(action.type)) {
    return undefined;
  }

  if (serverRequests.includes(action.type)) {
    const r = serverRequestsMap[action.type];
    const data = r.selector(store.getState(), action.data);
    if (
      data &&
      ((Array.isArray(data) && data.length > 0) ||
        (data.constructor === Object && Object.entries(data).length > 0))
    ) {
      return undefined;
    }
  }

  return next(action);
};
