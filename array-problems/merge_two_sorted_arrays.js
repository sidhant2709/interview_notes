/*
You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively.

Merge nums1 and nums2 into a single array sorted in non-decreasing order.

The final new sorted array should be returned by the function,


Example 1:

Input: nums1 = [1,2,3], m = 3, nums2 = [2,5,6], n = 3
Output: [1,2,2,3,5,6]
Explanation: The arrays we are merging are [1,2,3] and [2,5,6].
The result of the merge is [1,2,2,3,5,6] with the underlined elements coming from nums1.

Example 2:

Input: nums1 = [1], m = 1, nums2 = [], n = 0
Output: [1]
Explanation: The arrays we are merging are [1] and [].
The result of the merge is [1].

Example 3:

Input: nums1 = [], m = 0, nums2 = [1], n = 1
Output: [1]
Explanation: The arrays we are merging are [] and [1].
The result of the merge is [1].

*/

var merge = function (nums1, nums2) {
  let m = nums1.length;
  let n = nums2.length;

  let mergeArr = new Array(m + n).fill(0);

  // [1, 2, 3], [2, 5, 6];

  let i = m - 1;
  let j = n - 1;
  let k = m + n - 1;

  /*
  nums1 = [1, 2, 3]
  nums2 = [2, 5, 6]

  m = 3
  n = 3

  i = m - 1 => 3 - 1 = 2
  j = n - 1 => 3 - 1 = 2
  m + n - 1 => 3 + 3 - 1 = 5

  mergeArr = [0, 0, 0, 0, 0, 0]

  i = 2 j = 2 k = 5
  if (nums1[i] < nums2[j]) ==> 3 < 6 true
  mergeArr[k] ==> mergeArr[5] = 6
  [0, 0, 0, 0, 0, 6]
  k-- 4
  j-- 1

  i = 2, j = 1, k = 4
  3 < 5 true
  mergeArr[4] = 5
  [0, 0, 0, 0, 5, 6]
  k-- 3
  j-- 0

  i = 2, j = 0, k = 3
  3 < 2 false
  mergeArr[4] = 3
  [0, 0, 0, 3, 5, 6]
  k-- 2
  i-- 1

  i = 1, j = 0, k = 2
  2 < 2 false
  mergeArr[2] = 2
  [0, 0, 2, 3, 5, 6]
  k-- 1
  i-- 0

  i = 0, j = 0, k = 1
  1 < 2 true
  mergeArr[1] = 2
  [0, 2, 2, 3, 5, 6]
  k-- 0
  j-- -1 Out of while loop


  Now i = 0, j = -1, k = 0

  j >= 0 : -1 >= 0 : false

  i >= 0 : 0 >= 0 : true {
  mergeArr[0] = 1
  [1, 2, 2, 3, 5, 6]
  k-- -1
  i-- -1
  }

  return mergeArr
 */

  while (i >= 0 && j >= 0) {
    if (nums1[i] < nums2[j]) {
      mergeArr[k] = nums2[j];
      k--;
      j--;
    } else {
      mergeArr[k] = nums1[i];
      k--;
      i--;
    }
  }

  while (j >= 0) {
    mergeArr[k] = nums2[j];
    k--;
    j--;
  }
  while (i >= 0) {
    mergeArr[k] = nums1[i];
    k--;
    i--;
  }

  return mergeArr;
};

let result = merge([1, 2, 3], [2, 5, 6]);

console.log(result);
