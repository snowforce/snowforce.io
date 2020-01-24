import {
  CONFERENCES,
  SESSIONS,
  SPEAKERS,
  SPONSORS,
  REQUEST_CONFERENCES,
  RECEIVE_CONFERENCES,
  RECEIVE_SESSIONS,
  REQUEST_SESSIONS,
  REQUEST_SESSION,
  RECEIVE_SPEAKERS,
  REQUEST_SPEAKERS,
  REQUEST_SPEAKER,
  RECEIVE_SPONSORS,
  REQUEST_SPONSORS,
  REQUEST_SPONSOR
} from 'redux/shared';

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
    response: RECEIVE_CONFERENCES
  },
  [REQUEST_SESSIONS]: {
    selector: sessionsSelector,
    table: SESSIONS,
    response: RECEIVE_SESSIONS
  },
  [REQUEST_SPEAKERS]: {
    selector: speakersSelector,
    table: SPEAKERS,
    response: RECEIVE_SPEAKERS
  },
  [REQUEST_SPONSORS]: {
    selector: sponsorsSelector,
    table: SPONSORS,
    response: RECEIVE_SPONSORS
  },
  [REQUEST_SESSION]: {
    selector: sessionByIdSelector,
    table: SESSIONS,
    response: RECEIVE_SESSIONS
  },
  [REQUEST_SPEAKER]: {
    selector: speakersSelector,
    table: SPEAKERS,
    response: RECEIVE_SPEAKERS
  },
  [REQUEST_SPONSOR]: {
    selector: sponsorByIdSelector,
    table: SPONSORS,
    response: RECEIVE_SPONSORS
  }
};

const serverRequests = Object.keys(serverRequestsMap);

const responseAction = (type, data) => {
  return { type, data };
};

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
    return fetchData(r.table).then(val => {
      return store.dispatch(responseAction(r.response, { val }));
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
