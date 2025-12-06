import { type SudokuChecker, type SudokuSubGrid } from "./types";
import {
  isComplete,
  isValid,
  missingCount,
  missingIndices,
  missingValues,
  rowColToSudokuIndex,
} from "./utils";
import { rowIndexGenerator } from "./utils/index-iterators";

export default class SudokuRow implements SudokuSubGrid, SudokuChecker {
  private data: DataView;

  public rowIndex: number;

  constructor(buffer: ArrayBufferLike, rowIndex: number) {
    this.data = new DataView(buffer);
    this.rowIndex = rowIndex;
  }

  get(col: number): number {
    return this.data.getInt8(rowColToSudokuIndex(this.rowIndex, col));
  }

  set(col: number, value: number): this {
    this.data.setInt8(rowColToSudokuIndex(this.rowIndex, col), value);
    return this;
  }

  get indices(): number[] {
    return Array.from(rowIndexGenerator(this.rowIndex));
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
