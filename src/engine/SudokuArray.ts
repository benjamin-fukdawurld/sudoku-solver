import SudokuColumn from "./SudokuColumn";
import SudokuRow from "./SudokuRow";
import SudokuSquare from "./SudokuSquare";
import { type SudokuChecker, type SudokuSubGrid } from "./types";
import {
  isComplete,
  isValid,
  missingCount,
  missingIndices,
  missingValues,
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
    const index = row * 9 + col;
    return this.data[index];
  }

  update({ row, col }: { row: number; col: number }, value: number): this {
    const index = row * 9 + col;
    this.data[index] = value;
    return this;
  }

  row(rowIndex: number): SudokuRow {
    return new SudokuRow(this.data.buffer, rowIndex);
  }

  column(colIndex: number): SudokuColumn {
    return new SudokuColumn(this.data.buffer, colIndex);
  }

  square(squareIndex: number): SudokuSquare {
    return new SudokuSquare(this.data.buffer, squareIndex);
  }

  get isValid(): boolean {
    return [...Array(9)].every((_, i) => isValid(this.row(i)));
  }

  get isComplete(): boolean {
    return [...Array(9)].every((_, i) => isComplete(this.row(i)));
  }

  get missingValues(): number[] {
    return Array.from(
      new Set([...Array(9)].flatMap((_, i) => missingValues(this.row(i))))
    );
  }

  get missingIndices(): number[] {
    return [...Array(9)]
      .map((_, i) => missingIndices(this.row(i)))
      .map((arr, row) => arr.map((col) => row * 9 + col))
      .flat();
  }

  get missingCount(): number {
    return [...Array(9)].reduce(
      (sum, _, i) => sum + missingCount(this.row(i)),
      0
    );
  }
}
