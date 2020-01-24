var fs = require('fs');
const path = require('path');

function getJsonFile(filePath, apiRes) {
  fs.access(filePath, fs.constants.F_OK, filePathErr => {
    if (filePathErr) {
      console.error('File Path Error: ', filePathErr);
    } else
      fs.readFile(filePath, function(readFilErr, data) {
        if (readFilErr) {
          console.error('Read File Error: ', readFilErr);
        } else {
          apiRes.json(JSON.parse(data));
        }
      });
  });
}

// eslint-disable-next-line no-undef
module.exports = app => {
  app.get('/api/v1/:table', (req, apiRes) => {
    try {
      const filePath = path.join('dist/data/', req.params.table) + '.json';
      getJsonFile(filePath, apiRes);
    } catch (err) {
      console.error(err);
    }
  });

  app.get('/api/v1/:year/:table', (req, apiRes) => {
    try {
      const filePath = path.join('dist/data/', req.params.table) + '.json';
      getJsonFile(filePath, apiRes);
    } catch (err) {
      console.error(err);
    }
  });
};
