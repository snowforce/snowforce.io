import {
  RECEIVE_CONFERENCES,
  RECEIVE_SESSIONS,
  RECEIVE_SPEAKERS,
  RECEIVE_SPONSORS,
  SET_CONFERENCE,
  VIEW_MENU_OPEN,
  VIEW_MENU_CLOSE,
  SET_SESSION_FILTER,
  CLEAR_SESSION_FILTERS,
  VIEW_TRACK,
  VIEW_DAY,
  ADD_REQUEST,
  CLEAR_REQUEST,
  COOKIES_ACCEPT,
  COOKIES_REJECT,
  BOOKMARKS_UPDATE
} from 'redux/shared';

export function user(state = {}, { type, payload }) {
  switch (type) {
    case COOKIES_ACCEPT:
      return {
        ...state,
        cookiesAcceptedAt: payload.now,
        cookiesRejectedAt: undefined
      };
    case COOKIES_REJECT:
      return {
        ...state,
        cookiesAcceptedAt: undefined,
        cookiesRejectedAt: payload.now
      };
    default:
      return state;
  }
}

export function conference(state = {}, { type, data }) {
  switch (type) {
    case SET_CONFERENCE:
      return { ...data.val };
    case RECEIVE_CONFERENCES:
      // TODO: the current date can change the output, need to put side effects elsewhere
      return data.val.reduce(
        (acc, c) => {
          if (
            parseInt(acc.year, 10) < parseInt(c.year, 10) ||
            c.isRampUp ||
            c.isRunning
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

export function requests(state = [], action) {
  switch (action.type) {
    case ADD_REQUEST:
      return [...state, action.data.type];
    case CLEAR_REQUEST:
      return state.filter(r => r.type !== action.data.type);
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

export function sessionFilters(
  state = {
    track: 'All',
    audience: 'All',
    level: 'All',
    format: 'All',
    startTime: 'All',
    searchTerm: ''
  },
  action
) {
  switch (action.type) {
    case SET_SESSION_FILTER:
      return {
        ...state,
        [action.data.filter]: action.data.val
      };
    case CLEAR_SESSION_FILTERS:
      return {
        track: 'All',
        audience: 'All',
        level: 'All',
        format: 'All',
        startTime: 'All',
        searchTerm: ''
      };
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

export function bookmarks(state = {}, { type = '', payload = {} }) {
  switch (type) {
    case BOOKMARKS_UPDATE:
      return payload.bookmarks;
    default:
      return state;
  }
}
