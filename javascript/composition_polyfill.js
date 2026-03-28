function addFive(a) {
  return a + 5;
}

function substractTwo(a) {
  return a - 2;
}

function multiplyFour(a) {
  return a * 4;
}

const compose = (...functions) => {
  return args => {
    return functions.reduceRight((arg, fun) => fun(arg), args);
  };
};

const pipe = (...functions) => {
  return args => {
    return functions.reduce((arg, fun) => fun(arg), args);
  };
};

const evaluateCompose = compose(addFive, substractTwo, multiplyFour);

const evaluatePipe = pipe(addFive, substractTwo, multiplyFour);

console.log(evaluateCompose(5));

console.log(evaluatePipe(5));
