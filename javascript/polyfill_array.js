function MyArray() {
  Object.defineProperty(this, 'length', {
    value: 0,
    enumerable: false,
    writable: true,
  });
}

MyArray.prototype.push = function (element) {
  this[this.length] = element;
  this.length++;
  return this.length;
};

MyArray.prototype.pop = function () {
  if (this.length === 0) {
    return undefined;
  }
  this.length--;
  let value = this[this.length];
  delete this[this.length];
  return value;
};

MyArray.prototype.map = function (cb) {
  let res = new MyArray();
  for (let key in this) {
    if (this.hasOwnProperty(key)) {
      console.log(key);
      res.push(cb(this[key], key, this));
    }
  }
  return res;
};

MyArray.prototype.forEach = function (cb) {
  for (let key in this) {
    if (this.hasOwnProperty(key)) {
      cb(this[key], key, this);
    }
  }
};

MyArray.prototype.filter = function (cb) {
  let res = new MyArray();
  for (let key in this) {
    if (this.hasOwnProperty(key)) {
      if (cb(this[key], key, this)) {
        res.push(this[key]);
      }
    }
  }
  return res;
};

MyArray.prototype.reduce = function (cb, initial) {
  let check = !(initial === undefined); // initial = undefined , check = !(true) = false  ===> a = this[0]
  // initial = 0,          check = !(false) = true  ===> a = initial

  let a = check ? initial : this[0];

  for (let i = 0; i < this.length; i++) {
    if (this.hasOwnProperty(i)) {
      if (i === 0 && !check) {
        continue;
      }
      a = cb(a, this[i], i, this);
    }
  }
  return a;
};

let arr = new MyArray();

arr.push(1);

console.log('return value for push function which is length', arr.push(2));

arr.push(3);

arr.push(4);

console.log('array after all the push', arr);

console.log(
  'return value from pop function which is the deleted value',
  arr.pop()
);

console.log('array after all the pop', arr);

const mapArr = arr.map((item, i, arr) => item * 3);

console.log(mapArr);
