/*
    Consuming Promises
    Chaining Promises
    Handling Rejected Promises
    Throwing Errors Manually
*/

//============================================================================================

/*

Building a Simple Promise


const lotteryPromise = new Promise(function (resolve, reject) {
  console.log('Lotter draw is happening 🔮');
  setTimeout(function () {
    if (Math.random() >= 0.5) {
      resolve('You WIN 💰');
    } else {
      reject(new Error('You lost your money 💩'));
    }
  }, 2000);
});

lotteryPromise.then(res => console.log(res)).catch(err => console.error(err));

*/

//============================================================================================

/*

Promise.resolve('abc').then(x => console.log(x));
Promise.reject(new Error('Problem!')).catch(x => console.error(x));

*/

//============================================================================================

/*
setTimeout(() => {
  console.log('1 second passed');
  setTimeout(() => {
    console.log('2 seconds passed');
    setTimeout(() => {
      console.log('3 seconds passed');
      setTimeout(() => {
        console.log('4 seconds passed');
      }, 1000);
    }, 1000);
  }, 1000);
}, 1000);

Output
1 second passed
2 seconds passed
3 seconds passed
4 seconds passed

*/

/* 
Promisifying setTimeout

The above callBack function of setTimeout is promiseified

const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

wait(1)
  .then(() => {
    console.log('1 second passed');
    return wait(1);
  })
  .then(() => {
    console.log('2 seconds passed');
    return wait(1);
  })
  .then(() => {
    console.log('3 seconds passed');
    return wait(1);
  })
  .then(() => console.log('4 seconds passed'));


Output
1 second passed
2 seconds passed
3 seconds passed
4 seconds passed

*/

let promise = new Promise((resolve, reject) =>
  setTimeout(() => resolve(100), 3000)
);

// tasks to be completed after promise resolution

promise.then(val => console.log(val)).catch(err => console.log(err));

/*

How to create our own promise called PromisePolyFill?

https://roadsidecoder.hashnode.dev/javascript-interview-questions-promises-and-its-polyfills

Prerequisites (What we know already)

===> We have a promise constructor function (new Promise((resolve, reject) => setTimeout(() => resolve(100), 3000))) 
     which accepts a callback as an argument which will be executor in our case.

===> constructor function will return an object with two properties then and catch. 
     Then and catch are functions which accepts a callback and also can be chained. 
     They should return a reference to this.

===> store the reference to callback function passed to then and catch 
     so that it can be executed at a later stage basis on the status returned by executor.

*/

function PromisePolyFill(executor) {
  let onResolve,
    onReject,
    fulfilled = false,
    rejected = false,
    called = false,
    value;

  function resolve(v) {
    fulfilled = true;
    value = v;

    if (typeof onResolve === 'function') {
      // for async
      console.log('inside resolve');
      onResolve(value);
      called = true;
    }
  }

  function reject(reason) {
    rejected = true;
    value = reason;

    if (typeof onReject === 'function') {
      onReject(value);
      called = true;
    }
  }

  this.then = function (callback) {
    onResolve = callback;

    if (fulfilled && !called) {
      // for sync
      console.log('inside then');
      called = true;
      onResolve(value);
    }
    return this;
  };

  this.catch = function (callback) {
    onReject = callback;

    if (rejected && !called) {
      called = true;
      onReject(value);
    }
    return this;
  };

  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

const promise1 = new PromisePolyFill((resolve, reject) => {
  console.log(1);
  setTimeout(() => {
    resolve(2);
  }, 1000);
  console.log(3);
});

promise1.then(res => {
  console.log(res);
});

/*


Implementing PromisePolyFill.resolve and PromisePolyFill.reject
resolve and reject are simple which will return a PromisePolyfill object having an executor which will either resolve or reject.

*/

PromisePolyFill.resolve = val =>
  new PromisePolyFill(function executor(resolve, _reject) {
    resolve(val);
  });

PromisePolyFill.reject = reason =>
  new PromisePolyFill(function executor(_resolve, reject) {
    reject(reason);
  });
