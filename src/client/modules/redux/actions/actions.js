import {
  RECEIVE_SESSIONS,
  REQUEST_SESSIONS,
  RECEIVE_SPEAKERS,
  REQUEST_SPEAKERS,
  RECEIVE_SPONSORS,
  REQUEST_SPONSORS,
  RECEIVE_TRACKS,
  REQUEST_TRACKS,
  SET_TRACK_INDEX,
  SET_TRACK_NAME,
  SIDE_MENU_OPEN,
  SIDE_MENU_CLOSE
} from 'redux/shared';

import { store } from 'redux/store';

import { currentYearSelector } from 'redux/selectors';

/******** Menu ********/

export function closeMenu() {
  return {
    type: SIDE_MENU_CLOSE
  };
}

export function openMenu() {
  return {
    type: SIDE_MENU_OPEN
  };
}

/******** Session Track *******/

export function setSessionsTrackIndex(index) {
  return {
    type: SET_TRACK_INDEX,
    data: index
  };
}

export function setSessionsTrackName(name) {
  return {
    type: SET_TRACK_NAME,
    data: name
  };
}

/******** Fetch Data ********/

let requests = {};

const getRequestKey = (requestType, year) => {
  return `${requestType}|${year}`;
};

const fetchData = async (
  table,
  year = currentYearSelector(store.getState())
) => {
  const res = await fetch(`/api/${year}/${table}`);
  return res.json();
};

function receiveAction(type, year, res) {
  return {
    type,
    data: {
      year,
      val: res
    }
  };
}

function requestAction(type, year) {
  return {
    type,
    data: { year }
  };
}

function fetchRequest(table, requestType, receiveType, year) {
  return async dispatch => {
    requests[getRequestKey(requestType, year)] = 'new';
    dispatch(requestAction(requestType, year));
    fetchData(table, year).then(res => {
      requests[getRequestKey(requestType, year)] = 'complete';
      dispatch(receiveAction(receiveType, year, res));
    });
  };
}

function shouldFetch(requestType, year) {
  return getRequestKey(requestType, year) in requests ? false : true;
}

const requestTypes = {
  sessions: REQUEST_SESSIONS,
  speakers: REQUEST_SPEAKERS,
  sponsors: REQUEST_SPONSORS,
  tracks: REQUEST_TRACKS
};

const receiveTypes = {
  sessions: RECEIVE_SESSIONS,
  speakers: RECEIVE_SPEAKERS,
  sponsors: RECEIVE_SPONSORS,
  tracks: RECEIVE_TRACKS
};

export function fetchIfNeeded(
  table,
  year = currentYearSelector(store.getState())
) {
  const requestType = requestTypes[table];
  const receiveType = receiveTypes[table];
  return dispatch => {
    if (shouldFetch(requestType, year)) {
      dispatch(fetchRequest(table, requestType, receiveType, year));
    }
  };
}
