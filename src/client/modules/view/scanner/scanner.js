import { LightningElement, track } from 'lwc';

import jsQR from 'jsqr';

export default class ViewScanner extends LightningElement {
  @track haveQrCode = false;
  @track qrCodeResult = '';
  @track haveCameraAccess = false;

  video;
  canvasElement;
  canvas;

  saveContactInfo = () => {
    const firstName = this.template.querySelector('.first-name').value;
    const lastName = this.template.querySelector('.last-name').value;
    const organization = this.template.querySelector('.organization-input')
      .value;
    const role = this.template.querySelector('.role-input').value;
    const title = this.template.querySelector('.title-input').value;
    const phone = this.template.querySelector('.phone-input').value;
    const email = this.template.querySelector('.email-input').value;
    const notes = this.template.querySelector('.notes-input').value;

    const vCard = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:SNOWFORCE
BEGIN:VCARD
VERSION:3.0
FN;CHARSET=UTF-8:${firstName} ${lastName}
N;CHARSET=UTF-8:${lastName};${firstName};;;
EMAIL;CHARSET=UTF-8;type=HOME,INTERNET:${email}
TEL;TYPE=HOME,VOICE:${phone}
TITLE;CHARSET=UTF-8:${title}
ROLE;CHARSET=UTF-8:${role}
ORG;CHARSET=UTF-8:${organization}
NOTE;CHARSET=UTF-8:${notes}
REV:${new Date()}
END:VCARD
END:VEVENT
END:VCALENDAR`;

    //     const vCard = `BEGIN:VCARD
    // VERSION:3.0
    // FN;CHARSET=UTF-8:${firstName} ${lastName}
    // N;CHARSET=UTF-8:${lastName};${firstName};;;
    // EMAIL;CHARSET=UTF-8;type=HOME,INTERNET:${email}
    // TEL;TYPE=HOME,VOICE:${phone}
    // TITLE;CHARSET=UTF-8:${title}
    // ROLE;CHARSET=UTF-8:${role}
    // ORG;CHARSET=UTF-8:${organization}
    // NOTE;CHARSET=UTF-8:${notes}
    // REV:${new Date()}
    // END:VCARD`;

    this.download(
      vCard,
      `Snowforce-${firstName}-${lastName}-${organization}.ics`
    );
  };

  download = (text, filename) => {
    var element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/x-vcard;charset=utf-8,' + encodeURIComponent(text)
    );
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
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
