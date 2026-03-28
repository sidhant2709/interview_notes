/*
    Write a program to that takes in an string and 
    return all permutations of those strings in no particular order

    If input string is empty, the program should give an empty string as output

    Sample Input: abc

    Sample Output: 
    abc
    acb
    bac
    bca
    cab
    cba

*/

const getPermutations = arr => {
  let result = [];

  if (arr.length === 0) {
    return [];
  }

  function perms(subArr, currentPerms) {
    //base condition
    if (subArr.length === 0) {
      result.push(currentPerms.join(''));
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

// getPermutations('abc'.split('')).forEach(item => console.log(item));

function runProgram(input) {
  input = input.trim().split('\n');
  let str = input[1] ? input[1].trim() : [];

  getPermutations(str).length !== 0
    ? getPermutations(str).forEach(item => console.log(item))
    : console.log('Empty String');
}

runProgram(`3
abc`);
