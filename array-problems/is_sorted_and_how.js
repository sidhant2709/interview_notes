function isSotredAndHow(arr) {
  let asc = true;
  let desc = true;
  let len = arr.length;

  for (let i = 0; i < len - 1; i++) {
    if (arr[i + 1] > arr[i] && asc) {
      asc = true;
    } else {
      asc = false;
    }
    if (arr[i + 1] < arr[i] && desc) {
      desc = true;
    } else {
      desc = false;
    }
  }

  if (asc) {
    return 'yes in ascending order';
  } else if (desc) {
    return 'yes in descending order';
  } else {
    return 'no';
  }
}

console.log(isSotredAndHow([8, 5, 4, 3, 2, 1]));
