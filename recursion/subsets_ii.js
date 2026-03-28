const storeAndPrintAllUniqueSubsets = (arr, ans, i, allUniqueSubsets) => {
  if (i === arr.length) {
    allUniqueSubsets.push(ans.slice());
    return;
  }
  ans.push(arr[i]);
  storeAndPrintAllUniqueSubsets(arr, ans, i + 1, allUniqueSubsets);
  ans.pop();
  let idx = i + 1;
  while( idx < arr.length && arr[idx] === arr[idx - 1]) {
    idx++;
  }
  storeAndPrintAllUniqueSubsets(arr, ans, idx, allUniqueSubsets);
};

const allUniqueSubsets = [];
storeAndPrintAllUniqueSubsets([1, 2, 2], [], 0, allUniqueSubsets);
console.log(allUniqueSubsets);