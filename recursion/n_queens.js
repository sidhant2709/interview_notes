const nQueens = (board, row, n, ans) => {
  if (row === n) {
    // Convert the board to the required format and push it to the answer
    ans.push(board.map(row => row.join('')));
    return;
  }

  for (let col = 0; col < n; col++) {
    if (isSafe(board, row, col, n)) {
      board[row][col] = 'Q'; // Place the queen

      nQueens(board, row + 1, n, ans); // Recurse for the next row

      board[row][col] = '.'; // Backtrack
    }
  }
};

const isSafe = (board, row, col, n) => {
  // Check the current row on the left
  for (let i = 0; i < row; i++) {
    if (board[i][col] === 'Q') {
      return false;
    }
  }

  for (let i = 0; i < col; i++) {
    if (board[row][i] === 'Q') {
      return false;
    }
  }

  // Check the upper-left diagonal
  for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
    if (board[i][j] === 'Q') {
      return false;
    }
  }

  // Check the upper-right diagonal
  for (let i = row, j = col; i >= 0 && j < n; i--, j++) {
    if (board[i][j] === 'Q') {
      return false;
    }
  }

  return true;
};

const n = 4;
const board = Array(n).fill().map((item) => Array(n).fill('.')); // Create a 2D array of characters
const ans = [];

nQueens(board, 0, n, ans);

// console.log(ans.map(board => board.join('\n')).join('\n\n'));

console.log(ans);
