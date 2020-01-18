//  https://github.com/salesforce/lwc/tree/master/packages/%40lwc/wire-service

import { register, ValueChangedEvent } from '@lwc/wire-service';

import {
  currentConferenceSelector,
  currentSponsorsSelector,
  currentSpeakersSelector,
  currentYearSelector
} from 'redux/selectors';

import {
  requestSessions,
  requestSpeakers,
  requestSponsors
} from 'redux/actions';

// eslint-disable-next-line no-unused-vars
export function connectStore(store, ...args) {
  return store.getState();
}

register(connectStore, eventTarget => {
  let store;
  let subscription;

  const notifyStateChange = () => {
    eventTarget.dispatchEvent(new ValueChangedEvent(store.getState()));
  };

  const subscribeRedux = () => {
    subscription = store.subscribe(() => {
      notifyStateChange();
    });
  };

  eventTarget.addEventListener('config', config => {
    store = config.store;
    subscribeRedux();
    notifyStateChange();
  });

  eventTarget.addEventListener('disconnect', () => {
    if (subscription) {
      subscription();
    }
  });
});

export function wireCurrentSponsors(store) {
  return currentSponsorsSelector(store.getState());
}

register(wireCurrentSponsors, eventTarget => {
  let store;
  let subscription;

  const notifyStateChange = () => {
    eventTarget.dispatchEvent(
      new ValueChangedEvent(wireCurrentSponsors(store))
    );
  };

  const subscribeRedux = () => {
    let year = currentYearSelector(store.getState());
    store.dispatch(requestSponsors(year));

    subscription = store.subscribe(() => {
      year = currentYearSelector(store.getState());
      store.dispatch(requestSponsors(year));
      notifyStateChange();
    });
    notifyStateChange();
  };

  eventTarget.addEventListener('config', config => {
    store = config.store;
    subscribeRedux();
    notifyStateChange();
  });

  eventTarget.addEventListener('disconnect', () => {
    if (subscription) {
      subscription();
    }
  });
});

// eslint-disable-next-line no-unused-vars
export function wireCurrentSpeakers(store, ...args) {
  return currentSpeakersSelector(store.getState());
}

register(wireCurrentSpeakers, eventTarget => {
  let store;
  let subscription;

  const notifyStateChange = () => {
    eventTarget.dispatchEvent(
      new ValueChangedEvent(wireCurrentSpeakers(store))
    );
  };

  const subscribeRedux = () => {
    let year = currentYearSelector(store.getState());
    store.dispatch(requestSpeakers(year));

    subscription = store.subscribe(() => {
      year = currentYearSelector(store.getState());
      store.dispatch(requestSpeakers(year));
      notifyStateChange();
    });
    notifyStateChange();
  };

  eventTarget.addEventListener('config', config => {
    store = config.store;
    subscribeRedux();
    notifyStateChange();
  });

  eventTarget.addEventListener('disconnect', () => {
    if (subscription) {
      subscription();
    }
  });
});

// eslint-disable-next-line no-unused-vars
export function wireCurrentSessions(store, ...args) {
  return store.getState();
}

register(wireCurrentSessions, eventTarget => {
  let store;
  let subscription;

  const notifyStateChange = () => {
    eventTarget.dispatchEvent(
      new ValueChangedEvent(wireCurrentSessions(store))
    );
  };

  const subscribeRedux = () => {
    let year = currentYearSelector(store.getState());
    store.dispatch(requestSpeakers(year));
    store.dispatch(requestSessions(year));

    subscription = store.subscribe(() => {
      year = currentYearSelector(store.getState());
      store.dispatch(requestSpeakers(year));
      store.dispatch(requestSessions(year));
      notifyStateChange();
    });
    notifyStateChange();
  };

  eventTarget.addEventListener('config', config => {
    store = config.store;
    subscribeRedux();
    notifyStateChange();
  });

  eventTarget.addEventListener('disconnect', () => {
    if (subscription) {
      subscription();
    }
  });
});

// eslint-disable-next-line no-unused-vars
export function wireCurrentConference(store, ...args) {
  return currentConferenceSelector(store.getState());
}

register(wireCurrentConference, eventTarget => {
  let store;
  let subscription;

  const notifyStateChange = () => {
    eventTarget.dispatchEvent(
      new ValueChangedEvent(wireCurrentConference(store))
    );
  };

  const subscribeRedux = () => {
    let year = currentYearSelector(store.getState());
    store.dispatch(requestSpeakers(year));
    store.dispatch(requestSessions(year));

    subscription = store.subscribe(() => {
      year = currentYearSelector(store.getState());
      store.dispatch(requestSpeakers(year));
      store.dispatch(requestSessions(year));
      notifyStateChange();
    });
    notifyStateChange();
  };

  eventTarget.addEventListener('config', config => {
    store = config.store;
    subscribeRedux();
    notifyStateChange();
  });

  eventTarget.addEventListener('disconnect', () => {
    if (subscription) {
      subscription();
    }
  });
});
