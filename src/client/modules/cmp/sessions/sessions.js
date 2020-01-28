import { LightningElement, api, track } from 'lwc';

export default class CmpSessions extends LightningElement {
  @track haveSessions = false;
  @track displaySessions = [];

  @api
  get sessions() {
    return this._sessions;
  }
  set sessions(val) {
    this._sessions = val;
    this.displaySessions = val;
    this.haveSessions = val && val.length > 0 ? true : false;
  }
}
