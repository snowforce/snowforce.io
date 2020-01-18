import {
  RECEIVE_CONFERENCES,
  REQUEST_CONFERENCES,
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
  SIDE_MENU_CLOSE,
  FETCH_ACTION
} from 'redux/shared';

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

/******** Conferences *******/

export const receiveConferences = conferences => {
  return { type: RECEIVE_CONFERENCES, data: { conferences } };
};

export const requestConferences = () => {
  return { type: REQUEST_CONFERENCES, data: {} };
};

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

/** Sessions */

export const receiveSessions = sessions => {
  return { type: RECEIVE_SESSIONS, data: { sessions } };
};

export const requestSessions = year => {
  return { type: REQUEST_SESSIONS, data: { year } };
};

/** Speakers */

export const receiveSpeakers = speakers => {
  return { type: RECEIVE_SPEAKERS, data: { speakers } };
};

export const requestSpeakers = year => {
  return { type: REQUEST_SPEAKERS, data: { year } };
};

/** Sponsors */

export const receiveSponsors = sponsors => {
  return { type: RECEIVE_SPONSORS, data: { sponsors } };
};

export const requestSponsors = year => {
  return { type: REQUEST_SPONSORS, data: { year } };
};

/** Tracks */

export const receiveTracks = tracks => {
  return { type: RECEIVE_TRACKS, data: { tracks } };
};

export const requestTracks = year => {
  return { type: REQUEST_TRACKS, data: { year } };
};

/** Requests */

export const setRequest = requestStr => {
  return { type: FETCH_ACTION, data: { str: requestStr } };
};
