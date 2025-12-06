import type SudokuArray from "./SudokuArray";
import { type SudokuChecker, type SudokuSubGrid } from "./types";
import {
  isSubGridComplete,
  isSubGridSolved,
  missingCount,
  missingIndices,
  missingValues,
} from "./utils";
import { rowIndexGenerator } from "./utils/index-iterators";

export default class SudokuRow implements SudokuSubGrid, SudokuChecker {
  public sudokuArray: SudokuArray;
  public rowIndex: number;

  constructor(sudokuArray: SudokuArray, rowIndex: number) {
    this.sudokuArray = sudokuArray;
    this.rowIndex = rowIndex;
  }

  get(col: number): number {
    return this.sudokuArray.at({ row: this.rowIndex, col });
  }

  set(col: number, value: number): this {
    this.sudokuArray.update({ row: this.rowIndex, col }, value);
    return this;
  }

  get indices(): number[] {
    return Array.from(rowIndexGenerator(this.rowIndex));
  }

  get isValid(): boolean {
    return isSubGridSolved(this.sudokuArray, rowIndexGenerator(this.rowIndex));
  }

  get isComplete(): boolean {
    return isSubGridComplete(
      this.sudokuArray,
      rowIndexGenerator(this.rowIndex)
    );
  }

  get missingValues(): number[] {
    return missingValues(this.sudokuArray, rowIndexGenerator(this.rowIndex));
  }

  get missingIndices(): number[] {
    return missingIndices(this.sudokuArray, rowIndexGenerator(this.rowIndex));
  }

  get missingCount(): number {
    return missingCount(this.sudokuArray, rowIndexGenerator(this.rowIndex));
  }
}
