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

export const currentYearSelector = ({ conference: { year } }) => {
  return year;
};

export const requestsSelector = ({ requests }) => {
  return requests;
};

/************************************************* Sessions *************************************************/

export const conferencesSelector = ({ conferences }) => {
  return conferences;
};

/************************************************* Sessions *************************************************/

/**
 * Returns Sessions filtered by the current year from the Redux Store.
 * @param {object} reduxState reduxStore.getState()
 */
export const currentSessionsSelector = ({ conference: { year }, sessions }) => {
  return Object.values(sessions).filter(
    s => parseInt(s.year, 10) === parseInt(year, 10)
  );
};

/**
 * Returns Session by Id.
 * @param {object} reduxState reduxStore.getState()
 * @param {string} Session Id
 */
export const sessionByIdSelector = ({ sessions }, id) => {
  return sessions[id];
};

/**
 * Returns Current Year Sessions filtered by Audience.
 * @param {object} reduxState reduxStore.getState()
 * @param {string} Audience - Customer, Admin/Dev, Stakeholder...
 */
export const currentSessionsByAudienceSelector = (reduxState, audience) => {
  return currentSessionsSelector(reduxState).filter(s => {
    return s.audience.reduce((acc, a) => acc || compareStr(a, audience), false);
  });
};

/**
 * Returns Current Year Sessions filtered by Audience Level.
 * @param {object} reduxState reduxStore.getState()
 * @param {string} Audience Level - Beginner, Intermediate, Advanced...
 */
export const currentSessionsByLevelSelector = (reduxState, level) => {
  return currentSessionsSelector(reduxState).filter(s =>
    compareStr(s.audienceLevel, level)
  );
};

/**
 * Returns All Sessions with the Speaker Listed.
 * @param {object} reduxState reduxStore.getState()
 * @param {string} Speaker Id
 */
export const sessionsBySpeakerIdSelector = (
  { speakers, sessions },
  speakerId
) => {
  return speakers[speakerId].sessions.map(sId => sessions[sId]);
};

/**
 * Returns All Sessions with the Speaker Listed.
 * @param {object} reduxState reduxStore.getState()
 * @param {string} Year
 */
export const sessionsByYearSelector = ({ sessions }, year) => {
  return Object.values(sessions).filter(
    s => parseInt(s.year, 10) === parseInt(year, 10)
  );
};

/************************************************* Speakers *************************************************/

/**
 * Returns Speaker by Id.
 * @param {object} reduxState reduxStore.getState()
 * @param {string} Speaker Id
 */
export const speakerByIdSelector = ({ speakers }, id) => {
  return speakers[id];
};

/**
 * Returns All Speakers tied to Sessions for the Current Year.
 * @param {object} reduxState reduxStore.getState()
 */
export const currentSpeakersSelector = ({ speakers, conference: { year } }) => {
  return Object.values(speakers).filter(
    s => parseInt(s.year, 10) === parseInt(year, 10)
  );
};

/**
 * Returns Speaker by Id.
 * @param {object} reduxState reduxStore.getState()
 * @param {string} Year
 */
export const speakersByYearSelector = ({ speakers }, year) => {
  return Object.values(speakers).filter(
    s => parseInt(s.year, 10) === parseInt(year, 10)
  );
};

/**
 * Returns All Speakers tagged on a Keynote for the Current year.
 * @param {object} reduxState reduxStore.getState()
 */
export const currentKeynotesSelector = reduxState => {
  return currentSpeakersSelector(reduxState).filter(s => s.isKeynote);
};

/**
 * Returns Speakers by Track for the Current Year.
 * @param {object} reduxState reduxStore.getState()
 * @param {string} Track - Admin, Developer, Marketing...
 */
export const currentSpeakersByTrackSelector = (reduxState, track) => {
  return currentSpeakersSelector(reduxState).filter(s =>
    compareStr(s.track, track)
  );
};

/************************************************* Sponsors *************************************************/

/**
 * Returns All Sponsors for the current year.
 * @param {object} reduxState reduxStore.getState()
 */
export const currentSponsorsSelector = ({ conference: { year }, sponsors }) => {
  return Object.values(sponsors).filter(
    s => parseInt(s.year, 10) === parseInt(year, 10)
  );
};

/**
 * Returns Sponsor by Id.
 * @param {object} reduxState reduxStore.getState()
 * @param {string} Sponsor Id
 */
export const sponsorByIdSelector = ({ sponsors }, sponsorId) => {
  return sponsors[sponsorId];
};

/**
 * Returns Sponsors for the current year by Level.
 * @param {object} reduxState reduxStore.getState()
 * @param {string} Speaker Level: Gold, Platinum, Silver...
 */
export const currentSponsorsByLevelSelector = (reduxState, level) => {
  createSelector(currentSponsorsSelector, sponsors => {
    return sponsors.filter(s => s.level === level);
  })(reduxState);
};

export const sponsorsByYearSelector = ({ sponsors }, year) => {
  return Object.values(sponsors).filter(
    s => parseInt(s.year, 10) === parseInt(year, 10)
  );
};

/************************************************* Tracks *************************************************/

/**
 * Returns Tracks from the Current Sessions in the ReduxStore.
 * @param {object} reduxState reduxStore.getState()
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
 * @param {object} reduxState reduxStore.getState()
 * @param {number} Track Index
 */
export const trackNameByIndexSelector = (reduxState, index) => {
  return trackSelector(reduxState)[index].name;
};

/**
 * Returns the Index of the Named Track.
 * @param {object} reduxState reduxStore.getState()
 * @param {string} Track Name
 */
export const trackIndexByNameSelector = (reduxState, name) => {
  return trackSelector(reduxState)
    .map(e => e.name)
    .indexOf(name);
};
