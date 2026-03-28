/*
const countSlidingWindowOptimized = (nums, k, target_sum) => {
  let size = nums.length;
  let i = 0;
  let j = 0;
  let sum = 0;
  let count = 0;

  while (j < size) {
    sum += nums[j];
    if (j - i + 1 < k) {
      j++;
    } else if (j - i + 1 === k) {
      if (sum === target_sum) {
        count++;
      }
      sum = sum - nums[i]
      i++;
      j++;
    }
  }

  return count;
};
*/

const countSlidingWindowOptimized = (nums, k, target_sum) => {
  let size = nums.length;
  let sum = 0;
  let count = 0;

  for (let i = 0, j = 0; j < size; j++) {
    sum += nums[j];
    if (j - i + 1 < k) {
      continue;
    } else if (j - i + 1 === k) {
      if (sum === target_sum) {
        count++;
      }
      sum -= nums[i];
      i++;
    }
  }

  return count;
};

console.log(
  countSlidingWindowOptimized([1, 9, 1, 0, 11, 0, 0, 9, 2, 8, 9, 7], 3, 11)
);
