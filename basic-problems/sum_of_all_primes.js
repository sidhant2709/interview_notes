function runProgram(input) {
  input = input.trim().split('\n');
  let testInputs = input.shift();
  let inputNumbers = input.map(Number);
  //   console.log(testInputs, inputNumbers);

  for (let i = 0; i < testInputs; i++) {
    let sum = 0;
    for (let j = 0; j <= inputNumbers[i]; j++) {
      sum += isPrime(j);
    }
    console.log(sum);
  }
}

function isPrime(num) {
  let factor = 0;
  let i = 2;
  if (num === 1 || num === 0) {
    return 0;
  } else {
    while (i < num) {
      if (num % i === 0) {
        factor += 1;
      }
      i++;
    }
  }
  if (factor > 0) {
    return 0;
  } else {
    return num;
  }
}

// console.log(isPrime(7));

runProgram(`2
10
977`);
