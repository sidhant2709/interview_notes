const binarySearch = (arr, target, start, end) => {
  if (start <= end) {
    const mid = Math.floor((start + end) / 2);
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      return binarySearch(arr, target, mid + 1, end);
    } else {
      return binarySearch(arr, target, start, mid - 1);
    }
  }
  return -1;
};

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const target = 4;

console.log(binarySearch(arr, target, 0, arr.length - 1));
