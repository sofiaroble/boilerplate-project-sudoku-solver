
class SudokuSolver {
  validate(puzzleString) {
  const regex = /^[1-9\.]{81}$/;
  if (!regex.test(puzzleString)) {
    return { valid: false, error: 'Invalid characters in puzzle' };
  }
     return { valid: true };
  }
  
    

     checkRowPlacement(puzzleString, row, column, value) {
    let grid = this.transform(puzzleString);
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === Number(value)) {
        return false;
      }
    }
    return true;
  }


  checkColPlacement(puzzleString, row, column, value) {
    let grid = this.transform(puzzleString);
    for (let i = 0; i < 9; i++) {
      if (grid[i][column] === Number(value)) {
        return false;
      }
    }
    return true;
  }
  checkRegionPlacement(puzzleString, row, column, value) {
  let grid = this.transform(puzzleString);

  let startRow = Math.floor(row / 3) * 3;
  let startCol = Math.floor(column / 3) * 3;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[startRow + i][startCol + j] === Number(value)) {
        return false;
      }
    }
  }

  return true;
}


 solveSudoku(grid, row, col) {
    if (row == 9 - 1 && col === 9) return true;
     
    if (col == 9) {
        row++;
        col = 0;
    }

    if (grid[row][col] != 0) return this.solveSudoku(grid, row, col + 1);
  
    for (let num = 1; num < 10; num++) {
        
        if (this.isSafe(grid, row, col, num)) {
          
            grid[row][col] = num;
          
            if (this.solveSudoku(grid, row, col + 1)) return true;
        }
        grid[row][col] = 0;
    }
    return false;
}


  isSafe(grid, row, col, num) {
    for (let x = 0; x <= 8; x++) if (grid[row][x] === num) return false;
    
    for (let x = 0; x <= 8; x++) if (grid[x][col] === num) return false;
      
    let startRow = row - (row % 3),
      startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) 
     for (let j = 0; j < 3; j++) 
        if (grid[i + startRow][j + startCol] === num) return false;

   return true;
    
     }
  

 transform(puzzleString) {
  let grid = [];
  let row = [];
  let col = 0;

  for (let i = 0; i < puzzleString.length; i++) {
    if (col === 9) {
      grid.push(row);
      row = [];
      col = 0;
    }

    if (puzzleString[i] === ".") {
      row.push(0);
    } else {
      row.push(Number(puzzleString[i]));
    }

    col++;
  }

  grid.push(row);

  return grid;
}


  solve(puzzleString) {
  if (puzzleString.length !== 81) {
    return false;
  }

  if (/[^0-9.]/g.test(puzzleString)) {
    return false;
  }

  let grid = this.transform(puzzleString);
  let solved = this.solveSudoku(grid, 0, 0);

  if (!solved) {
    return false;
  }

  let solvedString = grid.map(row => row.join('')).join('');
  console.log("Solved puzzle string: " + solvedString);
  return solvedString;
}

}
module.exports = SudokuSolver;