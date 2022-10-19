import fs from 'fs';

function isDirEmpty(dirname) {
  return fs.promises.readdir(dirname).then(files => {
    return files.length === 0;
  });
}

const buildStaticResourcesIfEmpty = async () => {
  const isEmpty = await isDirEmpty(`${dir}/src/server/data`);

  if (isEmpty) {
    console.log('Building Src Server Data Files');
    require('./compileStaticResources.js');
  } else {
    console.log('Src Server Data Files Already Written');
  }
};

buildStaticResourcesIfEmpty();
