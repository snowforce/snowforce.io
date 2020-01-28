import { LightningElement, wire, track } from 'lwc';
import { store, wireCurrentSpeakers } from 'redux/store';
import { uniqueObjArrayByKey } from 'app/utils';

export default class ViewHome extends LightningElement {
  @track speakers = [];
  @track keynotes = [];

  @wire(wireCurrentSpeakers, { store })
  wiredSpeakers({ data, error }) {
    if (error) throw error;
    const currentSpeakers = uniqueObjArrayByKey(data, 'contactId');
    this.speakers = currentSpeakers.filter(s => !s.isKeynote);
    this.keynotes = currentSpeakers.filter(s => s.isKeynote);
  }
}
