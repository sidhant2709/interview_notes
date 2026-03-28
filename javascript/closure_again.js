'use strict';

// var n = 2;

// function square(num) {
//   var ans = num * num;
//   return ans;
// }

// var squareNum = square(n);
// var squareNum2 = square(3);

// const obj = {
//   n: undefined,
//   square: square,
//   squareNum: undefined,
//   squareNum2: undefined,
// };

// console.log(obj);

// function outerFunction() {
//   let outerVariable = 'I am an outer variable';

//   function innerFunction() {
//     console.log(outerVariable);
//   }

//   return innerFunction;
// }

// const myClosure = outerFunction();

// console.log(myClosure);

/*
  Write a function such that is execution is as follows:
  computeAmount().lacs(15).crore(5).crore(2).lacs(20).thousand(45).crore(7).value()

  Output: 143545000
*/

function computeAmount() {
  let totalSum = 0;

  return {
    lacs: function (num) {
      totalSum += num * 100000;
      return this;
    },
    crore: function (num) {
      totalSum += num * 10000000;
      return this;
    },
    thousand: function (num) {
      totalSum += num * 1000;
      return this;
    },
    value: function () {
      return totalSum;
    },
  };
}

let ans = computeAmount()
  .lacs(15)
  .crore(5)
  .crore(2)
  .lacs(20)
  .thousand(45)
  .crore(7)
  .value();

console.log(ans);
