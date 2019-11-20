import { LightningElement, track, wire } from 'lwc';
import { connectStore, store } from 'redux/store';
import { openMenu, closeMenu } from 'redux/actions';

export default class LayoutHeader extends LightningElement {
  @track showMenu = false;
  @track menuWrapperClass = '';

  menuToggled = event => {
    event.preventDefault();
    this.toggleMenu(this.showMenu);
  };

  toggleMenu = menuIsOpen => {
    if (menuIsOpen) {
      store.dispatch(closeMenu());
    } else {
      store.dispatch(openMenu());
    }
  };

  @wire(connectStore, { store })
  storeChange({ menu }) {
    this.showMenu = menu.isOpen;
    this.menuWrapperClass = menu.isOpen ? 'slide-out' : '';
  }

  /*

  // In case you would like to use Redux On Platform there are options
  // Here is an example of how you might do that

  storeChange = ({ menu }) => {
    this.showMenu = menu.isOpen;
    this.menuWrapperClass = menu.isOpen ? 'slide-out' : '';
  };

  reduxSubscription;
  connectedCallback() {
      // run the try catch because the error that propagates has been tied to the component that calls the first action rather than the redux subscription that actually causes the error
    try {
      this.reduxSubscription = store.subscribe(() => {
        this.storeChange(store.getState());
      });
    } catch (err) {
      console.log('Header Redux Subscription error : ', err);
    }
  }

  disconnectedCallback() {
    if (this.reduxSubscription) {
      this.reduxSubscription();
    }
  }

  */

  menuItems = [
    {
      title: 'Conference',
      link: '/',
      iconName: 'conference',
      subItems: [
        {
          title: 'Speakers',
          link: '/speakers',
          iconName: 'speaker'
        },
        {
          title: 'Sponsors',
          link: '/sponsors',
          iconName: 'sponsor'
        },
        {
          title: 'Sessions',
          link: '/sessions',
          iconName: 'session'
        },
        {
          title: 'Venue',
          link: '/venue',
          iconName: 'venue'
        }
      ]
    },
    {
      title: 'Coming Soon',
      link: '/planning',
      iconName: 'planning',
      subItems: [
        {
          title: 'Register',
          link: '/register',
          iconName: 'register'
        },
        {
          title: 'Call for Speakers',
          link: '/speaker-sign-up',
          iconName: 'speaker'
        },
        {
          title: 'Sponsor Snowforce',
          link: '/sponsor-sign-up',
          iconName: 'sponsor'
        },
        {
          title: 'Volunteer',
          link: '/volunteer',
          iconName: 'volunteer'
        }
      ]
    },
    {
      title: 'About',
      link: '/about',
      iconName: 'about',
      subItems: [
        {
          title: 'Organizers',
          link: '/organizers',
          iconName: 'organizer'
        },
        {
          title: 'Past Events',
          link: '/past-events',
          iconName: 'history'
        },
        {
          title: 'Github',
          link: 'https://github.com/snowforce',
          iconName: 'github'
        }
      ]
    }
  ];
}
