import {
  RECEIVE_SESSIONS,
  RECEIVE_SPEAKERS,
  RECEIVE_SPONSORS,
  RECEIVE_SUBMISSIONS,
  RECEIVE_TRACKS,
  RECEIVE_AUDIENCES,
  RECEIVE_SPONSOR_LEVELS,
  SET_CONFERENCE_YEAR,
  SIDE_MENU_OPEN,
  SIDE_MENU_CLOSE
} from 'redux/shared';

export function conference(state = { year: 2019 }, { type, data }) {
  switch (type) {
    case SET_CONFERENCE_YEAR:
      return {
        ...state,
        year: data.year
      };
    default:
      return state;
  }
}

export function sessions(state = {}, { type, data }) {
  switch (type) {
    case RECEIVE_SESSIONS:
      return {
        ...state,
        [data.year]: data.val
      };
    default:
      return state;
  }
}

export function speakers(state = {}, { type, data }) {
  switch (type) {
    case RECEIVE_SPEAKERS:
      return {
        ...state,
        [data.year]: data.val
      };
    default:
      return state;
  }
}

export function sponsors(state = {}, { type, data }) {
  switch (type) {
    case RECEIVE_SPONSORS:
      return {
        ...state,
        [data.year]: data.val
      };
    default:
      return state;
  }
}

export function tracks(state = {}, { type, data }) {
  switch (type) {
    case RECEIVE_TRACKS:
      return {
        ...state,
        [data.year]: data.val
      };
    default:
      return state;
  }
}

export function audiences(state = {}, { type, data }) {
  switch (type) {
    case RECEIVE_AUDIENCES:
      return {
        ...state,
        [data.year]: data.val
      };
    default:
      return state;
  }
}

export function sponsorLevels(state = {}, { type, data }) {
  switch (type) {
    case RECEIVE_SPONSOR_LEVELS:
      return {
        ...state,
        [data.year]: data.val
      };
    default:
      return state;
  }
}

export function submission(state = {}, { type, data }) {
  switch (type) {
    case RECEIVE_SUBMISSIONS:
      return {
        ...state,
        [data.year]: data.val
      };
    default:
      return state;
  }
}

export function menu(state = { isOpen: false }, { type }) {
  switch (type) {
    case SIDE_MENU_OPEN:
      return {
        isOpen: true
      };
    case SIDE_MENU_CLOSE:
      return {
        isOpen: false
      };
    default:
      return state;
  }
}
