/*

The weight of an array is defined as the maximum number of occurance of an integer in the array.

Given an array of positive integers 'k', find the smallest possible length of a subarray of the array 'k' that has the same weight as k.
Integers should remain contigious in the subarray




If we define the weight of the array as maximum number of occurance of an integer in the array find the weight of all the arrays given below
[1, 2, 3, 2, 2, 4, 4, 4, 4] ===>4
[2, 3, 2, 2, 4, 4, 4, 4]    ===>4
[3, 2, 2, 4, 4, 4, 4]       ===>4
[2, 2, 4, 4, 4, 4]          ===>4
[2, 4, 4, 4, 4]             ===>4
[4, 4, 4, 4]                ===>4
[2, 2, 4]                   ===>2
[2, 2, 4, 4]                ===>2


*/
function main(arr) {
  let resultArr = [];

  const findWeight = k => {
    const freq = {};
    let maxFreq = 0;

    for (const num of k) {
      freq[num] = (freq[num] || 0) + 1;
      maxFreq = Math.max(maxFreq, freq[num]);
    }
    return maxFreq;
  };

  const generateAllSubArrays = (arr, n, start, end) => {
    if (start >= n && end >= n) {
      return;
    }
    if (end >= n) {
      generateAllSubArrays(arr, n, start + 1, start + 1);
    } else {
      let ans = [];
      for (let k = start; k <= end; k++) {
        ans.push(arr[k]);
      }
      if (ans.length >= targetWeight) {
        let subArrWeight = findWeight(ans);
        if (subArrWeight === targetWeight) {
          // console.log('Subarray With Weight Same As Target Weight \n', ans);
          resultArr.push(ans);
        }
      }
      generateAllSubArrays(arr, n, start, end + 1);
    }
  };

  let targetWeight = findWeight(arr);

  generateAllSubArrays(arr, arr.length, 0, 0);

  return Math.min(...resultArr.map(arr => arr.length));
}

const arr = [1, 2, 3, 2, 2, 4, 4, 4, 4];

console.log(main(arr));
