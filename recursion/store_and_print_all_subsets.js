const storeAndPrintAllSubsets = (arr, ans, i, allSubsets) => {
  if (i === arr.length) {
    allSubsets.push(ans.slice());
    return;
  }
  ans.push(arr[i]);
  storeAndPrintAllSubsets(arr, ans, i + 1, allSubsets);
  ans.pop();
  storeAndPrintAllSubsets(arr, ans, i + 1, allSubsets);
};

const allSubsets = [];
storeAndPrintAllSubsets([1, 2, 3], [], 0, allSubsets);
console.log(allSubsets);