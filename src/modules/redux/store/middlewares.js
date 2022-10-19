import {
  CONFERENCES,
  SESSIONS,
  SPEAKERS,
  SPONSORS,
  ORGANIZERS,
  REQUEST_CONFERENCES,
  REQUEST_SESSIONS,
  REQUEST_SESSION,
  REQUEST_SPEAKERS,
  REQUEST_SPEAKER,
  REQUEST_SPONSORS,
  REQUEST_SPONSOR,
  REQUEST_ORGANIZERS,
} from "redux/shared";

import {
  receiveConferences,
  receiveSessions,
  receiveSpeakers,
  receiveSponsors,
  receiveOrganizers,
  addRequest,
  clearRequest,
} from "redux/actions";

import {
  conferencesSelector,
  requestsSelector,
  organizersSelector,
  speakersSelector,
  sessionsSelector,
  sponsorsSelector,
  sessionByIdSelector,
  sponsorByIdSelector,
} from "redux/selectors";

const serverRequestsMap = {
  [REQUEST_CONFERENCES]: {
    selector: conferencesSelector,
    table: CONFERENCES,
    response: receiveConferences,
  },
  [REQUEST_SESSIONS]: {
    selector: sessionsSelector,
    table: SESSIONS,
    response: receiveSessions,
  },
  [REQUEST_SPEAKERS]: {
    selector: speakersSelector,
    table: SPEAKERS,
    response: receiveSpeakers,
  },
  [REQUEST_SPONSORS]: {
    selector: sponsorsSelector,
    table: SPONSORS,
    response: receiveSponsors,
  },
  [REQUEST_SESSION]: {
    selector: sessionByIdSelector,
    table: SESSIONS,
    response: receiveSessions,
  },
  [REQUEST_SPEAKER]: {
    selector: speakersSelector,
    table: SPEAKERS,
    response: receiveSpeakers,
  },
  [REQUEST_SPONSOR]: {
    selector: sponsorByIdSelector,
    table: SPONSORS,
    response: receiveSponsors,
  },
  [REQUEST_ORGANIZERS]: {
    selector: organizersSelector,
    table: ORGANIZERS,
    response: receiveOrganizers,
  },
};

const serverRequests = Object.keys(serverRequestsMap);

const fetchData = (table) => {
  return fetch("/api/v1/data/" + table + '.json')
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      console.log("Table Error:", table);
      console.error(err);
    });
};

export const fetchRequest = (store) => (next) => (action) => {
  if (serverRequests.includes(action.type)) {
    const r = serverRequestsMap[action.type];
    store.dispatch(addRequest(action.type));
    return fetchData(r.table).then((val) => {
      store.dispatch(r.response(val));
      store.dispatch(clearRequest(action.type));
      return val;
    }).catch(err => {
      console.log('Error Fetching Data:', r.table);
      console.log(err);
    });
  }
  return next(action);
};

export const debounceRequests = (store) => (next) => (action) => {
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
