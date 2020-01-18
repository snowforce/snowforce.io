export const RECEIVE_CONFERENCES = 'RECEIVE_CONFERENCES';
export const REQUEST_CONFERENCES = 'REQUEST_CONFERENCES';

export const RECEIVE_SPONSORS = 'RECEIVE_SPONSORS';
export const REQUEST_SPONSORS = 'REQUEST_SPONSORS';
export const REQUEST_SPONSOR = 'REQUEST_SPONSOR';

export const RECEIVE_SPEAKERS = 'RECEIVE_SPEAKERS';
export const REQUEST_SPEAKERS = 'REQUEST_SPEAKERS';
export const REQUEST_SPEAKER = 'REQUEST_SPEAKER';

export const RECEIVE_SESSIONS = 'RECEIVE_SESSIONS';
export const REQUEST_SESSIONS = 'REQUEST_SESSIONS';
export const REQUEST_SESSION = 'REQUEST_SESSION';

export const RECEIVE_TRACKS = 'RECEIVE_TRACKS';
export const REQUEST_TRACKS = 'REQUEST_TRACKS';

export const RECEIVE_SUBMISSIONS = 'RECEIVE_SUBMISSIONS';
export const RECEIVE_AUDIENCES = 'RECEIVE_AUDIENCES';
export const RECEIVE_SPONSOR_LEVELS = 'RECEIVE_SPONSOR_LEVELS';

export const SET_CONFERENCE_YEAR = 'SET_CONFERENCE_YEAR';
export const SET_TRACK_INDEX = 'SET_TRACK_INDEX';
export const SET_TRACK_NAME = 'SET_TRACK_NAME';

export const SIDE_MENU_OPEN = 'SIDE_MENU_OPEN';
export const SIDE_MENU_CLOSE = 'SIDE_MENU_CLOSE';

export const MAX_YEARS_AGO = 10;

// TODO: get this from data coming from Salesforce
export const FIRST_CONFERENCE_YEAR = 2019;

export const SESSIONS = 'sessions';
export const SPEAKERS = 'speakers';
export const SPONSORS = 'sponsors';
export const CONFERENCES = 'conferences';

export const FETCH_ACTION = 'FETCH_ACTION';

export const getRequestStr = (year, table) => {
  return `${year}|${table}`;
};
