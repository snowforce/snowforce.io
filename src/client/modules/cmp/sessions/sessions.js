import { LightningElement, api, track } from 'lwc';

export default class CmpSessions extends LightningElement {
  @api
  get sessionTrack() {
    return this._sessionTrack;
  }
  set sessionTrack(val) {
    this._sessionTrack = val;
    if (this.sessions) {
      this.displaySessions = this.sessions.filter(s => s.track === val);
      this.haveSessions =
        this.displaySessions && this.displaySessions.length > 0;
    }
  }

  @api sessions;

  @track displaySessions = [];
  @track haveSessions = false;

  getTime = hour => {
    const h = hour - 12 > 0 ? hour - 12 : hour;
    return h + (hour >= 12 ? 'pm' : 'am');
  };
}
