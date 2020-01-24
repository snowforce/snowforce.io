const path = require('path');

// eslint-disable-next-line no-undef
module.exports.setToProjectRootDirectory = function() {
  // eslint-disable-next-line no-undef
  const dir = path.dirname(__dirname);
  try {
    // eslint-disable-next-line no-undef
    process.chdir(dir);
  } catch (err) {
    // eslint-disable-next-line no-undef
    done(err);
  }
  return dir;
};
