/*
    Write a program to nearest smaller element to left of an array
    It is also called as next largest element of elements of array


    Input Format:
    5        :  Size of the array
    4 5 2 10 8  :  array itself

    Output :
    -1 4 -1 2 2
*/

class Stack {
  constructor() {
    this.items = [];
  }

  push(element) {
    this.items.push(element);
  }

  pop() {
    if (this.items.length == 0) return 'Underflow';
    return this.items.pop();
  }
  peek() {
    return this.items[this.items.length - 1];
  }
  isEmpty() {
    return this.items.length == 0;
  }
  printStack() {
    var str = '';
    for (var i = 0; i < this.items.length; i++) str += this.items[i] + ' ';
    return str;
  }
}

function runProgramStack(input) {
  input = input.trim().split('\n');
  let size = +input[0];
  let arr = input[1].split(' ').map(Number);
  let resultArr = [];
  let s = new Stack();

  for (let i = size - 1; i >= 0; i--) {
    if (s.isEmpty()) {
      resultArr.push(-1);
    } else if (!s.isEmpty() && s.peek() < arr[i]) {
      resultArr.push(s.peek());
    } else if (!s.isEmpty() && s.peek() >= arr[i]) {
      while (!s.isEmpty() && s.peek() >= arr[i]) {
        s.pop();
      }
      if (s.isEmpty()) {
        resultArr.push(-1);
      } else {
        resultArr.push(s.peek());
      }
    }
    s.push(arr[i]);
  }

  console.log('ES6 Classes', resultArr.reverse());
}

runProgramStack(`5
4 5 2 10 8`);

function runProgram(input) {
  input = input.trim().split('\n');
  let size = +input[0];
  let arr = input[1].trim().split(' ').map(Number);
  let resultArr = [];
  let s = [];

  for (let i = size - 1; i >= 0; i--) {
    if (s.length === 0) {
      resultArr.push(-1);
    } else if (s.length > 0 && s[s.length - 1] < arr[i]) {
      resultArr.push(s[s.length - 1]);
    } else if (s.length > 0 && s[s.length - 1] >= arr[i]) {
      while (s.length > 0 && s[s.length - 1] >= arr[i]) {
        s.pop();
      }
      if (s.length === 0) {
        resultArr.push(-1);
      } else {
        resultArr.push(s[s.length - 1]);
      }
    }
    s.push(arr[i]);
  }

  console.log('Using Array', resultArr.reverse());
}

runProgram(`5
4 5 2 10 8`);

function runProgramBruteForce(input) {
  input = input.trim().split('\n');
  let size = +input[0];
  let arr = input[1].trim().split(' ').map(Number);
  let resultArr = [];

  for (let i = 0; i < size; i++) {
    let next = -1;
    for (let j = i + 1; j < size; j++) {
      if (arr[i] > arr[j]) {
        next = arr[j];
        break;
      }
    }
    resultArr.push(next);
  }

  console.log('Brute Force', resultArr);
}

runProgramBruteForce(`5
4 5 2 10 8`);
