/* 
    Write a program to find the indexes of such pairs so that the sum these pairs are equals to a given target

    Input Format:  
    4        :  Size of the array
    1 2 3 4  :  array itself
    6        :  target sum

    Output: 
*/

function runProgram(input) {
  input = input.trim().split('\n');
  let size = +input[0];
  let arr = input[1].split(' ').map(Number);
  let target = +input[2];

  let obj = {};
  let difference;
  let result = [];
  let pairs = [];
  for (let i = 0; i < size; i++) {
    difference = target - arr[i];
    if (obj[difference]) {
      result.push([arr.indexOf(difference), i]);
      pairs.push([difference, arr[i]]);
    }
    obj[arr[i]] = (obj[arr[i]] || 0) + 1;
  }

  console.log('indexes:', ...result);
  console.log('pairs:', ...pairs);

  let helpArray = [];

  for (let i = 0; i < pairs.length; i++) {
    helpArray[i] = pairs[i][1];
  }

  let uniquePairs = pairs.filter(
    (elem, pos) => helpArray.indexOf(elem[1]) == pos
  );

  console.log('unique pairs', uniquePairs);
}

runProgram(`7
1 2 3 4 5 1 4
6`);
