/*
Given a string 's', return the max path you can get to move from one letter to another identical one in 's', If there is no such thing return -1,

For example, if s = 'abcadeaj'  the path between two extreme a's is 5 (we exclude the actual a's from the count)

For Example

Input           Output

world             -1

abbabba           5

abcadeaj          5

aabbccdd          -1

abbbbba           5
*/

function maxPath(s) {
  const letterIndices = {};

  for (let i = 0; i < s.length; i++) {
    const letter = s[i];

    if (letterIndices[letter] === undefined) {
      letterIndices[letter] = { lastIndex: i, firstIndex: i };
    } else {
      letterIndices[letter].lastIndex = i;
    }
  }
  let distArr = [];

  for (let key in letterIndices) {
    let sum = 0;
    if (letterIndices[key].lastIndex - letterIndices[key].firstIndex > 0) {
      sum += letterIndices[key].lastIndex - (letterIndices[key].firstIndex + 1);
      distArr.push(sum);
    }
  }

  if (distArr.length && Math.max(...distArr) !== 0) {
    return Math.max(...distArr);
  } else if (Math.max(...distArr) === 0) {
    return -1;
  } else {
    return -1;
  }
}

console.log(maxPath('abbabba'));

console.log(maxPath('world'));

console.log(maxPath('abcadeaj'));

console.log(maxPath('aabbccdd'));

console.log(maxPath('abbbbba'));
