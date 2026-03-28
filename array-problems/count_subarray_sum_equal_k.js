/* 
    Write a program to count the sum of all subarray of length k equal to a given number

    Input Format:  
    12 // Size of the array
    1 9 1 0 11 0 0 9 2 8 9 7 // array itself
    3 // size of the subarray
    11 // Intend sum : sum intended
*/

function runProgram(input) {
  input = input.trim().split('\n');
  let size = +input[0];
  let arr = input[1].split(' ').map(Number);
  let k = +input[2];
  let sum_required = +input[3];
  let count = 0;
  let i = 0;
  let j = 0;
  let sum = 0;
  while (j < size) {
    sum += arr[j];
    if (j - i + 1 < k) {
      j++;
    } else if (j - i + 1 === k) {
      if (sum === sum_required) {
        count++;
      }
      sum = sum - arr[i];
      i++;
      j++;
    }
  }
  console.log(count);
}

runProgram(`
12
1 9 1 0 11 0 0 9 2 8 9 7
3
11`);
