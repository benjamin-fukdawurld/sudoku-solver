import type SudokuArray from "./SudokuArray";
import type { SudokuChecker, SudokuSubGrid } from "./types";
import {
  isSubGridComplete,
  isSubGridSolved,
  missingCount,
  missingIndices,
  missingValues,
  squareIndexGenerator,
} from "./utils";

export default class SudokuSquare implements SudokuSubGrid, SudokuChecker {
  public sudokuArray: SudokuArray;
  public squareIndex: number;

  constructor(sudokuArray: SudokuArray, squareIndex: number) {
    this.sudokuArray = sudokuArray;
    this.squareIndex = squareIndex;
  }

  get(index: number): number {
    const offset =
      Math.floor(this.squareIndex / 3) * 27 + (this.squareIndex % 3) * 3;

    return this.sudokuArray.get(offset + index);
  }

  set(index: number, value: number): this {
    const offset =
      Math.floor(this.squareIndex / 3) * 27 + (this.squareIndex % 3) * 3;

    this.sudokuArray.set(offset + index, value);
    return this;
  }

  get indices(): number[] {
    return Array.from(squareIndexGenerator(this.squareIndex));
  }

  get isValid(): boolean {
    return isSubGridSolved(
      this.sudokuArray,
      squareIndexGenerator(this.squareIndex)
    );
  }

  get isComplete(): boolean {
    return isSubGridComplete(
      this.sudokuArray,
      squareIndexGenerator(this.squareIndex)
    );
  }

  get missingValues(): number[] {
    return missingValues(
      this.sudokuArray,
      squareIndexGenerator(this.squareIndex)
    );
  }

  get missingIndices(): number[] {
    return missingIndices(
      this.sudokuArray,
      squareIndexGenerator(this.squareIndex)
    );
  }

  get missingCount(): number {
    return missingCount(
      this.sudokuArray,
      squareIndexGenerator(this.squareIndex)
    );
  }
}
