/* 
    Write a program to print all substrings of a given string
*/

// function runProgram(input) {
//     input = input.trim();
//     let str_length = input.length;
//     for (let substr_length = 1; substr_length <= str_length; substr_length++) {
//       for (let start = 0; start <= str_length - substr_length; start++) {
//         let end = start + substr_length - 1;
//         let str = '';
//         for (let substr_index = start; substr_index <= end; substr_index++) {
//           str += input[substr_index];
//         }
//         console.log(str);
//       }
//     }
//   }

//   runProgram(`abc`);

//   function runProgram(input) {
//     input = input.trim();
//     let str_length = input.length;

//     for (let substr_length = 1; substr_length <= str_length; substr_length++) {
//       for (let start = 0; start <= str_length - substr_length; start++) {
//         let end = start + substr_length - 1;
//         let str = '';
//         for (let substr_index = start; substr_index <= end; substr_index++) {
//           str += input[substr_index];
//         }
//         console.log(str);
//       }
//     }
//   }

function runProgram(input) {
  input = input.trim();
  let length = input.length;

  for (let substr_length = 1; substr_length <= length; substr_length++) {
    for (let start = 0; start <= length - substr_length; start++) {
      let end = start + substr_length - 1;
      let str = '';
      for (let i = start; i <= end; i++) {
        str += input[i];
      }
      console.log(str);
    }
  }
}

runProgram('abcd');
