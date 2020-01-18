import { LightningElement, track, wire } from 'lwc';
import { wireCurrentSponsors, store } from 'redux/store';

export default class ViewSponsors extends LightningElement {
  @track haveSponsors;
  @track platinum = [];
  @track gold = [];
  @track silver = [];

  filterSponsorsByLevel = (allSponsors, level) => {
    return allSponsors.filter(s => s.level === level);
  };

  @wire(wireCurrentSponsors, { store })
  wireCurrentSponsors(sponsors) {
    this.haveSponsors = sponsors && sponsors.length > 0;
    if (this.haveSponsors) {
      this.platinum = this.filterSponsorsByLevel(sponsors, 'platinum');
      this.gold = this.filterSponsorsByLevel(sponsors, 'gold');
      this.silver = this.filterSponsorsByLevel(sponsors, 'silver');
    }
  }
}
