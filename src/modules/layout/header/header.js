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

  _scrollTop = 0;

  significantScroll = 4;

  @track containerClass = 'display';

  // @api
  // get scrollTop() {
  //   return this._scrollTop;
  // }
  // set scrollTop(val) {
  //   if (val) {
  //     const px = val.target.scrollTop;
  //     const dif = this._scrollTop - px;
  //     if (dif > this.significantScroll) {
  //       this.containerClass = 'display';
  //     } else if (dif < -1 * this.significantScroll) {
  //       this.containerClass = 'hide';
  //     }
  //     this._scrollTop = px;
  //   }
  // }

  @wire(wireView, { store })
  wiredMenu({ data, error }) {
    if (data) {
      this.showMenu = data.isMenuOpen;
      this.menuWrapperClass = data.isMenuOpen ? 'slide-out' : '';
      if (this.showMenu) this.containerClass = 'display';
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
      iconName: 'planning',
      subItems: [
        {
          title: 'Call for Speakers',
          link: '/speak-at-snowforce',
          iconName: 'speaker'
        },
        {
          title: 'Sponsor Snowforce',
          link: '/sponsor-snowforce',
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
      link: '/',
      iconName: 'about',
      subItems: [
        {
          title: 'Organizers',
          link: '/organizers',
          iconName: 'organizer'
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
