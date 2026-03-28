const data = [1, 1, 3, 4, 5]; // 3 4 5

Array.prototype.skipWhile = function (fn) {
  let filtered = []; // it will receive all values that match to condition passed in fn callback.

  if (typeof fn !== 'function') {
    filtered = this.filter(item => item !== fn);
  } else {
    filtered = this.filter(fn);
  }

  return filtered;
};

// console.log(data.skipWhile(1));

console.log(data.skipWhile(item => item > 3));
