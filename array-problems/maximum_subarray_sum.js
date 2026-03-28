/*

const bruteForceSubarray = (arr) => {
  for (let st = 0; st < arr.length; st++) {
    for (let end = st; end < arr.length; end++) {
      let subArr = [];
      for (let i = st; i <= end; i++) {
        subArr.push(arr[i]);
      }
      console.log(subArr);
    }
  }
};

const bruteForceSubarray = (arr) => {
  const result = [];
  for (let st = 0; st < arr.length; st++) {
    for (let end = st; end < arr.length; end++) {
      let subArr = [];
      for (let i = st; i <= end; i++) {
        subArr.push(arr[i]);
      }
      result.push(subArr);
    }
  }
  console.log(result);
};

*/

/*

const bruteForceSubarray = (arr) => {
  for (let st = 0; st < arr.length; st++) {
    for (let end = st; end < arr.length; end++) {
      let subArr = [];
      for (let i = st; i <= end; i++) {
        subArr.push(arr[i]);
      }
      console.log(subArr.join(""));
    }
  }
};

*/

const bruteForceMaxSubarraySum = (arr) => {
  let maxSum = -Infinity;
  for (let st = 0; st < arr.length; st++) {
    let currSum = 0;
    for (let end = st; end < arr.length; end++) {
      currSum += arr[end];
      maxSum = Math.max(maxSum, currSum);
    }
  }
  return maxSum;
};

const arr = [3, -4, 5, 4, -1, 7, -8];

const kadaneMaxSubarraySum = (arr) => {
  let maxSum = -Infinity;
  let currSum = 0;
  for (let i = 0; i < arr.length; i++) {
    currSum += arr[i];
    maxSum = Math.max(maxSum, currSum);
    if (currSum < 0) {
      currSum = 0;
    }
  }
  return maxSum;
}

console.log(bruteForceMaxSubarraySum(arr)); // 15 (5 + 4 + -1 + 7)

console.log("Kadane's Algorithm", kadaneMaxSubarraySum(arr)); // 15 (5 + 4 + -1 + 7)
