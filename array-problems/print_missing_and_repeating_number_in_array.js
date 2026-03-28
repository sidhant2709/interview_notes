/*
    You are given with the array of length n and elements ranging from 1 to n, 
    you have to figure out the missing number and also find the repeating number

    Example :
        
        length: = 5

        Input :
         
        nums = [4, 5, 2, 2, 1]
        
        Output:
         
        missing number: 3
        repeating number: 2

    Example Explanation:
    Missing number from range 1 to 5 is 3 from the given list of numbers
    Repeating number from range 1 to 5 is 2 from the given list of numbers

    Constraints:
        n == nums.length
        1 <= n <=10^4
        0 <= nums[i] <= n

*/

function findMissingAndRepeatingNumbers(arr) {
  const freq = {};
  let missingNum, repeatingNum;

  // Iterate over the array and count the frequency of each number
  for (let i = 0; i < arr.length; i++) {
    if (freq[arr[i]] === undefined) {
      freq[arr[i]] = 1;
    } else {
      freq[arr[i]] += 1;
    }
  }

  //   console.log(freq);

  // Find the missing and repeating numbers
  for (let i = 1; i <= arr.length; i++) {
    if (freq[i] === undefined) {
      missingNum = i;
    } else if (freq[i] === 2) {
      repeatingNum = i;
    }
  }

  return [missingNum, repeatingNum];
}

// Example usage:
const arr = [4, 5, 2, 2, 1];
const [missingNum, repeatingNum] = findMissingAndRepeatingNumbers(arr);
console.log(`Missing number: ${missingNum}, Repeating number: ${repeatingNum}`);
