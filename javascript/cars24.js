//---------------------------------Q1---------------------------------

function abc() {
  console.log(a);

  var a = 10;
}

//abc();

//Output: undefined

//----------------------------------Q2------------------------------

function abcd() {
  console.log(a, b, c);

  var a = 10;
  let b = 20;
  const c = 30;
}

//abcd();

// Output: Uncaught ReferenceError: Cannot access 'b' before initialization

/*
TDZ: Temporal Dead Zone

They are in the scope but are not yet initilized 

const and let are not hoisted they are in TDZ 

*/

//--------------Q3 Implicit and Explicit Binding----------------------

var obj = {
  name: 'Sidhant',
  display: function () {
    console.log(this.name);
  },
};

var obj1 = {
  name: 'ABC',
};

// obj.display.call(obj1);

// Output: ABC

var obj2 = {
  name: 'Sidhant',
  display: () => {
    console.log(this.name);
  },
};

var obj3 = {
  name: 'ABC',
};

// obj2.display.call(obj3);

// Output: Empty Console

//--------------Q4 Implementing Caching/Memoize Function----------------------

function myMemoize(fn, context) {
  const res = {};

  return function (...args) {
    var argsCache = JSON.stringify(args);

    if (res[argsCache] === undefined) {
      res[argsCache] = fn.call(context || this, ...args);
    }
    return res[argsCache];
  };
}

const clumsySquare = (num1, num2) => {
  for (let i = 1; i <= 1000000; i++) {}
  return num1 * num2;
};

// const memoizedClumsySquare = myMemoize(clumsySquare);

// console.time('First Call');

// console.log(memoizedClumsySquare(9467, 7649));

// console.timeEnd('First Call');

// console.time('Second Call');

// console.log(memoizedClumsySquare(9467, 7649));

// console.timeEnd('Second Call');

//--------------Q5 Output Question On Event Loop----------------------
/*

console.log('a');

setTimeout(() => console.log('set'), 0);

Promise.resolve(() => console.log('pro')).then(res => res());

console.log('b');


Output: 
a
b
pro
set

Promise goes to microtask queue or priority queue
setTimeout goes to Task Queue

*/

//--------------Q6 Infinite Currying----------------------

function add(a) {
  return function (b) {
    if (b) return add(a + b);
    return a;
  };
}

// console.log(add(5)(2)(5)(2)());

//--------------Q7 Implement Below Snippet----------------------

const calc = {
  total: 0,

  add(a) {
    this.total += a;
    return this;
  },

  multiply(a) {
    this.total *= a;
    return this;
  },

  subtract(a) {
    this.total -= a;
    return this;
  },
};

const result = calc.add(10).multiply(5).subtract(30).add(10);

console.log(result.total);
