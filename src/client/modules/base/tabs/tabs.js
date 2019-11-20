import { LightningElement, api, track } from 'lwc';

export default class BaseTabs extends LightningElement {
  @api
  get tabs() {
    return this._tabs;
  }
  set tabs(val) {
    this.validateTabs(val);

    // setting curried SetTab Function
    this.cSetActiveTab = activeTab => {
      this.setTabs(val, activeTab);
    };

    if (this.cSetTabs) {
      this.cSetTabs(val);
    } else {
      this.setTabs(val);
    }
  }

  @api
  get activeTab() {
    return this._activeTab;
  }
  set activeTab(val) {
    this._activeTab = val;

    // setting curried SetTab Function
    this.cSetTabs = tabs => {
      this.setTabs(tabs, val);
    };

    if (this.cSetActiveTab) this.cSetActiveTab(val);
  }

  @track _tabs = [];

  cSetActiveTab;
  cSetTabs;

  setTabs = (tabs, activeTab) => {
    this._tabs = tabs.map(t => {
      return {
        ...t,
        selected: t.name === activeTab
      };
    });
  };

  validateTabs = tabList => {
    tabList.reduce((names, tab) => {
      if (!tab.name || names.includes(tab.name, 0)) {
        throw new Error('Tabs Require Unique Names');
      }
      names[names.length] = tab.name;
      return names;
    }, []);
  };

  clickedTab = event => {
    event.preventDefault();
    this.cSetActiveTab(event.target.dataset.name);
    const navEvent = new CustomEvent('navigate', {
      bubbles: true,
      composed: true,
      detail: event.target.dataset
    });
    event.target.dispatchEvent(navEvent);
  };
}
