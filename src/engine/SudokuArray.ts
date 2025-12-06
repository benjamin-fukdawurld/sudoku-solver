import SudokuColumn from "./SudokuColumn";
import SudokuRow from "./SudokuRow";
import SudokuSquare from "./SudokuSquare";
import { type SudokuChecker, type SudokuSubGrid } from "./types";
import {
  allIndicesGenerator,
  isComplete,
  isSolved,
  missingCount,
  missingIndices,
  missingValues,
  rowColToSudokuIndex,
  rowIndexGenerator,
} from "./utils";

export default class SudokuArray implements SudokuSubGrid, SudokuChecker {
  public data: Int8Array;

  constructor(data?: Int8Array) {
    this.data = data ?? new Int8Array(81);
    this.data.fill(0);
  }

  parseJSON(json: string): this {
    const arr: number[] = JSON.parse(json);
    if (!Array.isArray(arr)) {
      throw new Error("Invalid Sudoku array");
    }

    return this.fill(arr);
  }

  fill(values: number[] | number[][]): this {
    const arr = values.flat();
    if (arr.length !== 81) {
      throw new Error("Invalid Sudoku array");
    }

    arr.forEach((value, index) => {
      if (typeof value !== "number" || !Number.isInteger(value)) {
        throw new Error(`Invalid value at index ${index}`);
      }
    });

    this.data.set(arr);
    return this;
  }

  get(index: number): number {
    return this.data[index];
  }

  set(index: number, value: number): this {
    this.data[index] = value;
    return this;
  }

  get indices(): number[] {
    return Array.from({ length: 81 }).map((_, index) => index);
  }

  at({ row, col }: { row: number; col: number }): number {
    const index = rowColToSudokuIndex(row, col);
    return this.data[index];
  }

  update({ row, col }: { row: number; col: number }, value: number): this {
    const index = rowColToSudokuIndex(row, col);
    this.data[index] = value;
    return this;
  }

  row(rowIndex: number): SudokuRow {
    return new SudokuRow(this, rowIndex);
  }

  column(colIndex: number): SudokuColumn {
    return new SudokuColumn(this, colIndex);
  }

  square(squareIndex: number): SudokuSquare {
    return new SudokuSquare(this, squareIndex);
  }

  get isValid(): boolean {
    return isSolved(this);
  }

  get isComplete(): boolean {
    return isComplete(this);
  }

  get missingValues(): number[] {
    return Array.from(
      new Set(
        Array.from({ length: 9 }, (_, i) =>
          missingValues(this, rowIndexGenerator(i))
        ).flat()
      )
    );
  }

  get missingIndices(): number[] {
    return missingIndices(this, allIndicesGenerator());
  }

  get missingCount(): number {
    return missingCount(this, allIndicesGenerator());
  }
}
