import type SudokuArray from "../SudokuArray";
import { reduce } from "./array-utils";

export function missingValues(
  sudoku: SudokuArray,
  generator: Iterable<number>
): number[] {
  const missing = new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  for (const index of generator) {
    const value = sudoku.get(index);
    if (value > 0 && value <= 9) {
      missing.delete(value);
    }
  }

  return Array.from(missing);
}

export function missingIndices(
  sudoku: SudokuArray,
  generator: Iterable<number>
): number[] {
  return reduce<number[]>(
    sudoku,
    (acc, value, index) => {
      if (value <= 0 || value > 9) {
        acc.push(index);
      }

      return acc;
    },
    [],
    generator
  );
}

export function missingCount(
  sudoku: SudokuArray,
  generator: Iterable<number>
): number {
  return reduce<number>(
    sudoku,
    (acc, value) => {
      if (value <= 0 || value > 9) {
        ++acc;
      }

      return acc;
    },
    0,
    generator
  );
}
