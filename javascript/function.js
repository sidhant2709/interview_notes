// function swap(a, b) {
//   [a, b] = [b, a];
//   return [a, b];
// }

// let x = 5;
// let y = 10;

// [x, y] = swap(x, y);

// console.log(x); // Output: 10
// console.log(y); // Output: 5

// let newArr = Array.from({ length: k + len }, (_, i) => i + 1);

// let arr = [1, 9, 5, 7, 8];
// let k = 6;
// let len = arr.length;
// let newArr = Array(k + len)
//   .fill()
//   .map((_, i) => i + 1);
// console.log(newArr);

// const getPermutations = arr => {
//   const output = [];

//   const swapInPlace = (arrToSwap, indexA, indexB) => {
//     const temp = arrToSwap[indexA];
//     arrToSwap[indexA] = arrToSwap[indexB];
//     arrToSwap[indexB] = temp;
//   };

//   const generate = (n, heapArr) => {
//     if (n === 1) {
//       output.push(heapArr.slice());
//       return;
//     }

//     generate(n - 1, heapArr);

//     for (let i = 0; i < n - 1; i++) {
//       if (n % 2 === 0) {
//         swapInPlace(heapArr, i, n - 1);
//       } else {
//         swapInPlace(heapArr, 0, n - 1);
//       }

//       generate(n - 1, heapArr);
//     }
//   };

//   generate(arr.length, arr.slice());

//   return output;
// };

// const swapInPlace = (arrToSwap, indexA, indexB) => {
//   const temp = arrToSwap[indexA];
//   arrToSwap[indexA] = arrToSwap[indexB];
//   arrToSwap[indexB] = temp;
// };

// const arr = [1, 2, 3, 4];

// swapInPlace(arr, 0, 3);

// console.log(arr);

// const symOfTwo = (arr1, arr2) => {
//   const set1 = new Set(arr1);
//   const set2 = new Set(arr2);

//   const combinedArr = [...set1, ...set2];

//   const elObj = {};
//   for (const el of combinedArr) {
//     if (el in elObj) {
//       elObj[el]++;
//     } else {
//       elObj[el] = 1;
//     }
//   }

//   const output = [];
//   for (const el in elObj) {
//     if (elObj[el] === 1) {
//       output.push(Number(el));
//     }
//   }

//   return output;
// };

// function sym() {
//   const arrOfArrs = [...arguments];
//   let output = arrOfArrs[0];
//   for (let i=1; i < arrOfArrs.length; i++) {
//     output = symOfTwo(output, arrOfArrs[i]);
//   }

//   return output;
// }

const symOfTwo = arr1 => {
  const set1 = new Set(arr1);
  // const iterator = set1[Symbol.iterator]();

  // for (let i = 0; i < set1.size; i++) {
  //   console.log(iterator.next().value);
  // }

  console.log([...set1]);

  // for (const v of set1) {
  //   console.log(v);
  // }
};

// symOfTwo(arr1);

let arr2 = [1, 2, 3, 4];

let arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];

arr1 = arr1.filter(function (val) {
  return arr2.indexOf(val) == -1;
});

console.log(arr1);
