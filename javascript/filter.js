// unique values in array
let arr = [1, 4, 10, 'sid', 1, 'sid', 4, 3, 2];

let unique = arr.filter((item, index, arr) => {
  return arr.indexOf(item) === index;
});

console.log(unique);

// unique values in array using set
var ab = [1, 1, 2];

console.log([...new Set(ab)]);

// unique values in 2d array

var e = [
  [1, 2],
  [1, 2],
  [2, 3],
  [4, 5],
  [6, 7],
];

var f = [];

for (var x = 0; x < e.length; x++) {
  f[x] = e[x][1];
}
// f: [2,2,3,5,7]

var g = e.filter(function (elem, pos) {
  return f.indexOf(elem[1]) == pos;
});

console.log(g);

// duplicate values in an array

let arr1 = [1, 4, 8, 2, 4, 1, 6, 2, 9, 7];

let duplicateValues = arr1.filter(
  (curr, index, arr) => arr.indexOf(curr) !== index
);

console.log('duplicateValues', duplicateValues);

// If  the elements have occurred more than twice in an array

function toFindDuplicates(arry) {
  const uniqueElements = new Set(arry);
  const filteredElements = arry.filter(item => {
    if (uniqueElements.has(item)) {
      uniqueElements.delete(item);
    } else {
      return item;
    }
  });

  return [...new Set(filteredElements)];
}

const arry = [1, 3, 5, 1, 8, 8, 7, 9, 1, 9, 9, 5, 5, 5];
const duplicateElements = toFindDuplicates(arry);
console.log(arry);
console.log(duplicateElements);

/*
let arr = [1, 3, 5, 1, 8, 8, 7, 9, 1, 9, 9, 5, 5, 5];

let len = arr.length;

const uniqueArr = new Set(arr);

console.log('array given',arr)

console.log('unique Array',[...uniqueArr]);


const filteredItems = arr.filter((item) => {
  if(uniqueArr.has(item)){
    uniqueArr.delete(item);
  }else{
    return item;
  }
});

const duplicateValues = [...new Set(filteredItems)];

console.log('duplicate values array',duplicateValues);

const nonRepeatingElements = arr.filter((item, i) => arr.indexOf(item) === arr.lastIndexOf(item));

console.log('non repeating elements',nonRepeatingElements);


*/
