import { LightningElement, api, track } from 'lwc';

export default class ViewEvents extends LightningElement {
  @api
  get activeTab() {
    return this._activeTab;
  }
  set activeTab(val) {
    this._activeTab = val;
    this.setDisplay(val);
  }

  @track displayDinner = true;
  @track displayConference = false;
  @track displaySki = false;

  setDisplay = val => {
    this.displayDinner = val === '1';
    this.displayConference = val === '2';
    this.displaySki = val === '3';
  };

  onNavigate = event => {
    event.stopPropagation();
    this.setDisplay(event.detail.name);
  };

  tabs = [
    {
      name: '1',
      label: 'Day 1',
      link: 'event/dinner'
    },
    {
      name: '2',
      label: 'Day 2',
      link: 'event/conference'
    },
    {
      name: '3',
      label: 'Day 3',
      link: 'event/ski'
    }
  ];
}
