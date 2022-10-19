import { LightningElement, api, track } from 'lwc';

export default class CmpSessions extends LightningElement {
  @track haveSessions = false;
  @track displaySessions = [];

  @api
  get sessions() {
    return this._sessions;
  }
  set sessions(val) {
    if (val) {
      this._sessions = val.map(s => {
        return {
          ...s,
          audience: s.audience ? s.audience.split(';').join(', ') : ''
        };
      });
      this.displaySessions = this._sessions;
    }
    this.haveSessions = val && val.length > 0 ? true : false;
  }
}
