import { LightningElement, track, wire } from 'lwc';
import {
  store,
  wireCurrentOrganizers,
  wireCurrentConference
} from 'redux/store';
export default class ViewOrganizers extends LightningElement {
  @track organizers = [];
  @track conference = {};

  @wire(wireCurrentOrganizers, { store })
  wiredOrganizers({ data, error }) {
    if (data) {
      this.organizers = data
        .sort((a, b) => {
          if (a.responsibilities && b.responsibilities) {
            return b.responsibilities.length - a.responsibilities.length;
          }
          return 1;
        })
        .sort((a, b) => {
          if (a.responsibilities && b.responsibilities) {
            return (
              (b.responsibilities.match(/;/g) || []).length -
              (a.responsibilities.match(/;/g) || []).length
            );
          }
          return 1;
        });
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
