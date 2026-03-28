function runProgram(input) {
  input = input.trim().split('\n');
  let len = +input[0];
  let arr = input[1].trim().split(' ').map(Number);
  //console.log(len, arr);
  //   var abs_diff_mat = [];
  var sum = 0;
  var sum1 = 0;
  for (let i = 0; i < len - 1; i++) {
    var abs_diff = 0;
    for (let j = i + 1; j < len; j++) {
      if (isPrime(j - i)) {
        abs_diff = Math.abs(arr[i] - arr[j]);
        abs_diff_mat.push(abs_diff);
        sum1 += abs_diff;
      }
    }
  }
  //   for (let i = 0; i < abs_diff_mat.length; i++) {
  //     sum += abs_diff_mat[i];
  //   }
  console.log(sum1);
  //   console.log(sum);
}
function isPrime(num) {
  var factor = 0;
  var i = 2;
  if (num === 1) {
    return false;
  } else {
    while (i < num) {
      if (num % i == 0) {
        factor = 1;
        break;
      }
      i++;
    }
    if (factor == 0) {
      return true;
    } else {
      return false;
    }
  }
}
if (process.env.USERNAME === 'sidha') {
  runProgram(`6
1 2 3 5 7 12`);
} else {
  process.stdin.resume();
  process.stdin.setEncoding('ascii');
  let read = '';
  process.stdin.on('data', function (input) {
    read += input;
  });
  process.stdin.on('end', function () {
    read = read.replace(/\n$/, '');
    read = read.replace(/\n$/, '');
    runProgram(read);
  });
  process.on('SIGINT', function () {
    read = read.replace(/\n$/, '');
    runProgram(read);
    process.exit(0);
  });
}
