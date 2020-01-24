/* global process */

import { LightningElement, createElement } from 'lwc';
import Navigo from 'navigo';
import { store } from 'redux/store';
import { requestConferences } from 'redux/actions';

export default class AppContainer extends LightningElement {
  releaseVersion = process.env.RELEASE_VERSION;
  releaseDate = process.env.RELEASE_DATE;

  // eslint-disable-next-line no-restricted-globals
  router = new Navigo(location.origin, false);

  // some navigation events broadcast to set this to stop the deletion and creation of components
  createComponents = true;

  constructor() {
    super();

    store.dispatch(requestConferences());

    this.router.on({
      '': async () => {
        const { default: ViewHome } = await import(
          /* webpackChunkName: "view-home" */ 'view/home'
        );
        this.setPage('view-home', ViewHome);
      },
      '/about': async () => {
        const { default: ViewAbout } = await import(
          /* webpackChunkName: "view-about" */ 'view/about'
        );
        this.setPage('view-about', ViewAbout, {});
      },
      '/speaker/:id': async ({ id }) => {
        const { default: ViewSpeaker } = await import(
          /* webpackChunkName: "view-speaker" */ 'view/speaker'
        );
        this.setPage('view-speaker', ViewSpeaker, {
          speakerId: id
        });
      },
      '/speaker-sign-up': async () => {
        const { default: SpeakerSignUp } = await import(
          /* webpackChunkName: "view-speaker-sign-up" */ 'view/speakerSignUp'
        );
        this.setPage('view-speaker-sign-up', SpeakerSignUp, {});
      },
      '/schedule': async () => {
        const { default: ViewSchedule } = await import(
          /* webpackChunkName: "view-schedule" */ 'view/schedule'
        );
        this.setPage('view-schedule', ViewSchedule, {});
      },
      '/venue': async () => {
        const { default: ViewVenue } = await import(
          /* webpackChunkName: "view-speaker" */ 'view/venue'
        );
        this.setPage('view-venue', ViewVenue, {});
      },
      '/register': async () => {
        const { default: ViewRegister } = await import(
          /* webpackChunkName: "view-speaker" */ 'view/register'
        );
        this.setPage('view-register', ViewRegister, {});
      },
      '/sponsors': async () => {
        const { default: ViewSponsors } = await import(
          /* webpackChunkName: "view-sponsors" */ 'view/sponsors'
        );
        this.setPage('view-sponsors', ViewSponsors, {});
      },
      '/sponsor/:id': async ({ id }) => {
        const { default: ViewSponsor } = await import(
          /* webpackChunkName: "view-sponsor" */ 'view/sponsor'
        );
        this.setPage('view-sponsor', ViewSponsor, {
          sponsorId: id
        });
      },
      '/sponsor-sign-up': async () => {
        const { default: ViewSponsorSignUp } = await import(
          /* webpackChunkName: "view-sponsor-sign-up" */ 'view/sponsorSignUp'
        );
        this.setPage('view-sponsor-sign-up', ViewSponsorSignUp, {});
      },
      '/speakers': async () => {
        const { default: ViewSpeakers } = await import(
          /* webpackChunkName: "view-speakers" */ 'view/speakers'
        );
        this.setPage('view-speakers', ViewSpeakers);
      },
      '/session/:id': async ({ id }) => {
        const { default: ViewSession } = await import(
          /* webpackChunkName: "view-session" */ 'view/session'
        );
        this.setPage('view-session', ViewSession, {
          sessionId: id
        });
      },
      '/sessions': async () => {
        const { default: ViewSessions } = await import(
          /* webpackChunkName: "view-sessions" */ 'view/sessions'
        );
        this.setPage('view-sessions', ViewSessions);
      },
      '/sessions/:track': async ({ track }) => {
        const { default: ViewSessions } = await import(
          /* webpackChunkName: "view-sessions" */ 'view/sessions'
        );
        this.setPage('view-sessions', ViewSessions, {
          track: track.toLowerCase()
        });
      },
      '/organizers': async () => {
        const { default: ViewOrganizers } = await import(
          /* webpackChunkName: "view-organizers" */ 'view/organizers'
        );
        this.setPage('view-organizers', ViewOrganizers);
      },
      '/past-events': async () => {
        const { default: ViewPastEvents } = await import(
          /* webpackChunkName: "view-past-events" */ 'view/pastEvents'
        );
        this.setPage('view-past-events', ViewPastEvents);
      },
      '/volunteer': async () => {
        const { default: ViewVolunteer } = await import(
          /* webpackChunkName: "view-volunteer" */ 'view/volunteer'
        );
        this.setPage('view-volunteer', ViewVolunteer);
      }
    });

    const navigateToDefault = () => {
      //   console.log('R : ' + JSON.stringify(this.router));
    };

    this.router.notFound(navigateToDefault);
    this.router.on(navigateToDefault);
  }

  renderedCallback() {
    // Resolve the current view only after the container has rendered
    if (this.isRendered) {
      return;
    }

    this.isRendered = true;
    this.router.resolve();

    this.template.querySelector('.container').addEventListener(
      'scroll',
      event => {
        this.template.querySelector('base-back-button').scrollTop = event;
      },
      { passive: true }
    );
  }

  handleOpenMenuEvent() {
    this.template.querySelector('base-menu').open();
  }

  handleNavigateEvent = event => {
    const { link, createComponents, scrollUp } = event.detail;
    this.createComponents = createComponents !== false;
    this.router.navigate(link);

    if (scrollUp !== false) {
      this.template
        .querySelector('.container')
        .scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  setPage(tagName, component, props = {}) {
    if (!this.createComponents) {
      this.createComponents = true;
      return;
    }
    const el = createElement(tagName, {
      is: component,
      fallback: false
    });

    Object.assign(el, props);

    // Remove previous components from the content container if necessary
    const container = this.template.querySelector('.content');
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(el);
  }
}
