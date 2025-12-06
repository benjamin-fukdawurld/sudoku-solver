import type SudokuArray from "../engine/SudokuArray";
import {
  SudokuValueFlags,
  SudokuValueFlagSet,
  SudokuValueFlagsValues,
} from "../engine/types";
import {
  colIndexGenerator,
  getSquareIndex,
  rowIndexGenerator,
  squareIndexGenerator,
  sudokuIndexToRowCol,
} from "../engine/utils";
import {
  getAllPossibilities,
  getAllSinglePossibilities,
  getAllUniquePossibilities,
  getIndexPossibilities,
  getIndexUniquePossibilities,
  possibleValuesToArray,
} from "../engine/utils/possibilities";

export default class PossibilityMap {
  public _possibilities: Uint16Array;
  private _sudoku: SudokuArray;

  constructor(sudoku: SudokuArray) {
    this._sudoku = sudoku;
    this._possibilities = new Uint16Array(81 * 3);
    this.possibilities.fill(0b111111111); // All values (1-9) are possible initially
    this.singlePossibilities.fill(0);
    this.uniquePossibilities.fill(0);
    this.update();
  }

  get sudoku(): SudokuArray {
    return this._sudoku;
  }

  set sudoku(sudoku: SudokuArray) {
    this._sudoku = sudoku;
    this.update();
  }

  get possibilities(): Uint16Array {
    return new Uint16Array(this._possibilities.buffer, 0, 81);
  }

  get singlePossibilities(): Uint16Array {
    return new Uint16Array(this._possibilities.buffer, 81 * 2, 81);
  }

  get uniquePossibilities(): Uint16Array {
    return new Uint16Array(this._possibilities.buffer, 81 * 4, 81);
  }

  update() {
    getAllPossibilities(this._sudoku, this.possibilities);
    getAllSinglePossibilities(this.possibilities, this.singlePossibilities);
    getAllUniquePossibilities(this.possibilities, this.uniquePossibilities);
  }

  getPossibleValuesAt(index: number): number[] {
    const flags = this.possibilities[index];
    return possibleValuesToArray(flags);
  }

  getSinglePossibleValueAt(index: number): number {
    const flag = this.singlePossibilities[index];
    return flag
      ? SudokuValueFlagsValues[flag as keyof typeof SudokuValueFlagsValues]
      : 0;
  }

  getUniquePossibleValueAt(index: number): number {
    const flag = this.uniquePossibilities[index];
    return flag
      ? SudokuValueFlagsValues[flag as keyof typeof SudokuValueFlagsValues]
      : 0;
  }

  updateIndexPossibilities(index: number) {
    const { row, col } = sudokuIndexToRowCol(index);
    const squareIndex = getSquareIndex(row, col);
    const possibilities = this.possibilities;

    const indices = new Set<number>([
      ...rowIndexGenerator(row),
      ...colIndexGenerator(col),
      ...squareIndexGenerator(squareIndex),
    ]);

    const value = this.sudoku.get(index);
    const flag = value
      ? SudokuValueFlags[value as keyof typeof SudokuValueFlags]
      : 0;
    for (const i of indices) {
      possibilities[i] = value
        ? possibilities[i] & ~flag
        : getIndexPossibilities(this._sudoku, i);
    }

    this.updateUniqueAndSinglePossibilities(indices);
  }

  private updateUniqueAndSinglePossibilities(indices: Iterable<number>) {
    const possibilities = this.possibilities;
    const singlePossibilities = this.singlePossibilities;
    const uniquePossibilities = this.uniquePossibilities;

    for (const i of indices) {
      const value = this.sudoku.get(i);
      if (value >= 1 && value <= 9) {
        possibilities[i] = 0;
        singlePossibilities[i] = 0;
        uniquePossibilities[i] = 0;
        continue;
      }

      if (SudokuValueFlagSet.has(possibilities[i])) {
        singlePossibilities[i] = possibilities[i];
      } else {
        singlePossibilities[i] = 0;
      }

      const { row, col } = sudokuIndexToRowCol(i);
      const squareIndex = getSquareIndex(row, col);

      uniquePossibilities[i] =
        getIndexUniquePossibilities(i, possibilities, rowIndexGenerator(row)) |
        getIndexUniquePossibilities(i, possibilities, colIndexGenerator(col)) |
        getIndexUniquePossibilities(
          i,
          possibilities,
          squareIndexGenerator(squareIndex)
        );
    }
  }
}
