import { LightningElement } from 'lwc';

// import { slack } from 'store/submit';

export default class footer extends LightningElement {
  enrollSlack = event => {
    if (event.keyCode === 13) {
      //   const pattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      //   const re = new RegExp(pattern);
      //   if (re.test(event.target.value)) {
      //     const email = re.exec(event.target.value)[0];
      //     slack({ email })
      //       .then(res => {
      //         res.json();
      //       })
      //       .then(response => {
      //         console.log('Success:', JSON.stringify(response));
      //       })
      //       .catch(error => {
      //         console.error('Error:', error);
      //       });
      //   }
    }
  };
}
