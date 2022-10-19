import { LightningElement, track, wire } from 'lwc';
import { store, wireCurrentSpeakers, wireCurrentConference } from 'redux/store';
import { uniqueObjArrayByKey } from 'app/utils';

export default class ViewSpeakers extends LightningElement {
  @track speakers = [];
  @track conference = {};

  @wire(wireCurrentSpeakers, { store })
  wiredSpeakers({ data, error }) {
    if (data) {
      this.speakers = uniqueObjArrayByKey(data, 'contactId');
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
}
