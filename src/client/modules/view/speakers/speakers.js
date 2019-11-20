import { LightningElement, wire } from 'lwc';
import { store, wireCurrentSpeakers } from 'redux/store';

export default class ViewSpeakers extends LightningElement {
  @wire(wireCurrentSpeakers, { store })
  speakers;
}
