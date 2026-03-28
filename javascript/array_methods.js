let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
/*
console.log('Original Array', arr); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

let i = 1; //Index to be removed ==> (i + 1)th element will targeted

let arrSlice = arr.slice(i, 5);

console.log(`Array Slice (${i},5) : `, arrSlice); // Array Slice (1,5) :  (4) [2, 3, 4, 5]

console.log('Original Array After Slice', arr); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
*/
/*
arr.slice(start,end) : This returns an new array from index = start to index = end - 1
                       This does not affect the original array.
*/

/*
let arrSplice = arr.splice(i, 1);

console.log(`Array Splice (${i},5) : `, arrSplice); // [2]

console.log('Original Array After Splice', arr); // [1, 3, 4, 5, 6, 7, 8, 9, 10]
*/
/*
arr.splice(start,number_of_elements_to_be_removed) :
        This returns an new array from index = start till the number_of_elements_to_be_removed provided
        This does affect the original array i.e. It removes the values from index = start
        till the number_of_elements_to_be_removed provided
*/

// WAP to remove the 5th element of an array

console.log(
  'WAP to remove the 5th element of an array [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]'
);

console.log(`let ith = 5;
arr.splice(ith - 1, 1);
`);

let ith = 5;
arr.splice(ith - 1, 1);
console.log('Spliced Array', arr);
