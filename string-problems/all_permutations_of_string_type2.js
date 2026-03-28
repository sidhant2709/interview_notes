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
// let str = 'abc';
// let permutations = (str, result) => {
//   if (str.length === 0) {
//     console.log(result);
//   }
//   for (let i = 0; i < str.length; i++) {
//     let rest = str.substring(0, i) + str.substring(i + 1);
//     permutations(rest, result + str[i]);
//   }
// };
// permutations(str, '');

const getPermutations = word => {
  let output = [];
  let permutations = (str, result) => {
    if (str.length === 0) {
      output.push(result);
    }
    for (let i = 0; i < str.length; i++) {
      let rest = str.substring(0, i) + str.substring(i + 1);
      permutations(rest, result + str[i]);
    }
  };
  permutations(word, '');
  return output;
};

function runProgram(input) {
  let str = input ? input.trim() : '';

  str
    ? getPermutations(str).forEach(item => console.log(item))
    : console.log('Empty String');
}

runProgram(`abc`);
