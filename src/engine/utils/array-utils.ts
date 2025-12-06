import type SudokuArray from "../SudokuArray";

export function every(
  sudoku: SudokuArray,
  predicate: (value: number, index: number, sudoku: SudokuArray) => boolean,
  generator?: Generator<number, void, void>
): boolean {
  const indexGen =
    generator ?? Array.from({ length: 81 }, (_, i) => i).values();
  for (const index of indexGen) {
    if (!predicate(sudoku.get(index), index, sudoku)) {
      return false;
    }
  }

  return true;
}

export function fill(
  sudoku: SudokuArray,
  value: number,
  options?: {
    generator?: Generator<number, void, void>;
    start?: number;
    end?: number;
  }
): void {
  const indexGen =
    options?.generator ?? Array.from({ length: 81 }, (_, i) => i).values();
  const start = options?.start ?? 0;
  const end = options?.end ?? 81;
  let count = 0;
  for (const index of indexGen) {
    if (count < start) {
      count++;
      continue;
    }
    if (count >= end) {
      break;
    }

    sudoku.set(index, value);
    count++;
  }
}

export function filter(
  sudoku: SudokuArray,
  predicate: (value: number, index: number, sudoku: SudokuArray) => boolean,
  generator?: Generator<number, void, void>
): number[] {
  const result: number[] = [];
  const indexGen =
    generator ?? Array.from({ length: 81 }, (_, i) => i).values();
  for (const index of indexGen) {
    if (predicate(sudoku.get(index), index, sudoku)) {
      result.push(index);
    }
  }
  return result;
}

export function some(
  sudoku: SudokuArray,
  predicate: (value: number, index: number, sudoku: SudokuArray) => boolean,
  generator?: Generator<number, void, void>
): boolean {
  const indexGen =
    generator ?? Array.from({ length: 81 }, (_, i) => i).values();
  for (const index of indexGen) {
    if (predicate(sudoku.get(index), index, sudoku)) {
      return true;
    }
  }
  return false;
}

export function map<T>(
  sudoku: SudokuArray,
  callback: (value: number, index: number, sudoku: SudokuArray) => T,
  generator?: Generator<number, void, void>
): T[] {
  const result: T[] = [];
  const indexGen =
    generator ?? Array.from({ length: 81 }, (_, i) => i).values();
  for (const index of indexGen) {
    result.push(callback(sudoku.get(index), index, sudoku));
  }
  return result;
}

export function forEach(
  sudoku: SudokuArray,
  callback: (value: number, index: number, sudoku: SudokuArray) => void,
  generator?: Generator<number, void, void>
): void {
  const indexGen =
    generator ?? Array.from({ length: 81 }, (_, i) => i).values();
  for (const index of indexGen) {
    callback(sudoku.get(index), index, sudoku);
  }
}

export function reduce<T>(
  sudoku: SudokuArray,
  callback: (
    accumulator: T,
    value: number,
    index: number,
    sudoku: SudokuArray
  ) => T,
  initialValue: T,
  generator?: Generator<number, void, void>
): T {
  let accumulator = initialValue;
  const indexGen =
    generator ?? Array.from({ length: 81 }, (_, i) => i).values();
  for (const index of indexGen) {
    accumulator = callback(accumulator, sudoku.get(index), index, sudoku);
  }
  return accumulator;
}
