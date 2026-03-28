/*
    Given an array of positive and negative integers, find if there is a subarray (of size at-least one) with 0 sum.

    Input Format:
    2                   :   number of test cases
    5                   :   size of the array
    4 2 -3 1 6          :   given array
    5                   :   size of the array
    -3 2 3 1 6          :   given array

    Output Format:
    true
    false
*/

function runProgram(input) {
  input = input.trim().split('\n');
  let testCases = +input[0];
  let line = 1;
  for (let i = 0; i < testCases; i++) {
    let size = +input[line++];
    let arr = input[line++].trim().split(' ').map(Number);
    let flag = false;

    // BRUTE FORCE
    /*
      for (let i = 0; i < size; i++) {
        let sum = 0;
        for (let j = i; j < size; j++) {
          sum += arr[j];
          if (sum === 0) {
            flag = true;
          }
        }
      }
      flag ? console.log('true') : console.log('false');
    */

    // OPTIMIZED SOLUTION
    let sum = 0;
    let resSet = new Set();
    for (let i = 0; i < size; i++) {
      sum += arr[i];
      if (resSet.has(sum)) {
        flag = true;
        break;
      }
      if (sum === 0) {
        flag = true;
        break;
      }
      resSet.add(sum);
    }
    flag ? console.log('true') : console.log('false');
  }
}

runProgram(`2
5
4 2 -3 1 6
5
-3 2 3 1 6`);
