const postData = (url = '', data = {}) => {
  // Default options are marked with *
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
};

const session = () => {};
const sponsor = () => {};
const slack = val => {
  return postData('api/v1/slack', val);
};
const volunteer = () => {};

export { session, sponsor, slack, volunteer };
