/* 
    Write a program to sort an array containing only 0's and 1's without using any sorting method and 
    any predefined sort function must be done in O(n);
*/

function runProgram(input) {
  input = input.trim().split('\n');
  let size = +input[0];
  let arr = input[1].split(' ').map(Number);
  let count = 0;

  for (let i = 0; i < size; i++) {
    if (arr[i] === 0) {
      count++;
    }
  }

  for (let i = 0; i < size; i++) {
    if (i < count) {
      arr[i] = 0;
    } else {
      arr[i] = 1;
    }
  }
  console.log(arr.join(' '));
}

runProgram(`
10
0 1 1 0 1 1 0 1 1 1`);
