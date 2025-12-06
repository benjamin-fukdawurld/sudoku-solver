import type SudokuArray from "../SudokuArray";
import { some } from "./array-utils";
import { colIndexGenerator, rowIndexGenerator } from "./index-iterators";

export function isSubGridInvalid(
  sudokuArray: SudokuArray,
  indices: Generator<number, void, void>
): boolean {
  const seen = new Set<number>();
  return some(
    sudokuArray,
    (value) => {
      if (value <= 0 || value > 9) {
        return true;
      }

      if (seen.has(value)) {
        return true;
      }
      seen.add(value);

      return false;
    },
    indices
  );
}

export function isSubGridSolved(
  sudokuArray: SudokuArray,
  indices: Generator<number, void, void>
): boolean {
  return !isSubGridInvalid(sudokuArray, indices);
}

export function isSubGridIncomplete(
  sudokuArray: SudokuArray,
  indices: Generator<number, void, void>
): boolean {
  return some(sudokuArray, (value) => value <= 0 || value > 9, indices);
}

export function isInvalid(sudokuArray: SudokuArray) {
  for (let i = 0; i < 9; i++) {
    if (
      isSubGridInvalid(sudokuArray, rowIndexGenerator(i)) ||
      isSubGridInvalid(sudokuArray, colIndexGenerator(i))
    ) {
      return true;
    }
  }

  return false;
}

export function isSolved(sudokuArray: SudokuArray) {
  return !isInvalid(sudokuArray);
}

export function isIncomplete(sudokuArray: SudokuArray) {
  for (let i = 0; i < 9; i++) {
    if (isSubGridIncomplete(sudokuArray, rowIndexGenerator(i))) {
      return true;
    }
  }

  return false;
}
