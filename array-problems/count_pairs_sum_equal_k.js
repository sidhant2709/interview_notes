/*
    Write a program to count the sum of all pairs equals to a given target

    Input Format:
    4        :  Size of the array
    1 2 3 4  :  array itself
    6        :  target sum

    Output :
    1
*/

function runProgram(input) {
  input = input.trim().split('\n');
  let size = +input[0];
  let arr = input[1].split(' ').map(Number);
  let target = +input[2];
  let count = 0;

  const obj = {};
  const result = [];
  const pairs = [];

  for (let i = 0; i < size; i++) {
    let difference = target - arr[i];
    if (obj[difference]) {
      count += obj[difference];
      result.push([arr.indexOf(difference), i]);
      pairs.push([difference, arr[i]]);
    }
    obj[arr[i]] = (obj[arr[i]] || 0) + 1;
  }

  //   const obj = new Map();

  //   for (let i = 0; i < size; i++) {
  //     let difference = target - arr[i];
  //     if (obj.has(difference)) {
  //       count += obj.get(difference);
  //     }
  //     obj.set(arr[i], (obj.get(arr[i]) || 0) + 1);
  //   }

  console.log(obj);
  // console.log('count:', count);
  // console.log('indexes:', ...result);
  // console.log('pairs:', ...pairs);
}

runProgram(`4
1 5 7 1
6`);
