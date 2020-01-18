import {
  FIRST_CONFERENCE_YEAR,
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
  currentYearSelector,
  requestsSelector,
  sessionsByYearSelector,
  speakersByYearSelector,
  sponsorsByYearSelector,
  sessionByIdSelector,
  speakerByIdSelector,
  sponsorByIdSelector
} from 'redux/selectors';

const responseAction = (type, data) => {
  return { type, data };
};

const fetchData = async table => {
  return fetch('/api/' + table)
    .then(async res => {
      return res.json();
    })
    .catch(err => {
      throw err;
    });
};

const fetchDataByYear = async (year, table) => {
  return fetch(`/api/${year}/${table}`)
    .then(async res => {
      return res.json();
    })
    .catch(err => {
      throw err;
    });
};

const conferenceRequestsMap = {
  [REQUEST_CONFERENCES]: {
    selector: conferencesSelector,
    table: CONFERENCES,
    response: RECEIVE_CONFERENCES
  }
};

const conferenceRequests = Object.keys(conferenceRequestsMap);

const yearRequestsMap = {
  [REQUEST_SESSIONS]: {
    selector: sessionsByYearSelector,
    table: SESSIONS,
    response: RECEIVE_SESSIONS
  },
  [REQUEST_SPEAKERS]: {
    selector: speakersByYearSelector,
    table: SPEAKERS,
    response: RECEIVE_SPEAKERS
  },
  [REQUEST_SPONSORS]: {
    selector: sponsorsByYearSelector,
    table: SPONSORS,
    response: RECEIVE_SPONSORS
  }
};

const yearRequests = Object.keys(yearRequestsMap);

const idRequestsMap = {
  [REQUEST_SESSION]: {
    selector: sessionByIdSelector,
    table: SESSIONS,
    request: REQUEST_SESSIONS,
    response: RECEIVE_SESSIONS
  },
  [REQUEST_SPEAKER]: {
    selector: speakerByIdSelector,
    table: SPEAKERS,
    request: REQUEST_SPEAKERS,
    response: RECEIVE_SPEAKERS
  },
  [REQUEST_SPONSOR]: {
    selector: sponsorByIdSelector,
    table: SPONSORS,
    request: REQUEST_SPONSORS,
    response: RECEIVE_SPONSORS
  }
};

const idRequests = Object.keys(idRequestsMap);

// TODO: determine a better way to do this rather than querying back for each year...
// Pull a list of all ids with the years?
// Run Query of Id to the Server and let the server figure it out?
const fetchIdByYear = (store, id, year, request) => {
  const r = idRequestsMap[request];
  store
    .dispatch({
      type: r.request,
      data: { year }
    })
    .then(() => {
      const rec = r.selector(store.getState(), id);
      if (!rec && year > FIRST_CONFERENCE_YEAR) {
        return fetchIdByYear(store, year - 1, request);
      }
      return true;
    });
};

export const fetchRequest = store => next => action => {
  const result = next(action);

  if (yearRequests.includes(action.type)) {
    const r = yearRequestsMap[action.type];
    fetchDataByYear(action.data.year, r.table).then(res => {
      return store.dispatch(
        responseAction(r.response, { year: action.data.year, val: res })
      );
    });
  } else if (idRequests.includes(action.type)) {
    const currentYear = currentYearSelector(store.getState());
    fetchIdByYear(store, action.data.id, currentYear, action.type).then(() => {
      return true;
    });
  } else if (conferenceRequests.includes(action.type)) {
    const r = conferenceRequestsMap[action.type];
    fetchData(r.table).then(res => {
      return store.dispatch(responseAction(r.response, { val: res }));
    });
  }

  return result;
};

export const debounceRequests = store => next => action => {
  if (requestsSelector(store.getState()).includes(action.type)) {
    return undefined;
  }

  if (yearRequests.includes(action.type)) {
    const r = yearRequestsMap[action.type];
    const data = r.selector(store.getState(), action.data.year);
    if (data && data.length >= 1) {
      return undefined;
    }
  } else if (idRequests.includes(action.type)) {
    const r = idRequestsMap[action.type];
    const data = r.selector(store.getState(), action.data.id);
    if (data && data.id) {
      return undefined;
    }
  } else if (conferenceRequests.includes(action.type)) {
    const r = conferenceRequestsMap[action.type];
    const conference = r.selector(store.getState(), action.data);
    if (conference && conference.year) {
      return undefined;
    }
  }

  return next(action);
};
