/*
Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.


Input: nums = [1,2,3,1]
Output: true

Input: nums = [1,2,3,4]
Output: false

Input: nums = [1,1,1,3,3,4,3,2,4,2]
Output: true
*/

var containsDuplicate = function (nums) {
  let obj = nums.reduce((a, c) => {
    a[c] = (a[c] || 0) + 1;
    return a;
  }, {});
  console.log(obj);
  for (key in obj) {
    if (obj[key] >= 2) {
      return true;
    }
  }
  return false;
};

var containsDuplicate = function (nums) {
  const s = new Set(nums);
  return s.size !== nums.length;
};

var containsDuplicate = function (nums) {
  let obj = {};

  for (let i = 0; i < nums.length; i++) {
    if (obj[nums[i]] === undefined) {
      obj[nums[i]] = 1;
    } else {
      return true;
    }
  }
  return false;
};

var containsDuplicate = function (nums) {
  let obj = nums.reduce((a, c) => {
    a[c] = (a[c] || 0) + 1;
    return a;
  }, {});

  for (key in obj) {
    if (obj[key] > 1) {
      return true;
    }
  }
  return false;
};
