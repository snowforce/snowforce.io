import { LightningElement, track } from 'lwc';

import jsQR from 'jsqr';
import vCardJS from 'vcards-js';

export default class ViewScanner extends LightningElement {
  @track haveQrCode = true;
  @track qrCodeResult = '';
  @track haveCameraAccess = false;

  video;
  canvasElement;
  canvas;

  captureNewLead = () => {
    this.haveQrCode = false;
    this.qrCodeResult = '';
    this.video = undefined;
    this.canvasElement = undefined;
    this.canvasElement = undefined;
  };

  saveContactInfo = () => {
    let vCard = vCardJS();

    vCard.firstName = this.template.querySelector('.user-name');
    vCard.email = this.template.querySelector('.user-email');
    vCard.note = 'Notes on Eric';

    vCard.saveToFile(`./snowforce-${vCard.firstName}.vcf`);
  };

  renderedCallback() {
    if (!this.canvas && !this.haveQrCode) {
      this.video = document.createElement('video');
      this.canvasElement = this.template.querySelector('canvas');
      this.canvas = this.canvasElement.getContext('2d');

      if (!navigator.mediaDevices) {
        // TODO: show an error toast
        console.warn('No Access to Navigator Media Devices');
        return;
      }
      // Use facingMode: environment to attempt to get the front camera on phones
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .then(this.streamVideo);
    }
  }

  streamVideo = stream => {
    this.video.srcObject = stream;
    this.video.setAttribute('playsinline', true); // required to tell iOS safari we don't want fullscreen
    this.video.play();
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    requestAnimationFrame(this.tick);
  };

  drawLine = (begin, end, color) => {
    this.canvas.beginPath();
    this.canvas.moveTo(begin.x, begin.y);
    this.canvas.lineTo(end.x, end.y);
    this.canvas.lineWidth = 4;
    this.canvas.strokeStyle = color;
    this.canvas.stroke();
  };

  tick = () => {
    if (
      !this.haveQrCode &&
      this.video.readyState === this.video.HAVE_ENOUGH_DATA
    ) {
      this.haveCameraAccess = true;

      this.canvasElement.height = this.video.videoHeight;
      this.canvasElement.width = this.video.videoWidth;
      this.canvas.drawImage(
        this.video,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      let imageData = this.canvas.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      let code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code) {
        this.drawLine(
          code.location.topLeftCorner,
          code.location.topRightCorner,
          '#FF3B58'
        );
        this.drawLine(
          code.location.topRightCorner,
          code.location.bottomRightCorner,
          '#FF3B58'
        );
        this.drawLine(
          code.location.bottomRightCorner,
          code.location.bottomLeftCorner,
          '#FF3B58'
        );
        this.drawLine(
          code.location.bottomLeftCorner,
          code.location.topLeftCorner,
          '#FF3B58'
        );
        if (code.data) {
          this.haveQrCode = true;
          this.qrCodeResult = code.data;
        }
      }
    }
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    requestAnimationFrame(this.tick);
  };
}
