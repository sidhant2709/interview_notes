/*
Given an integer array nums, rotate the array to the right by k steps, where k is non-negative.

Constraints:

==> 1 <= nums.length <= 105
==> -2^31 <= nums[i] <= 2^31 - 1
==> 0 <= k <= 105

---> Try to come up with as many solutions as you can. There are at least three different ways to solve this problem.
---> Could you do it in-place with O(1) extra space?
*/
{
  var rotate = function (nums, k) {
    for (let i = nums.length - 1; i >= 0; i--) {
      nums[i + k] = nums[i];
    }

    for (let j = k - 1; j >= 0; j--) {
      nums[j] = nums.pop();
    }
  };
}
var rotate = function (nums, k) {
  // i.e. nums = [1, 2, 3, 4, 5, 6, 7],  k = 3
  for (let i = nums.length - 1; i >= 0; i--) {
    nums[i + k] = nums[i];
    // i = 6,  k = 3
    // nums[i + k] = nums[i]
    // nums[6 + 3] = nums[6]
    // nums[9] = 7              nums = [1, 2, 3, 4, 5, 6, 7, , , 7]

    // i = 5,  k = 3
    // nums[i + k] = nums[i]
    // nums[5 + 3] = nums[5]
    // nums[8] = 6              nums = [1, 2, 3, 4, 5, 6, 7, , 6, 7]

    // i = 4,  k = 3
    // nums[i + k] = nums[i]
    // nums[4 + 3] = nums[4]
    // nums[7] = 5              nums = [1, 2, 3, 4, 5, 6, 7, 5, 6, 7]

    // i = 3,  k = 3
    // nums[i + k] = nums[i]
    // nums[3 + 3] = nums[3]
    // nums[6] = 4              nums = [1, 2, 3, 4, 5, 6, 4, 5, 6, 7]

    // i = 2,  k = 3
    // nums[i + k] = nums[i]
    // nums[2 + 3] = nums[2]
    // nums[5] = 3              nums = [1, 2, 3, 4, 5, 3, 4, 5, 6, 7]

    // i = 1,  k = 3
    // nums[i + k] = nums[i]
    // nums[1 + 3] = nums[1]
    // nums[4] = 2              nums = [1, 2, 3, 4, 2, 3, 4, 5, 6, 7]

    // i = 0,  k = 3
    // nums[i + k] = nums[i]
    // nums[0 + 3] = nums[0]
    // nums[3] = 1              nums = [1, 2, 3, 1, 2, 3, 4, 5, 6, 7]
  }

  for (let j = k - 1; j >= 0; j--) {
    // nums = [1, 2, 3, 1, 2, 3, 4, 5, 6, 7]
    nums[j] = nums.pop();

    // j = 2
    // nums[j] = nums.pop()
    // nums[2] = 7               nums = [1, 2, 7, 1, 2, 3, 4, 5, 6]

    // j = 1
    // nums[j] = nums.pop()
    // nums[1] = 6               nums = [1, 6, 7, 1, 2, 3, 4, 5]

    // j = 0
    // nums[j] = nums.pop()
    // nums[0] = 5               nums = [5, 6, 7, 1, 2, 3, 4]
  }

  // nums = [5, 6, 7, 1, 2, 3, 4]

  // Time comlexity = O(a + b)
};

{
  var rotate = function (nums, k) {
    if ((k == 0) | (k == nums.length)) {
      return;
    }
    k = k % nums.length;

    let reverse = function (low, high) {
      while (high >= low) {
        let temp = nums[low];
        nums[low] = nums[high];
        nums[high] = temp;
        high--;
        low++;
      }
    };

    reverse(0, nums.length - 1);
    reverse(k, nums.length - 1);
    reverse(0, k - 1);
  };
}
