//  https://github.com/salesforce/lwc/tree/master/packages/%40lwc/wire-service

import { register, ValueChangedEvent } from '@lwc/wire-service';

import {
  currentSponsorsSelector,
  currentSpeakersSelector,
  trackSelector
} from 'redux/selectors';

import { fetchIfNeeded } from 'redux/actions';

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
    store.dispatch(fetchIfNeeded('sponsors'));

    subscription = store.subscribe(() => {
      store.dispatch(fetchIfNeeded('sponsors'));
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
    store.dispatch(fetchIfNeeded('speakers'));

    subscription = store.subscribe(() => {
      store.dispatch(fetchIfNeeded('speakers'));
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
    store.dispatch(fetchIfNeeded('speakers'));
    store.dispatch(fetchIfNeeded('sessions'));

    subscription = store.subscribe(() => {
      store.dispatch(fetchIfNeeded('speakers'));
      store.dispatch(fetchIfNeeded('sessions'));
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
export function wireCurrentTracks(store, ...args) {
  return trackSelector(store.getState());
}

register(wireCurrentTracks, eventTarget => {
  let store;
  let subscription;

  const notifyStateChange = () => {
    eventTarget.dispatchEvent(new ValueChangedEvent(wireCurrentTracks(store)));
  };

  const subscribeRedux = () => {
    store.dispatch(fetchIfNeeded('sessions'));

    subscription = store.subscribe(() => {
      store.dispatch(fetchIfNeeded('sessions'));
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
