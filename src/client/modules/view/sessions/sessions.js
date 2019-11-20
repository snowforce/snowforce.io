import { LightningElement, api, track, wire } from 'lwc';
import { wireCurrentTracks, store } from 'redux/store';

export default class ViewSessions extends LightningElement {
  @api track;

  @track _track = 'all';
  @track activeIndex = 0;

  @wire(wireCurrentTracks, { store })
  wireCurrentTracks(tracks) {
    this.tracks = tracks;
    if (tracks && this.track) {
      this.activeIndex = this.getTrackIndex(this.track);
    }
  }

  flktySetup = {
    pageDots: false,
    setGallerySize: true,
    adaptiveHeight: true,
    wrapAround: true,
    arrowShape: 'arrow'
  };

  cellNodes = function() {
    return this.tracks.map((t, i) => {
      let cell = document.createElement('div');
      cell.className = 'carousel-cell';
      cell.textContent = t.label;
      cell.addEventListener('click', () => {
        this._track = t.name;
        this.activeIndex = i;
      });
      return cell;
    });
  }.bind(this);

  carouselChange = event => {
    event.stopPropagation();
    const index = event.detail.index;
    this.track = this.getTrackNameByIndex(index);
    event.target.dispatchEvent(
      new CustomEvent('navigate', {
        bubbles: true,
        composed: true,
        detail: {
          ...this.tracks[index],
          createComponents: false
        }
      })
    );
  };

  getTrackNameByIndex = index => {
    return this.tracks[index].name;
  };

  getTrackIndex = trackName => {
    return this.tracks.map(e => e.name).indexOf(trackName);
  };
}
