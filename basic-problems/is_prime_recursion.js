/*
    i : 2 3 4 5 6 7 8 9 10 11 12 13

    In case of prime number calculation we assume that the given number has only 2 factors i.e. the given number is prime and it has only two factors 1 and number itself

    13 / 2 = 6.5
    Math.floor(13 / 2) = 6

    Math.sqrt(13) = 3.6

    Write a program to check whether the given number is prime or not using recrussion
*/

function runProgram(input) {
  input = input.trim().split('\n');
  let testInputs = input.shift();
  let inputNumbers = input.map(Number);

  for (let i = 0; i < testInputs; i++) {
    let prime = isPrime(inputNumbers[i], Math.floor(inputNumbers[i] / 2));
    if (prime === 1) {
      console.log(`${inputNumbers[i]} is a Prime Number`);
    } else {
      console.log(`${inputNumbers[i]} is a not a Prime Number`);
    }
  }
}

function isPrime(num, i) {
  if (i === 1) {
    return 1;
  }
  if (num % i === 0) {
    return 0;
  }
  return isPrime(num, i - 1);
}

// console.log(isPrime(1, Math.floor(1 / 2)));

// console.log(1 % -1);

runProgram(`7
1
0
2
5
8
20
13`);
