/*
    Return true if the given string is palindrom, Otherwise return false

    Note: 
    You will need to remove all non-alphanumeric charcters(puntuations,spaces and symbols) and turn everything into 
    lowercase or uppercase in order to check for palindrome    

*/
/*
    Steps
        make everythimg lowercase
        strip all non alphanumeric characters
        check if palindrome
*/
function palindrome(str) {
  // str = str.toLowerCase();
  // const alphanumeric = str
  //   .split('')
  //   .filter(ch => {
  //     if (ch >= 'A' && ch <= 'Z') {
  //       return true;
  //     } else if (ch >= 'a' && ch <= 'z') {
  //       return true;
  //     } else if (ch >= '0' && ch <= '9') {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   })
  //   .join('');
  // ----------------------------------------------------------------------
  //Regx
  // const alphanumeric = str
  //   .toLowerCase()
  //   .split('')
  //   .filter(ch => /[a-zA-Z0-9]/.test(ch))
  //   .join('');
  // const strLength = alphanumeric.length;
  // for (let i = 0; i < Math.floor(strLength / 2); i++) {
  //   if (alphanumeric[i] !== alphanumeric[strLength - 1 - i]) {
  //     return false;
  //   }
  // }
  // return true;

  const len = str.length;

  let i = 0;
  let j = len - 1;

  while (true) {
    while (i < len && !/[a-zA-Z0-9]/.test(str[i])) {
      i++;
    }
    while (j > 0 && !/[a-zA-Z0-9]/.test(str[j])) {
      j--;
    }

    if (i >= j) {
      return true;
    }
    if (str[i].toLowerCase() !== str[j].toLowerCase()) {
      return false;
    }
    i++;
    j--;
  }
}

console.log(palindrome('madam'));
