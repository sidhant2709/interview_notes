/*
    Equilibrium index of an array

    Note: 
    The equilibrium index of an array is an index such that the 
    sum of elements at lower indexes is equal to the sum of elements at higher indexes.  
    
    Input:
    2                   :  test cases
    3                   :  size
    1 2 3               :  array
    7                   :  size
    -7 1 5 2 -4 3 0     :  array            

    Output:
    -1
    3

   -1 beacause no equilibrium index present

    3 is an equilibrium index, because: 
    A[0] + A[1] + A[2] = A[4] + A[5] + A[6]

*/
function runProgram(input) {
  input = input.trim().split('\n');
  let tests = +input[0];
  let line = 1;
  for (let i = 0; i < tests; i++) {
    let size = +input[line++];
    let arr = input[line++].split(' ').map(Number);
    let sum = 0;
    let leftSum = 0;
    let eqIndex;

    for (let i = 0; i < size; i++) {
      sum += arr[i];
    }
    for (let i = 0; i < size; i++) {
      sum -= arr[i];
      if (leftSum === sum) {
        eqIndex = i;
        break;
      }
      leftSum += arr[i];
    }
    eqIndex ? console.log(eqIndex) : console.log(-1);
  }
}

runProgram(`2
3
1 2 3
7
-7 1 5 2 -4 3 0`);
