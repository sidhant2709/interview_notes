/*
    Write a program to print the below pattern
    
    Number of Rows = 5
    Number of Columns = 5

    Number of Spaces for each row = (Total Number of rows - Number of *'s in each row) * 2(blank space and space after *)

                                    8    =========>    *
                                    6    =========>    * *
                                    4    =========>    * * *
                                    2    =========>    * * * *
                                    0    =========>    * * * * *
                                    2    =========>    * * * *
                                    4    =========>    * * *
                                    6    =========>    * *
                                    8    =========>    *
             
    
*/

function printPattern(rows) {
  for (let i = 1; i <= rows; i++) {
    let output = '';

    for (let k = 1; k <= i; k++) {
      output += '* ';
    }
    for (let j = 1; j <= (rows - i) * 2; j++) {
      output += ' ';
    }

    console.log(output);
  }
  for (let i = rows - 1; i >= 1; i--) {
    let output = '';

    for (let k = 1; k <= i; k++) {
      output += '* ';
    }
    for (let j = 1; j <= (rows - 1 - i) * 2; j++) {
      output += ' ';
    }

    console.log(output);
  }
}

printPattern(5);
