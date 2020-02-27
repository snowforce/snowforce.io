import { ValueChangedEvent } from '@lwc/wire-service';

export const imperativeArrayFactory = async (
  store,
  selector,
  action,
  params
) => {
  function getData() {
    return {
      data: Object.values(selector(store.getState(), params)),
      error: undefined
    };
  }

  return new Promise((res, rej) => {
    try {
      if (action) {
        store.dispatch(action(params)).then(() => {
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
  params
) => {
  function getData() {
    return {
      data: selector(store.getState(), params),
      error: undefined
    };
  }

  return new Promise((res, rej) => {
    try {
      if (action) {
        store.dispatch(action(params)).then(() => {
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
    let store;
    let subscription;
    let data = [];
    let params = {};

    const notifyStateChange = newData => {
      eventTarget.dispatchEvent(
        new ValueChangedEvent({ data: newData, error: undefined })
      );
    };

    const debounceNotifications = () => {
      const newData = Object.values(reduxSelector(store.getState(), params));
      if (
        newData.length !== data.length ||
        JSON.stringify(newData) !== JSON.stringify(data)
      ) {
        data = [...newData];
        notifyStateChange([...newData]);
      }
    };

    const subscribeRedux = () => {
      subscription = store.subscribe(() => {
        debounceNotifications();
      });
    };

    eventTarget.addEventListener('config', configParams => {
      if (configParams) {
        store = configParams.store;
        params = { ...configParams };
      }

      if (!subscription) {
        subscribeRedux();
      }
      if (reduxFetchAction) {
        store.dispatch(reduxFetchAction(params));
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
    let store;
    let subscription;
    let data = {};
    let params = {};

    const notifyStateChange = newData => {
      eventTarget.dispatchEvent(
        new ValueChangedEvent({ data: newData, error: undefined })
      );
    };

    const debounceNotifications = () => {
      const newData = reduxSelector(store.getState(), params);
      if (JSON.stringify(newData) !== JSON.stringify(data)) {
        data = { ...newData };
        notifyStateChange({ ...newData });
      }
    };

    const subscribeRedux = () => {
      subscription = store.subscribe(() => {
        debounceNotifications();
      });
    };

    eventTarget.addEventListener('config', configParams => {
      if (configParams) {
        store = configParams.store;
        params = { ...configParams };
      }

      if (!subscription) {
        subscribeRedux();
      }
      if (reduxFetchAction) {
        store.dispatch(reduxFetchAction(params));
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
