'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route('/api/check').post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    if (!puzzle || !coordinate || !value) {
      res.json({ error: 'Required field(s) missing' });
      return;
    }

    if (
      coordinate.length !== 2 ||
      !/[A-I]/i.test(coordinate.split("")[0]) ||
      !/^[1-9]$/.test(coordinate.split("")[1])
    ) {
      res.json({ error: 'Invalid coordinate' });
      return;
    }

    if (!value || typeof value !== 'string' || !/^[1-9]$/.test(value)) {
      res.json({ error: 'Invalid value' });
      return;
    }

    if (puzzle.length !== 81) {
      res.json({ error: "Expected puzzle to be 81 characters long" });
      return;
    }

    if (new RegExp('[^0-9.]').test(puzzle)) {
      res.json({ error: "Invalid characters in puzzle" });
      return;
    }

    const row = coordinate.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
    const column = Number(coordinate.split("")[1]) - 1;
    const existingValue = puzzle.charAt(row * 9 + column);

    if (existingValue === value.toString()) {
      res.json({ valid: true });
      return;
    }

    let validCol = solver.checkColPlacement(puzzle, row, column, value);
    let validReg = solver.checkRegionPlacement(puzzle, row, column, value);
    let validRow = solver.checkRowPlacement(puzzle, row, column, value);
    let conflicts = [];

    if (validCol && validReg && validRow) {
      res.json({ valid: true });
    } else {
      if (!validRow) {
        conflicts.push("row");
      }
      if (!validCol) {
        conflicts.push("column");
      }
      if (!validReg) {
        conflicts.push("region");
      }
      res.json({ valid: false, conflict: conflicts });
    }
  });

   app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;
    if (!puzzle) {
      res.json({ error: "Required field missing" });
      return;
    }
    if (puzzle.length != 81) {
      res.json({ error: "Expected puzzle to be 81 characters long" });
      return;
    }
    if (/[^0-9.]/g.test(puzzle)) {
      res.json({ error: "Invalid characters in puzzle" });
      return;
    }
    let solvedString = solver.solve(puzzle);
    if (!solvedString) {
      res.json({ error: "Puzzle cannot be solved" });
    } else {
      res.json({ solution: solvedString });
    }
  });
};

