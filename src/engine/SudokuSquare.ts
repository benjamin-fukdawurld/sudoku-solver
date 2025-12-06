import type { SudokuChecker, SudokuSubGrid } from "./types";
import {
  isComplete,
  isValid,
  missingCount,
  missingIndices,
  missingValues,
} from "./utils";

export default class SudokuSquare implements SudokuSubGrid, SudokuChecker {
  private data: DataView;

  public squareIndex: number;

  constructor(buffer: ArrayBufferLike, squareIndex: number) {
    this.data = new DataView(buffer);
    this.squareIndex = squareIndex;
  }

  private get squarePosition(): { row: number; col: number } {
    const row = Math.floor(this.squareIndex / 3) * 3;
    const col = (this.squareIndex % 3) * 3;

    return { row, col };
  }

  private getCellPosition(localIndex: number): { row: number; col: number } {
    const { row, col } = this.squarePosition;

    return {
      row: row + Math.floor(localIndex / 3),
      col: col + (localIndex % 3),
    };
  }

  private positionToIndex(row: number, col: number): number {
    return row * 9 + col;
  }

  private getCellIndex(localIndex: number): number {
    const { row, col } = this.getCellPosition(localIndex);
    return this.positionToIndex(row, col);
  }

  get(index: number): number {
    const cellIndex = this.getCellIndex(index);
    return this.data.getInt8(cellIndex);
  }

  set(index: number, value: number): this {
    const cellIndex = this.getCellIndex(index);
    this.data.setInt8(cellIndex, value);
    return this;
  }

  get indices(): number[] {
    return Array.from({ length: 9 }).map((_, localIndex) =>
      this.getCellIndex(localIndex)
    );
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
