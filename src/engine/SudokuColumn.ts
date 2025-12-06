import { type SudokuChecker, type SudokuSubGrid } from "./types";
import {
  isComplete,
  isValid,
  missingCount,
  missingIndices,
  missingValues,
} from "./utils";

export default class SudokuColumn implements SudokuSubGrid, SudokuChecker {
  private data: DataView;

  public colIndex: number;

  constructor(buffer: ArrayBufferLike, colIndex: number) {
    this.data = new DataView(buffer);
    this.colIndex = colIndex;
  }

  get(row: number): number {
    return this.data.getInt8(row * 9 + this.colIndex);
  }

  set(row: number, value: number): this {
    this.data.setInt8(row * 9 + this.colIndex, value);
    return this;
  }

  get indices(): number[] {
    return Array.from({ length: 9 }).map((_, row) => row * 9 + this.colIndex);
  }

  get isValid(): boolean {
    return isValid(this);
  }

  get isComplete(): boolean {
    return isComplete(this);
  }

  get missingValues(): number[] {
    return missingValues(this);
  }

  get missingIndices(): number[] {
    return missingIndices(this);
  }

  get missingCount(): number {
    return missingCount(this);
  }
}
