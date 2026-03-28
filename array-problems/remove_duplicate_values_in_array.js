/* 
    Write a program to remove all duplicate values in an array in O(n)
*/

function runProgram(input) {
  input = input.trim().split('\n');
  let size = +input[0];
  let array = input[1].split(' ').map(Number);
  let obj = {};
  for (let i = 0; i < size; i++) {
    if (obj[array[i]]) {
      obj[array[i]] += 1;
    } else {
      obj[array[i]] = 1;
    }
  }
  let arrUnique = [];
  for (key in obj) {
    arrUnique.push(+key);
  }
  console.log(arrUnique);
}

runProgram(`10
1 3 5 1 8 8 7 9 1 9
`);
