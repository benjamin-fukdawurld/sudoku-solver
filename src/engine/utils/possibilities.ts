import type SudokuArray from "../SudokuArray";
import { SudokuValueFlags, SudokuValueFlagSet } from "../types";
import {
  sudokuIndexToRowCol,
  sudokuIndexToSquareIndex,
} from "./index-conversions";
import {
  colIndexGenerator,
  rowIndexGenerator,
  squareIndexGenerator,
} from "./index-iterators";

export function getSubGridIndexPossibilities(
  sudokuArray: SudokuArray,
  generator: Generator<number, void, void>,
  index: number
): number {
  let flags = 0b111111111; // Bits 1-9 set to 1
  const value = sudokuArray.get(index);
  if (value >= 1 && value <= 9) {
    return 0;
  }

  for (const index of generator) {
    const value = sudokuArray.get(index);
    if (value >= 1 && value <= 9) {
      flags &= ~SudokuValueFlags[value as keyof typeof SudokuValueFlags];
    }
  }

  return flags;
}

export function getIndexPossibilities(
  sudokuArray: SudokuArray,
  index: number
): number {
  const value = sudokuArray.get(index);
  if (value >= 1 && value <= 9) {
    return 0;
  }

  const { row, col } = sudokuIndexToRowCol(index);
  const square = sudokuIndexToSquareIndex(index);

  return (
    0b111111111 &
    getSubGridIndexPossibilities(sudokuArray, rowIndexGenerator(row), index) &
    getSubGridIndexPossibilities(sudokuArray, colIndexGenerator(col), index) &
    getSubGridIndexPossibilities(
      sudokuArray,
      squareIndexGenerator(square),
      index
    )
  );
}

export function getAllPossibilities(
  sudokuArray: SudokuArray,
  output?:
    | number[]
    | Int8Array
    | Uint8Array
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
): ArrayLike<number> {
  const possibilities = output ?? Array.from({ length: 81 }, () => 0);

  for (let i = 0; i < 81; i++) {
    possibilities[i] = getIndexPossibilities(sudokuArray, i);
  }

  return possibilities;
}

export function getAllSinglePossibilities(
  input: ArrayLike<number>,
  output?:
    | number[]
    | Int8Array
    | Uint8Array
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
): ArrayLike<number> {
  const singlePossibilities = output ?? Array.from({ length: 81 }, () => 0);

  for (let i = 0; i < 81; i++) {
    const flags = input[i];
    if (SudokuValueFlagSet.has(flags)) {
      singlePossibilities[i] = flags;
    } else {
      singlePossibilities[i] = 0;
    }
  }

  return singlePossibilities;
}

export function getIndexUniquePossibilities(
  index: number,
  possibilities: ArrayLike<number>,
  generator: Generator<number, void, void>
): number {
  const targetFlags = possibilities[index];
  if (targetFlags === 0) {
    return 0;
  }

  let combinedOtherFlags = 0;
  for (const otherIndex of generator) {
    if (otherIndex === index) {
      continue;
    }

    combinedOtherFlags |= possibilities[otherIndex];
  }

  return targetFlags & ~combinedOtherFlags;
}

export function getAllUniquePossibilities(
  possibilities: ArrayLike<number>,
  output?:
    | number[]
    | Int8Array
    | Uint8Array
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
): ArrayLike<number> {
  const uniquePossibilities = output ?? Array.from({ length: 81 }, () => 0);

  for (let i = 0; i < 81; i++) {
    const { row, col } = sudokuIndexToRowCol(i);
    const square = sudokuIndexToSquareIndex(i);

    uniquePossibilities[i] =
      getIndexUniquePossibilities(i, possibilities, rowIndexGenerator(row)) |
      getIndexUniquePossibilities(i, possibilities, colIndexGenerator(col)) |
      getIndexUniquePossibilities(
        i,
        possibilities,
        squareIndexGenerator(square)
      );
  }

  return uniquePossibilities;
}

export function aggregatePossibleValues(flagsArray: number[]): number {
  return flagsArray.reduce((acc, flags) => acc & flags, 0b111111111);
}

export function possibleValuesToArray(flags: number): number[] {
  const values: number[] = [];
  for (let num = 1; num <= 9; num++) {
    if (flags & SudokuValueFlags[num as keyof typeof SudokuValueFlags]) {
      values.push(num);
    }
  }
  return values;
}
