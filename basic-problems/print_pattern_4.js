/*
    Write a program to print the below pattern
    
    Number of Rows = 5
    Number of Columns = 5

    Number of Spaces for each row = (Total Number of rows - Number of *'s in each row) * 2(blank space and space after *)

                                    8    =========>        *
                                    6    =========>       * *
                                    4    =========>      * * *
                                    2    =========>     * * * *
                                    0    =========>    * * * * *
                                    2    =========>     * * * *
                                    4    =========>      * * *
                                    6    =========>       * *
                                    8    =========>        *
             

        const size = 5;

        // Loop through each row
        for (let row = 1; row <= size * 2 - 1; row++) {
            let pattern = '';
            const spaces = Math.abs(size - row);

            // Add spaces before the asterisks

            for (let i = 0; i < spaces; i++) {
                pattern += ' ';
            }

            // Add the asterisks
            const asterisks = size - spaces;
            for (let i = 0; i < asterisks; i++) {
                pattern += '* ';
            }

            // Print the pattern for this row
            console.log(pattern);
        }
    
*/

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

printPattern(5);
