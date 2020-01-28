import { ValueChangedEvent } from '@lwc/wire-service';

export const imperativeArrayFactory = async (
  store,
  selector,
  action,
  param
) => {
  function getData() {
    return {
      data: Object.values(selector(store.getState(), param)),
      error: undefined
    };
  }

  return new Promise((res, rej) => {
    try {
      if (action) {
        store.dispatch(action()).then(() => {
          res(getData());
        });
      } else {
        res(getData());
      }
    } catch (error) {
      rej({ data: undefined, error });
    }
  });
};

export const imperativeObjectFactory = async (
  store,
  selector,
  action,
  param
) => {
  function getData() {
    return {
      data: selector(store.getState(), param),
      error: undefined
    };
  }

  return new Promise((res, rej) => {
    try {
      if (action) {
        store.dispatch(action()).then(() => {
          res(getData());
        });
      } else {
        res(getData());
      }
    } catch (error) {
      rej({ data: undefined, error });
    }
  });
};

/********* Wire Adapter Registration Functions */

// TODO: add returns for any errors

export const wireArrayFactory = (reduxSelector, reduxFetchAction) => {
  return function(eventTarget) {
    let reduxStore;
    let subscription;
    let data = [];
    let param;

    const notifyStateChange = newData => {
      eventTarget.dispatchEvent(
        new ValueChangedEvent({ data: newData, error: undefined })
      );
    };

    const debounceNotifications = () => {
      const newData = Object.values(
        // FIXME: requiring the param in this fashion creates a leaky abstraction
        // the end user needs to know the selector signature and order the param correctly
        reduxSelector(reduxStore.getState(), param)
      );
      if (
        newData.length !== data.length ||
        JSON.stringify(newData) !== JSON.stringify(data)
      ) {
        data = [...newData];
        notifyStateChange([...newData]);
      }
    };

    const subscribeRedux = () => {
      subscription = reduxStore.subscribe(() => {
        debounceNotifications();
      });
    };

    eventTarget.addEventListener('config', ({ store, selectorParam }) => {
      reduxStore = store;
      param = selectorParam;
      if (!subscription) {
        subscribeRedux();
      }
      if (reduxFetchAction) {
        reduxStore.dispatch(reduxFetchAction(selectorParam));
      }
      debounceNotifications();
    });

    eventTarget.addEventListener('disconnect', () => {
      if (subscription) {
        subscription();
      }
    });
  };
};

export const wireObjectFactory = (reduxSelector, reduxFetchAction) => {
  return function(eventTarget) {
    let reduxStore;
    let subscription;
    let data = {};
    let param;

    const notifyStateChange = newData => {
      eventTarget.dispatchEvent(
        new ValueChangedEvent({ data: newData, error: undefined })
      );
    };

    const debounceNotifications = () => {
      // FIXME: requiring the param in this fashion creates a leaky abstraction
      // the end user needs to know the selector signature and order the param correctly
      const newData = reduxSelector(reduxStore.getState(), param);
      if (JSON.stringify(newData) !== JSON.stringify(data)) {
        data = { ...newData };
        notifyStateChange({ ...newData });
      }
    };

    const subscribeRedux = () => {
      subscription = reduxStore.subscribe(() => {
        debounceNotifications();
      });
    };

    eventTarget.addEventListener('config', ({ store, selectorParam }) => {
      reduxStore = store;
      param = selectorParam;
      subscribeRedux();
      if (reduxFetchAction) {
        reduxStore.dispatch(reduxFetchAction());
      }
      debounceNotifications();
    });

    eventTarget.addEventListener('disconnect', () => {
      if (subscription) {
        subscription();
      }
    });
  };
};
