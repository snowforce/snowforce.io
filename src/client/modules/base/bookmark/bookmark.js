import { LightningElement, api } from 'lwc';

export default class BaseBookmark extends LightningElement {
  @api id;
  @api isBookmarked = false;

  onClick = () => {
    //   this.isBookmarked = !this.isBookmarked;
    // TODO: broadcast custom event
  };
}
