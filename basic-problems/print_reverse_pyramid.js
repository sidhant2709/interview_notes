/*
    Write a program to print the below pattern
    
    Number of Rows = 5
    Number of Columns = 5

    Number of Spaces for each row = (Total Number of rows - Number of *'s in each row) * 2(blank space and space after *)

        0  ------------->          * * * * *
        2  ------------->           * * * * 
        4  ------------->            * * *
        6  ------------->             * * 
        8  ------------->              *  
             
    
*/

function printPattern(rows) {
  for (let i = rows; i >= 1; i--) {
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
