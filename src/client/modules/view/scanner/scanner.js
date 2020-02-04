import { LightningElement, track } from 'lwc';

import jsQR from 'jsqr';

export default class ViewSchedule extends LightningElement {
  @track haveQrCode = false;
  @track qrCodeResult = '';
  @track haveCameraAccess = false;

  renderedCallback() {
    let video = document.createElement('video');
    let canvasElement = this.template.querySelector('canvas');
    let canvas = canvasElement.getContext('2d');

    function drawLine(begin, end, color) {
      canvas.beginPath();
      canvas.moveTo(begin.x, begin.y);
      canvas.lineTo(end.x, end.y);
      canvas.lineWidth = 4;
      canvas.strokeStyle = color;
      canvas.stroke();
    }

    // Use facingMode: environment to attemt to get the front camera on phones
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then(function(stream) {
        video.srcObject = stream;
        video.setAttribute('playsinline', true); // required to tell iOS safari we don't want fullscreen
        video.play();
        requestAnimationFrame(tick);
      });

    function tick() {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        this.haveCameraAccess = true;

        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(
          video,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );
        let imageData = canvas.getImageData(
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );
        let code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        });
        if (code) {
          drawLine(
            code.location.topLeftCorner,
            code.location.topRightCorner,
            '#FF3B58'
          );
          drawLine(
            code.location.topRightCorner,
            code.location.bottomRightCorner,
            '#FF3B58'
          );
          drawLine(
            code.location.bottomRightCorner,
            code.location.bottomLeftCorner,
            '#FF3B58'
          );
          drawLine(
            code.location.bottomLeftCorner,
            code.location.topLeftCorner,
            '#FF3B58'
          );
          this.haveQrCode = true;
          this.qrCodeResult = code.data;
        }
      }
      requestAnimationFrame(tick);
    }
  }
}
