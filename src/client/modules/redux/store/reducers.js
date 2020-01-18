import {
  RECEIVE_CONFERENCES,
  RECEIVE_SESSIONS,
  RECEIVE_SPEAKERS,
  RECEIVE_SPONSORS,
  REQUEST_SPONSORS,
  REQUEST_SPEAKERS,
  REQUEST_SESSIONS,
  SET_CONFERENCE,
  SIDE_MENU_OPEN,
  SIDE_MENU_CLOSE
} from 'redux/shared';

export function conference(state = {}, { type, data }) {
  switch (type) {
    case SET_CONFERENCE:
      return { ...data.val };
    case RECEIVE_CONFERENCES:
      // TODO: put all these side effects somewhere other than the reducer
      return data.val.reduce(
        (acc, c) => {
          if (
            parseInt(acc.year, 10) < parseInt(c.year, 10) &&
            new Date() >= new Date(c.rampUpDate)
          ) {
            acc = c;
          }
          return acc;
        },
        { year: 0 }
      );
    default:
      return state;
  }
}

export function conferences(state = {}, { type, data }) {
  switch (type) {
    case RECEIVE_CONFERENCES:
      return { ...data.val };
    default:
      return state;
  }
}

export function sessions(state = {}, { type, data }) {
  switch (type) {
    case RECEIVE_SESSIONS:
      return {
        ...state,
        ...data.val.reduce((res, r) => {
          res[r.id] = r;
          return res;
        }, {})
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
        ...data.val.reduce((res, r) => {
          res[r.id] = r;
          return res;
        }, {})
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
        ...data.val.reduce((res, r) => {
          res[r.id] = r;
          return res;
        }, {})
      };
    default:
      return state;
  }
}

export function requests(state = [], { type }) {
  switch (type) {
    case REQUEST_SPONSORS:
    case REQUEST_SPEAKERS:
    case REQUEST_SESSIONS:
      return [...state, type];
    case RECEIVE_SPONSORS:
      return state.filter(r => r !== REQUEST_SPONSORS);
    case RECEIVE_SPEAKERS:
      return state.filter(r => r !== REQUEST_SPEAKERS);
    case RECEIVE_SESSIONS:
      return state.filter(r => r !== REQUEST_SESSIONS);
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
