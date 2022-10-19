export const mergeArraysByKey = (array1, array2, key) =>
  array1.filter(a1 => !array2.find(a2 => a1[key] === a2[key])).concat(array2);

// https://dev.to/benlesh/a-simple-explanation-of-functional-pipe-in-javascript-2hbj
export const pipe = (...fns) => {
  return arg => fns.reduce((prev, fn) => fn(prev), arg);
};

export const pipeWith = (arg, ...fns) => {
  return pipe(...fns)(arg);
};

export const uniqueObjArray = arry => {
  return arry.filter((a, index) => {
    const _a = JSON.stringify(a);
    return (
      index ===
      arry.findIndex(obj => {
        return JSON.stringify(obj) === _a;
      })
    );
  });
};

export const uniqueObjArrayByKey = (arry, keyStr) => {
  return arry.filter(
    (obj, index, self) =>
      index === self.findIndex(o => o[keyStr] === obj[keyStr])
  );
};


export const LoadCss = (path, scope) => {
  return new Promise((resolve) => {
      const style = document.createElement('link');
      style.href = path;
      style.rel = 'stylesheet';

      style.onload = () => {
          resolve(style);
      };
      style.onerror = (e) => {
          console.error('Unable to load', path, e);
      };

      if (scope) {
          scope.template.appendChild(style);
      } else {
          document.querySelector('head').appendChild(style);
      }
  });
}