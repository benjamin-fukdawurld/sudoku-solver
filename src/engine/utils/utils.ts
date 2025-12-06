import {
  SudokuValueFlags,
  SudokuValueFlagsValues,
  type SudokuSubGrid,
} from "../types.js";

export function isValid(subGrid: SudokuSubGrid): boolean {
  const seen = new Set<number>();
  for (let index = 0; index < 9; index++) {
    const value = subGrid.get(index);
    if (value <= 0 || value > 9 || seen.has(value)) {
      return false;
    }
    seen.add(value);
  }

  return seen.size === 9;
}

export function isComplete(subGrid: SudokuSubGrid): boolean {
  for (let index = 0; index < 9; index++) {
    const value = subGrid.get(index);
    if (value <= 0 || value > 9) {
      return false;
    }
  }

  return true;
}

export function missingValues(subGrid: SudokuSubGrid): number[] {
  const present = new Set<number>();
  for (let index = 0; index < 9; index++) {
    const value = subGrid.get(index);
    if (value > 0 && value <= 9) {
      present.add(value);
    }
  }

  const missing: number[] = [];
  for (let num = 1; num <= 9; num++) {
    if (!present.has(num)) {
      missing.push(num);
    }
  }

  return missing;
}

export function missingIndices(subGrid: SudokuSubGrid): number[] {
  const missing: number[] = [];
  for (let index = 0; index < 9; index++) {
    const value = subGrid.get(index);
    if (value <= 0 || value > 9) {
      missing.push(index);
    }
  }
  return missing;
}

export function missingCount(subGrid: SudokuSubGrid): number {
  let missingCount = 0;
  for (let index = 0; index < 9; index++) {
    const value = subGrid.get(index);
    if (value <= 0 || value > 9) {
      missingCount++;
    }
  }
  return missingCount;
}

export function getPossibleValues(
  index: number,
  subGrid: SudokuSubGrid
): number {
  let flags = 0b111111111; // Bits 1-9 set to 1
  if (subGrid.get(index) >= 1 && subGrid.get(index) <= 9) {
    return 0;
  }

  for (let i = 0; i < 9; i++) {
    const value = subGrid.get(i);
    if (value >= 1 && value <= 9) {
      flags &= ~SudokuValueFlags[value as keyof typeof SudokuValueFlags];
    }
  }

  return flags;
}

export function getAllPossibleValues(sudoku: SudokuSubGrid): number[] {
  const possibilities: number[] = [];
  for (let index = 0; index < 81; index++) {
    const flags = getPossibleValues(index, sudoku);
    possibilities.push(flags);
  }

  return possibilities;
}

export function getSinglePossibilities(subgridFlags: number[]): number[] {
  const values = Object.values(SudokuValueFlags) as number[];
  return subgridFlags.map((flags) => {
    return values.includes(flags)
      ? SudokuValueFlagsValues[flags as keyof typeof SudokuValueFlagsValues]
      : 0;
  });
}

export function getUniquePossibilities(subgridFlags: number[]): number[] {
  return subgridFlags.reduce<number[]>((acc, current, index, array) => {
    if (current === 0) {
      acc.push(0);
      return acc;
    }

    for (let i = 0; i < subgridFlags.length; i++) {
      if (i === index) {
        continue;
      }
      current &= ~array[i];
    }

    acc.push(current);
    return acc;
  }, []);
}
