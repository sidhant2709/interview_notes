/* 
    Write a program to print all substrings of length k of a given string
*/

function runProgram(input) {
  input = input.trim().split('\n');
  let str_length = +input[0];
  let str = input[1].trim().split('');
  let k = +input[2];

  let i = 0;
  let j = 0;
  while (j < str_length) {
    if (j - i + 1 < k) {
      j++;
    } else if (j - i + 1 === k) {
      console.log(str.slice(i, j + 1).join(''));
      j++;
      i++;
    }
  }
}

runProgram(`
6
abcdef
3
`);
