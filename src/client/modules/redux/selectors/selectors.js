import { createSelector } from 'reselect';

/**
 * Checks for value and returns true if lowercase strings are equal.
 * @param {String} String 1
 * @param {String} String 2
 */
const compareStr = (s1, s2) => {
  if (s1 && s2) {
    return s1.toLowerCase() === s2.toLowerCase();
  }
  return false;
};

/************************************************* Base Selectors *************************************************/

/**
 * Returns Conference from ReduxStore.
 * @param {object} reduxStore.getState()
 */
export const conferenceSelector = ({ conference }) => conference;

/**
 * Returns Conference Year from ReduxStore.
 * @param {object} reduxStore.getState()
 */
export const currentYearSelector = createSelector(
  conferenceSelector,
  ({ year }) => {
    return year;
  }
);

/**
 * Returns Sessions from ReduxStore.
 * @param {object} reduxStore.getState()
 */
const sessionSelector = ({ sessions }) => sessions;

/**
 * Returns Speakers from ReduxStore.
 * @param {object} reduxStore.getState()
 */
const speakerSelector = ({ speakers }) => speakers;

/**
 * Returns Sponsors from ReduxStore.
 * @param {object} reduxStore.getState()
 */
const sponsorSelector = ({ sponsors }) => sponsors;

/************************************************* Sessions *************************************************/

/**
 * Returns Sessions filtered by the current year from the Redux Store.
 * @param {object} reduxStore.getState()
 */
export const currentSessionsSelector = createSelector(
  conferenceSelector,
  sessionSelector,
  ({ year }, sessions) => {
    return sessions[year];
  }
);

/**
 * Returns Session by Id.
 * @param {object} reduxStore.getState()
 * @param {string} Session Id
 */
export const sessionByIdSelector = ({ sessions }, id) => {
  return Object.values(sessions)
    .reduce((res, s) => {
      return [...res, ...s];
    }, [])
    .reduce((res, s) => {
      return compareStr(s.id, id) ? s : res;
    }, undefined);
  //   return Object.values(sessions)
  //     .reduce((res, s) => {
  //       return [...res, ...s];
  //     }, [])
  //     .reduce((res, s) => {
  //       return compareStr(s.id, id) ? s : res;
  //     }, undefined);
};

/**
 * Returns Current Year Sessions filtered by Audience.
 * @param {object[]} Sessions array of session objects
 * @param {string} Audience - Customer, Admin/Dev, Stakeholder...
 */
export const sessionsByAudienceFilter = (sessions, audience) => {
  return sessions.filter(s => {
    return s.audience.reduce((acc, a) => acc || compareStr(a, audience), false);
  });
};

/**
 * Returns Current Year Sessions filtered by Audience.
 * @param {object} reduxStore.getState()
 * @param {string} Audience - Customer, Admin/Dev, Stakeholder...
 */
export const currentSessionsByAudienceSelector = (reduxState, audience) => {
  return sessionsByAudienceFilter(
    currentSessionsSelector(reduxState),
    audience
  );
};

/**
 * Returns Current Year Sessions filtered by Audience Level.
 * @param {object} reduxStore.getState()
 * @param {string} Audience Level - Beginner, Intermediate, Advanced...
 */
export const currentSessionsByLevelSelector = (reduxState, level) => {
  return currentSessionsSelector(reduxState).filter(s =>
    compareStr(s.audienceLevel, level)
  );
};

/**
 * Returns All Sessions with the Speaker Listed.
 * @param {object} reduxStore.getState()
 * @param {string} Speaker Id
 */
export const sessionsBySpeakerIdSelector = ({ sessions }, speakerId) => {
  return Object.values(sessions)
    .reduce((acc, s) => {
      return [...acc, ...s];
    }, [])
    .filter(s => s.speakers.includes(speakerId));
};

/**
 * Returns All Sessions with the Speaker Listed.
 * @param {object} reduxStore.getState()
 * @param {string} Year
 */
export const sessionsByYearSelector = ({ sessions }, year) => {
  return Object.values(sessions)
    .reduce((acc, s) => {
      return [...acc, ...s];
    }, [])
    .filter(s => s.year === year);
};

/************************************************* Speakers *************************************************/

export const speakersByIdFilter = (speakerArray, id) => {
  return speakerArray.reduce((acc, s) => {
    return compareStr(s.id, id) ? s : acc;
  }, {});
};

/**
 * Returns Speaker by Id.
 * @param {object} reduxStore.getState()
 * @param {string} Speaker Id
 */
export const speakerByIdSelector = ({ speakers }, id) => {
  return speakersByIdFilter(
    Object.values(speakers).reduce((acc, s) => {
      return [...acc, ...s];
    }, []),
    id
  );
};

/**
 * Returns All Speakers tied to Sessions for the Current Year.
 * @param {object} reduxStore.getState()
 */
export const currentSpeakersSelector = createSelector(
  currentYearSelector,
  speakerSelector,
  (year, speakers) => {
    return speakers[year];
  }
);

/**
 * Returns Speaker by Id.
 * @param {object} reduxStore.getState()
 * @param {string} Year
 */
export const speakersByYearSelector = ({ speakers }, year) => {
  return speakers[year];
};

/**
 * Returns All Speakers tagged on a Keynote for the Current year.
 * @param {object} reduxStore.getState()
 */
export const currentKeynotesSelector = reduxState => {
  return currentSpeakersSelector(reduxState).filter(s => s.isKeynote);
};

/**
 * Returns Speakers by Track for the Current Year.
 * @param {object} reduxStore.getState()
 * @param {string} Track - Admin, Developer, Marketing...
 */
export const currentSpeakersByTrackSelector = (reduxState, track) => {
  return currentSpeakersSelector(reduxState).filter(s =>
    compareStr(s.track, track)
  );
};

/**
 * Returns Sponsors for the current year by Level.
 * @param {object[]} Speakers Array of Speakers to filter for Keynotes
 */
export const keynoteSpeakerFilter = speakers => {
  return speakers.filter(s => s.isKeynote);
};

/************************************************* Sponsors *************************************************/

/**
 * Returns All Sponsors for the current year.
 * @param {object} reduxStore.getState()
 */
export const currentSponsorsSelector = createSelector(
  conferenceSelector,
  sponsorSelector,
  ({ year }, sponsors) => {
    return sponsors[year];
  }
);

/**
 * Returns Sponsor by Id.
 * @param {object} reduxStore.getState()
 * @param {string} Sponsor Id
 */
export const sponsorByIdSelector = ({ sponsors }, sponsorId) => {
  return sponsors.reduce((res, s) => {
    return s.id === sponsorId ? s : res;
  }, undefined);
};

/**
 * Returns Sponsors for the current year by Level.
 * @param {object} reduxStore.getState()
 * @param {string} Speaker Level: Gold, Platinum, Silver...
 */
export const currentSponsorsByLevelSelector = (reduxState, level) => {
  return currentSponsorsSelector(reduxState).filter(s => s.level === level);
};

/**
 * Returns Sponsors for the current year by Level.
 * @param {object} reduxStore.getState()
 * @param {string} Speaker Level: Gold, Platinum, Silver...
 */
export const sponsorsByYearSelector = (reduxState, year) => {
  return sponsorSelector(reduxState).filter(s => s.year === year);
};

/************************************************* Tracks *************************************************/

/**
 * Returns Tracks from the Current Sessions in the ReduxStore.
 * @param {object} reduxStore.getState()
 */
export const trackSelector = createSelector(
  currentSessionsSelector,
  sessions => {
    if (!sessions) return [];
    return sessions.reduce((acc, s) => {
      if (!acc.includes(s.track)) {
        acc.push(s.track);
      }
      return acc;
    }, []);
  }
);

/**
 * Returns the Name of the Track at the given Index.
 * @param {object} reduxStore.getState()
 * @param {number} Track Index
 */
export const trackNameByIndexSelector = (reduxState, index) => {
  return trackSelector(reduxState)[index].name;
};

/**
 * Returns the Index of the Named Track.
 * @param {object} reduxStore.getState()
 * @param {string} Track Name
 */
export const trackIndexByNameSelector = (reduxState, name) => {
  return trackSelector(reduxState)
    .map(e => e.name)
    .indexOf(name);
};
