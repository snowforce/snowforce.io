export const mergeArraysByKey = (array1, array2, key) =>
  array1.filter(a1 => !array2.find(a2 => a1[key] === a2[key])).concat(array2);
