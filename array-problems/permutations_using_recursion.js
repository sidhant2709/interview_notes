/*
    Write a program to that takes in an array of unique integers and 
    return an array of all permutations of those integers in no particular order

    If input array is empty, the program should give an empty array as output

    Sample Input: [1, 2, 3]

    Sample Output: 
    [
        [ 1, 2, 3 ],
        [ 1, 3, 2 ],
        [ 2, 1, 3 ],
        [ 2, 3, 1 ],
        [ 3, 1, 2 ],
        [ 3, 2, 1 ]
    ]

*/

const getPermutations = arr => {
  let result = [];

  function perms(subArr, currentPerms) {
    //base condition
    if (subArr.length === 0) {
      result.push(currentPerms);
    }

    for (let i = 0; i < subArr.length; i++) {
      const newSubArr = subArr.slice(0, i).concat(subArr.slice(i + 1));

      const newCurrentPerms = currentPerms.concat(subArr[i]);

      perms(newSubArr, newCurrentPerms);
    }
  }
  perms(arr, []);

  return result;
};

console.log(getPermutations([1, 2, 3]));
