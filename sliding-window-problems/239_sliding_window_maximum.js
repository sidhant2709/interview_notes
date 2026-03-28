const maxSlidingWindowBruteForce = (nums, k) => {
  let result = [];
  let size = nums.length;

  for (let i = 0; i <= size - k; i++) {
    let max = nums[i];
    for (let j = i + 1; j < i + k; j++) {
      if (nums[j] > max) {
        max = nums[j];
      }
    }
    result.push(max);
  }
  return result;
};

console.log(maxSlidingWindowBruteForce([1, 3, -1, -3, 5, 3, 6, 7], 3));


