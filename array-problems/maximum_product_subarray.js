function maxProductSubarray(arr) {
  if (arr.length === 0) {
    return 0;
  }

  let ans = arr[0];
  let maxSoFar = ans;
  let minSoFar = ans;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < 0) {
      let temp;
      temp = maxSoFar;
      maxSoFar = minSoFar;
      minSoFar = temp;
    }

    maxSoFar = Math.max(arr[i], maxSoFar * arr[i]);
    minSoFar = Math.min(arr[i], minSoFar * arr[i]);

    ans = Math.max(ans, maxSoFar);
  }
  console.log(ans);
}

maxProductSubarray([-2, 3, 1, 4]);
