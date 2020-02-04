import { LightningElement, track, wire } from 'lwc';
import { wireView, wireCurrentConference, store } from 'redux/store';
import { openMenu, closeMenu } from 'redux/actions';

export default class LayoutHeader extends LightningElement {
  @track showMenu = false;
  @track menuWrapperClass = '';

  @track conference = {};

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

  @wire(wireView, { store })
  wiredMenu({ data, error }) {
    if (data) {
      this.showMenu = data.isMenuOpen;
      this.menuWrapperClass = data.isMenuOpen ? 'slide-out' : '';
    } else if (error) {
      throw error;
    }
  }

  @wire(wireCurrentConference, { store })
  wiredStore({ data, error }) {
    if (error) {
      throw error;
    }
    this.conference = data;
  }

  menuItems = [
    {
      title: 'Snowforce',
      link: '/',
      iconName: 'snowforce',
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
        // {
        //   title: 'Scanner',
        //   link: '/scanner',
        //   iconName: 'scanner'
        // }
      ]
    },
    {
      title: 'Conference',
      link: '/',
      iconName: 'planning',
      subItems: [
        {
          title: 'Register',
          link: '/register',
          iconName: 'register'
        },
        // {
        //   title: 'Call for Speakers',
        //   link: '/speaker-sign-up',
        //   iconName: 'speaker'
        // },
        {
          title: 'Sponsor Snowforce',
          link: '/sponsor-sign-up',
          iconName: 'sponsor'
        }
        // {
        //   title: 'Volunteer',
        //   link: '/volunteer',
        //   iconName: 'volunteer'
        // }
      ]
    },
    {
      title: 'About',
      link: '/',
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
