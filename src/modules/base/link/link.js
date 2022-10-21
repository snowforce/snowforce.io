import { LightningElement, api } from 'lwc';

export default class BaseLink extends LightningElement {
  @api href = '';
  @api createComponents;
  @api scrollUp;

  fireTouchNav = false;
  setTouchEvents = false;

  renderedCallback() {
    if (this.setTouchEvents) {
      return;
    }

    const elm = this.template.querySelector('slot');
    elm.addEventListener('touchstart', this.touchStart);
    elm.addEventListener('touchmove', this.touchMove);
    elm.addEventListener('touchcancel', this.touchCancel);
    elm.addEventListener('touchend', this.touchEnd);

    this.setTouchEvents = true;
  }

  clickedLink = event => {
    event.preventDefault();

    // TODO: You can do better than a try catch...
    let openNewWindow = false;
    try {
      openNewWindow =
        event.ctrlKey ||
        event.metaKey ||
        event.button > 0 ||
        window.location.origin !== new URL(this.href).origin;
    } catch (e) {
      // eslint-disable-next-line no-console
      //   console.log('not a valid url');
    }

    if (openNewWindow) {
      window.open(this.href, '_blank');
    } else {
      this.navEvent();
    }
  };

  navEvent = () => {
    window.location.href = this.href;
    // const link = this.href;
    // const createComponents = this.createComponents;
    // const scrollUp = this.scrollUp;

    // history.pushState({}, '', this.href);
    // this.template.querySelector('slot').dispatchEvent(
    //   new CustomEvent('navigate', {
    //     bubbles: true,
    //     composed: true,
    //     detail: { link, createComponents, scrollUp }
    //   })
    // );
  };

  touchStart = () => {
    this.fireTouchNav = true;
  };

  touchMove = () => {
    this.fireTouchNav = false;
  };

  touchCancel = () => {
    this.fireTouchNav = false;
  };

  touchEnd = event => {
    event.preventDefault();
    if (this.fireTouchNav) {
      this.navEvent();
    }
  };
}
