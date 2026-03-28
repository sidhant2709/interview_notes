const printAllSubsets = (arr, ans, i) => {
  if (i === arr.length) {
    console.log(ans);
    return;
  }
  ans.push(arr[i]);
  printAllSubsets(arr, ans, i + 1);
  ans.pop();
  let idx = i + 1;
  while (idx < arr.length && arr[idx] === arr[idx - 1]) {
    idx++;
  }
  printAllSubsets(arr, ans, idx);
};

printAllSubsets([1, 2, 3], [], 0);

printAllSubsets([1, 2, 2], [], 0);
