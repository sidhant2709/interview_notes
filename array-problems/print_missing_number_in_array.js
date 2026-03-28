/*
    You are given with the array of length n-1 and elements ranging from 1 to n, you have to figure out the missing number.

    Example :
    Input : nums=[4,5,2,1]
    length: n - 1 = 4 ==> n = 5
    Output: 3

    Example Explanation:
    Missing number from range 1 to 5 is 3 from the given list of numbers

    Constraints:
        n == nums.length
        1 <= n <=10^4
        0 <= nums[i] <= n
        All the numbers of nums are unique.

*/

// let nums = [1, 2, 4, 5, 6];
// let len = nums.length;

// let sum = (len * (len + 1)) / 2;
// let sum2 = 0;

// for (let i = 0; i < len; i++) {
//   sum2 += nums[i];
// }

// console.log('Missing Number is ', sum2 - sum);

let nums = [3, 2, 4, 5, 6];
//length : n - 1 = 5 => n = 6
let len = nums.length; // 5

let total = 1;

for (let i = 2; i <= len + 1; i++) {
  total += i;
  total -= nums[i - 2];
}

console.log('Missing Number is ', total);
