/*
    Write a program to print the below pattern

    Number of Rows = 5
    Number of Columns = 5

    Number of Spaces for each row = (Total Number of rows - Number of *'s in each row) * 2(blank space and space after *)

        8  ------------->              *
        6  ------------->             * *
        4  ------------->            * * *
        2  ------------->           * * * *
        0  ------------->          * * * * *


*/
{
  function printPattern(rows) {
    for (let i = 1; i <= rows; i++) {
      let row = '';

      for (let j = 1; j <= rows - i; j++) {
        row += ' ';
      }

      for (let k = 1; k <= i; k++) {
        row += '* ';
      }

      console.log(row);
    }
  }

  printPattern(5);
}
{
  function printPattern2(rows) {
    for (let i = rows - 1; i >= 1; i--) {
      let row = '';

      for (let j = 1; j <= rows - i; j++) {
        row += ' ';
      }

      for (let k = 1; k <= i; k++) {
        row += '* ';
      }

      console.log(row);
    }
  }
  printPattern2(5);
}
