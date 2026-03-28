const isArraySorted = (arr, size) => {
  if (size === 0 || size === 1) {
    return true;
  }
  return arr[size - 1] >= arr[size - 2] && isArraySorted(arr, size - 1);
}

const arr1 = [1, 2, 3, 4, 5];
const arr2 = [1, 3, 2, 4, 5];
const arr3 = [5, 4, 3, 2, 1];
const arr4 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reverse();
const arr5 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

isArraySorted(arr1, arr1.length) ? console.log("Array is sorted") : console.log("Array is not sorted");
isArraySorted(arr2, arr2.length) ? console.log("Array is sorted") : console.log("Array is not sorted");
isArraySorted(arr3, arr3.length) ? console.log("Array is sorted") : console.log("Array is not sorted");
isArraySorted(arr4, arr4.length) ? console.log("Array is sorted") : console.log("Array is not sorted");
isArraySorted(arr5, arr5.length) ? console.log("Array is sorted") : console.log("Array is not sorted");