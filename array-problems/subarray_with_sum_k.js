/*
    Finding a chunk of numbers in a list that adds up to a certain target K

    Input Format:
    5 // Size of the array
    4 2 -3 1 6 // array itself
    3 // Intend sum : sum intended
*/

function subArraySumFunction(input) {
  input = input.trim().split('\n');
  let size = +input[0];
  let arr = input[1].split(' ').map(Number);
  let k = +input[2];

  /*
  Print all sub array
    for (let i = 0; i < size; i++) {
        let subArr = [];
        for (let j = i; j < size; j++) {
        subArr.push(arr[j]);
        const sumSubarray = subArr.reduce((a, c) => a + c);
        if (sumSubarray === k) {
            console.log(subArr, ' ===> ', sumSubarray, '===>', k, true);
        } else {
            console.log(subArr, ' ===> ', sumSubarray, '===>', k, false);
        }
        }
    }
  */

  for (let i = 0; i < size; i++) {
    let subArrSum = 0;
    for (let j = i; j < size; j++) {
      subArrSum += arr[j];
      if (subArrSum === k) {
        return true;
      }
    }
  }
  return false;
}

function subArraySumFunctionOptimized(input) {
  input = input.trim().split('\n');
  let size = +input[0];
  let arr = input[1].split(' ').map(Number);
  let k = +input[2];

  for (let i = 0; i < size; i++) {
    let subArrSum = 0;
    for (let j = i; j < size; j++) {
      subArrSum += arr[j];
      if (subArrSum === k) {
        return true;
      }
    }
  }
  return false;
}

function runProgram(input) {
  const res = subArraySumFunction(input);
  console.log(res);
}

runProgram(`
5
4 2 -3 1 6
3`);
