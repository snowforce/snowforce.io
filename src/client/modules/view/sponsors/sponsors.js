import { LightningElement, track, wire } from 'lwc';
import { store, wireCurrentConference, wireCurrentSponsors } from 'redux/store';

export default class ViewSponsors extends LightningElement {
  @track haveSponsors;
  @track conference;
  @track platinum = [];
  @track gold = [];
  @track silver = [];

  filterSponsorsByLevel = (allSponsors, level) => {
    return allSponsors.filter(s => s.level.toLowerCase() === level);
  };

  @wire(wireCurrentSponsors, { store })
  wiredSponsors({ data, error }) {
    this.haveSponsors = data && data.length > 0;
    if (this.haveSponsors) {
      this.platinum = this.filterSponsorsByLevel(data, 'platinum');
      this.gold = this.filterSponsorsByLevel(data, 'gold');
      this.silver = this.filterSponsorsByLevel(data, 'silver');
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

  /** Example of an imperative call */
  //   connectedCallback() {
  //     wireCurrentSponsors({ store })
  //       .then(({ data, error }) => {
  //         if (data) {
  //           this.haveSponsors = data && data.length > 0;
  //           if (this.haveSponsors) {
  //             this.platinum = this.filterSponsorsByLevel(data, 'platinum');
  //             this.gold = this.filterSponsorsByLevel(data, 'gold');
  //             this.silver = this.filterSponsorsByLevel(data, 'silver');
  //           }
  //         } else if (error) {
  //           throw error;
  //         }
  //       })
  //       .catch(err => {
  //         throw err;
  //       });
  //   }
}
