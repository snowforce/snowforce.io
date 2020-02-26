import { LightningElement, track, wire } from 'lwc';
import {
  store,
  wireCurrentOrganizers,
  wireCurrentConference
} from 'redux/store';
import { uniqueObjArrayByKey } from 'app/utils';

export default class ViewOrganizers extends LightningElement {
  @track organizers = [];
  @track conference = {};

  @wire(wireCurrentOrganizers, { store })
  wiredOrganizers({ data, error }) {
    if (data) {
      this.organizers = uniqueObjArrayByKey(data, 'contactId');
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
