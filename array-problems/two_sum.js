/*
Given an array of Intergers nums and an target integer,
return indices of the two numbers such that they add upto target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Input:
2
4
2 7 11 15
9
3
3 2 4
6

Line 1 is number of test cases
Next T lines containes size and nums array

Output:
[0, 1]
[1, 2]

Explaination:

nums = [2,7,11,15], target = 9

OutPut: [0,1] beacuse nums[0] + nums[1] == 9, we return [0, 1]

nums = [3, 2, 4] target = 6

OutPut: [1,2] beacuse nums[1] + nums[2] == 6, we return [1, 2]

*/

function runProgram(input) {
  input = input.trim().split('\n');
  let tests = input[0];

  let line = 1;

  for (let i = 0; i < tests; i++) {
    let size = +input[line++].trim();
    let arr = input[line++].trim().split(' ').map(Number);
    let target = +input[line++].trim();

    let obj = {};
    let indices = [];

    for (let i = 0; i < size; i++) {
      let n = arr[i];
      if (obj[target - n] >= 0) {
        indices.push(obj[target - n], i);
      } else {
        obj[n] = i;
      }
    }
    console.log('indices : ', indices);
  }
}

runProgram(`4
4
2 7 11 15
9
3
3 2 4
6
4
1 2 3 4
6
4
1 5 7 1
6`);
