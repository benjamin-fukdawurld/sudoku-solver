import SudokuArray from "./SudokuArray";
import { type SudokuChecker, type SudokuSubGrid } from "./types";
import {
  colIndexGenerator,
  isSubGridComplete,
  isSubGridSolved,
  missingCount,
  missingIndices,
  missingValues,
} from "./utils";

export default class SudokuColumn implements SudokuSubGrid, SudokuChecker {
  public sudokuArray: SudokuArray;
  public colIndex: number;

  constructor(sudokuArray: SudokuArray, colIndex: number) {
    this.sudokuArray = sudokuArray;
    this.colIndex = colIndex;
  }

  get(row: number): number {
    return this.sudokuArray.at({ row, col: this.colIndex });
  }

  set(row: number, value: number): this {
    this.sudokuArray.update({ row, col: this.colIndex }, value);
    return this;
  }

  get indices(): number[] {
    return Array.from(colIndexGenerator(this.colIndex));
  }

  get isValid(): boolean {
    return isSubGridSolved(this.sudokuArray, colIndexGenerator(this.colIndex));
  }

  get isComplete(): boolean {
    return isSubGridComplete(
      this.sudokuArray,
      colIndexGenerator(this.colIndex)
    );
  }

  get missingValues(): number[] {
    return missingValues(this.sudokuArray, colIndexGenerator(this.colIndex));
  }

  get missingIndices(): number[] {
    return missingIndices(this.sudokuArray, colIndexGenerator(this.colIndex));
  }

  get missingCount(): number {
    return missingCount(this.sudokuArray, colIndexGenerator(this.colIndex));
  }
}
