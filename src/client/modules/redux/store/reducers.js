import {
  REQUEST_CONFERENCES,
  RECEIVE_CONFERENCES,
  REQUEST_SESSIONS,
  RECEIVE_SESSIONS,
  REQUEST_SPEAKERS,
  RECEIVE_SPEAKERS,
  REQUEST_SPONSORS,
  RECEIVE_SPONSORS,
  SET_CONFERENCE,
  VIEW_MENU_OPEN,
  VIEW_MENU_CLOSE,
  SET_TRACKS,
  VIEW_TRACK,
  VIEW_DAY
} from 'redux/shared';

export function conference(state = {}, { type, data }) {
  switch (type) {
    case SET_CONFERENCE:
      return { ...data.val };
    case RECEIVE_CONFERENCES:
      // TODO: the current date can change the output, need to put side effects elsewhere
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
      return data.val.reduce((acc, c) => {
        acc[c.year] = c;
        return acc;
      }, {});
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
    case REQUEST_CONFERENCES:
      return [...state, type];
    case RECEIVE_SPONSORS:
      return state.filter(r => r !== REQUEST_SPONSORS);
    case RECEIVE_SPEAKERS:
      return state.filter(r => r !== REQUEST_SPEAKERS);
    case RECEIVE_SESSIONS:
      return state.filter(r => r !== REQUEST_SESSIONS);
    case RECEIVE_CONFERENCES:
      return state.filter(r => r !== REQUEST_CONFERENCES);
    default:
      return state;
  }
}

export function menu(state = { isOpen: false }, { type }) {
  switch (type) {
    case VIEW_MENU_OPEN:
      return {
        isOpen: true
      };
    case VIEW_MENU_CLOSE:
      return {
        isOpen: false
      };
    default:
      return state;
  }
}

export function organizers(state = {}, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export function tracks(state = [], action) {
  switch (action.type) {
    case SET_TRACKS:
      return [...action.data];
    default:
      return state;
  }
}

export function view(
  state = { isMenuOpen: false, day: 0, track: 'all' },
  action
) {
  switch (action.type) {
    case VIEW_TRACK:
      return {
        ...state,
        track: action.data.trackName
      };
    case VIEW_DAY:
      return {
        ...state,
        day: action.data.day
      };
    case VIEW_MENU_OPEN:
      return {
        isMenuOpen: true
      };
    case VIEW_MENU_CLOSE:
      return {
        isMenuOpen: false
      };
    default:
      return state;
  }
}
