const arr = [1, 2, 3, [4, 5, 6, [7, 8, 9, [99, 98, 97]], 10, 11]];

const arrToStr = JSON.stringify(arr).split('');

let count = 0;

for (let i = 0; i < arrToStr.length; i++) {
  if (arrToStr[i] === '[') {
    count++;
  }
}

const res = arr.flat(Infinity);

console.log(res.sort((a, b) => a - b));
