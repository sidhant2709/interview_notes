const getPermutations = (arr, idx, ans) => {
  if(idx === arr.length) {
    ans.push([...arr]);
    // ans.push(arr.slice());
    return;
  }

  for(let i = idx; i < arr.length; i++) {
    // Swap the elements at idx and i
    [arr[idx], arr[i]] = [arr[i], arr[idx]];

    // Recursively call the function with the next index
    getPermutations(arr, idx + 1, ans);

    // Backtrack by swapping back
    [arr[idx], arr[i]] = [arr[i], arr[idx]];
  }

}

const arr = [1, 2, 3];
const ans = [];

getPermutations(arr, 0, ans);
console.log(ans);