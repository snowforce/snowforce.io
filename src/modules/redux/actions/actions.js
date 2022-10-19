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
  REQUEST_ORGANIZERS,
  RECEIVE_ORGANIZERS,
  REQUEST_SESSION,
  ADD_REQUEST,
  CLEAR_REQUEST,
  BOOKMARKS_UPDATE,
  SET_SESSION_FILTER
} from 'redux/shared';

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

const getIsRunning = ({ startDate, endDate }, today) => {
  if (!today || !startDate || !endDate) return false;
  return today >= new Date(startDate) && today <= new Date(endDate);
};

const getIsRampUp = ({ startDate, rampUpDate }, today) => {
  if (!today || !startDate) return false;
  return today >= new Date(rampUpDate) && today < new Date(startDate);
};

const getIsOver = ({ endDate }, today) => {
  if (!today || !endDate) return true;
  return today > new Date(endDate);
};

const getIsRegistrationOpen = (
  { registrationStart, registrationEnd },
  today
) => {
  if (!today || !registrationStart || !registrationEnd) return false;
  return (
    today >= new Date(registrationStart) && today <= new Date(registrationEnd)
  );
};

const getIsVolunteerOpen = ({ volunteerStart, volunteerEnd }, today) => {
  if (!today || !volunteerStart || !volunteerEnd) return false;
  return today >= new Date(volunteerStart) && today <= new Date(volunteerEnd);
};

const getIsSponsorOpen = ({ sponsorStart, sponsorEnd }, today) => {
  if (!today || !sponsorStart || !sponsorEnd) return false;
  return today >= new Date(sponsorStart) && today <= new Date(sponsorEnd);
};

const getIsSpeakerOpen = ({ speakerStart, speakerEnd }, today) => {
  if (!today || !speakerStart || !speakerEnd) return false;
  return today >= new Date(speakerStart) && today <= new Date(speakerEnd);
};

const checkDateSettings = (conference, today = new Date()) => {
  return {
    isRunning: getIsRunning(conference, today),
    isRampUp: getIsRampUp(conference, today),
    isOver: getIsOver(conference, today),
    isRegistrationOpen: getIsRegistrationOpen(conference, today),
    isVolunteerOpen: getIsVolunteerOpen(conference, today),
    isSponsorOpen: getIsSponsorOpen(conference, today),
    isSpeakerOpen: getIsSpeakerOpen(conference, today)
  };
};

export const receiveConferences = conferences => {
  const today = new Date();
  return {
    type: RECEIVE_CONFERENCES,
    data: {
      val: conferences.map(c => {
        return {
          ...c,
          ...checkDateSettings(c, today)
        };
      })
    }
  };
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

const formatTime = t => {
  const tArray = t.split(':');
  // TODO: internationalize this
  const hourNum = parseInt(tArray[0], 10);
  if (hourNum) {
    const hour = hourNum > 12 ? hourNum - 12 : hourNum;
    const min = tArray[1];
    const tag = hourNum >= 12 ? 'pm' : 'am';
    return `${hour}:${min}${tag}`;
  }
  return t;
};

export const receiveSessions = sessions => {
  return {
    type: RECEIVE_SESSIONS,
    data: {
      val: sessions
        .map(s => {
          return {
            ...s,
            time: formatTime(s.time),
            endTime: formatTime(s.endTime),
            startDateTime: new Date(`${s.date}T${s.time}`)
          };
        })
        .sort((a, b) => a.startDateTime - b.startDateTime)
    }
  };
};

export const requestSession = id => {
  return { type: REQUEST_SESSION, data: { id } };
};

export const requestSessions = () => {
  return { type: REQUEST_SESSIONS, data: {} };
};

export const sessionsFilterTrack = ({ selectorParam }) => {
  return {
    type: SET_SESSION_FILTER,
    data: { filter: 'track', val: selectorParam }
  };
};

export const sessionsFilterAudience = ({ selectorParam }) => {
  return {
    type: SET_SESSION_FILTER,
    data: { filter: 'audience', val: selectorParam }
  };
};

export const sessionsFilterLevel = ({ selectorParam }) => {
  return {
    type: SET_SESSION_FILTER,
    data: { filter: 'level', val: selectorParam }
  };
};

export const sessionsFilterFormat = ({ selectorParam }) => {
  return {
    type: SET_SESSION_FILTER,
    data: { filter: 'format', val: selectorParam }
  };
};

export const sessionsFilterStartTime = ({ selectorParam }) => {
  return {
    type: SET_SESSION_FILTER,
    data: { filter: 'startTime', val: selectorParam }
  };
};

/** Speakers */

export const receiveSpeakers = speakers => {
  return { type: RECEIVE_SPEAKERS, data: { val: speakers } };
};

export const requestSpeakers = () => {
  return { type: REQUEST_SPEAKERS, data: {} };
};

export const requestSpeaker = id => {
  return { type: REQUEST_SPEAKER, data: { id } };
};

/** Sponsors */

export const receiveSponsors = sponsors => {
  return { type: RECEIVE_SPONSORS, data: { val: sponsors } };
};

export const requestSponsors = () => {
  return { type: REQUEST_SPONSORS, data: {} };
};

/** Requests */

export const setRequest = requestStr => {
  return { type: FETCH_ACTION, data: { str: requestStr } };
};

/** Organizers */

export const receiveOrganizers = organizers => {
  return { type: RECEIVE_ORGANIZERS, data: { val: organizers } };
};

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

export const addRequest = requestType => {
  return { type: ADD_REQUEST, data: { type: requestType } };
};

export const clearRequest = requestType => {
  return { type: CLEAR_REQUEST, data: { type: requestType } };
};

export const updateBookmarks = ({ bookmarks }) => {
  return {
    type: BOOKMARKS_UPDATE,
    payload: { bookmarks }
  };
};
