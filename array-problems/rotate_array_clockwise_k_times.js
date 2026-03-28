function RightRotate(arr, size, n) {
  let res = [];
  // let n = 3
  if (n === size) {
    return arr;
  } else {
    n = n % size; // 3 = 3 % 5 ==> 3
    //   console.log(n % size);
    for (let i = 0; i < size; i++) {
      // res = [3, 4, 5, 1, 2]

      if (i < n) {
        // i = 0, i < 3 :::: i = 1, i < 3 :::: i = 2, i < 3
        res.push(arr[size + i - n]); // arr[5+0-3] = arr[2] = 3 :::: arr[5+1-3] = arr[3] = 4 :::: arr[5+2-3] = arr[4] = 5
      } else {
        // i = 3, Since 3 !< 3 ::::  i = 4, Since 4 !< 3
        res.push(arr[i - n]); // arr[3 - 3] = arr[0] = 1 :::: arr[4 - 3] = arr[1] = 2
      }
    }
  }
  return res;
}

let arr = [1, 2, 3, 4, 5];
let N = arr.length;
let K = 5;

console.log(RightRotate(arr, N, K));

// Using JavaScript Array Method

function javaScriptArrayClockWiseRotation(arr, n) {
  for (let i = 0; i < n; i++) {
    let lastElement = arr.pop();
    arr.unshift(lastElement);
  }
  return arr;
}

console.log('Using JavaScript Array Method');
console.log(javaScriptArrayClockWiseRotation(arr, K));
