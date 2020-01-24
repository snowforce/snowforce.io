import {
  RECEIVE_CONFERENCES,
  REQUEST_CONFERENCES,
  RECEIVE_SESSIONS,
  REQUEST_SESSIONS,
  RECEIVE_SPEAKERS,
  REQUEST_SPEAKERS,
  RECEIVE_SPONSORS,
  REQUEST_SPONSORS,
  SET_TRACK_INDEX,
  SET_TRACK_NAME,
  VIEW_MENU_OPEN,
  VIEW_MENU_CLOSE,
  VIEW_TRACK,
  FETCH_ACTION,
  REQUEST_SPEAKER,
  REQUEST_ORGANIZERS
} from 'redux/shared';
import { REQUEST_SESSION } from '../shared/shared';

/******** Menu ********/

export function closeMenu() {
  return {
    type: VIEW_MENU_CLOSE
  };
}

export function openMenu() {
  return {
    type: VIEW_MENU_OPEN
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

export const requestSession = id => {
  return { type: REQUEST_SESSION, data: { id } };
};

export const requestSessions = () => {
  return { type: REQUEST_SESSIONS, data: {} };
};

/** Speakers */

export const receiveSpeakers = speakers => {
  return { type: RECEIVE_SPEAKERS, data: { speakers } };
};

export const requestSpeakers = () => {
  return { type: REQUEST_SPEAKERS, data: {} };
};

export const requestSpeaker = id => {
  return { type: REQUEST_SPEAKER, data: { id } };
};

/** Sponsors */

export const receiveSponsors = sponsors => {
  return { type: RECEIVE_SPONSORS, data: { sponsors } };
};

export const requestSponsors = () => {
  return { type: REQUEST_SPONSORS, data: {} };
};

/** Requests */

export const setRequest = requestStr => {
  return { type: FETCH_ACTION, data: { str: requestStr } };
};

/** Organizers */

export const requestOrganizers = () => {
  return { type: REQUEST_ORGANIZERS, data: {} };
};

/** Views */

export const viewTrack = trackName => {
  return {
    type: VIEW_TRACK,
    data: {
      trackName
    }
  };
};
