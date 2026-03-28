/* 
    Write a program to find all unique values in an array in O(n)
*/

function runProgram(input) {
  input = input.trim().split('\n');
  let size = +input[0];
  let array = input[1].split(' ').map(Number);
  let obj = {};
  for (let i = 0; i < size; i++) {
    if (obj[array[i]]) {
      obj[array[i]] += 1;
    } else {
      obj[array[i]] = 1;
    }
  }
  let arrUnique = [];
  for (key in obj) {
    arrUnique.push(+key);
  }
  console.log(arrUnique);
}

runProgram(`10
1 3 5 1 8 8 7 9 1 9
`);

/*
let arr = [1, 3, 5, 1, 8, 8, 7, 9, 1, 9, 9, 5, 5, 5];

let len = arr.length;

let obj = arr.reduce((r, e) => (r[e] = (r[e] || 0) + 1, r), {});

let uniq = Object.keys(obj).filter(e => obj[e] == 1).map(Number)

console.log(obj);

console.log(uniq);


let obj = arr.reduce((r, e) => {
	r[e] = (r[e] || 0) + 1
  return r;
}, {});



console.log(obj);
*/
