export const SudokuValueFlags = {
  1: 0b1,
  2: 0b10,
  3: 0b100,
  4: 0b1000,
  5: 0b10000,
  6: 0b100000,
  7: 0b1000000,
  8: 0b10000000,
  9: 0b100000000,
} as const;

export const SudokuValueFlagsValues = {
  0b1: 1,
  0b10: 2,
  0b100: 3,
  0b1000: 4,
  0b10000: 5,
  0b100000: 6,
  0b1000000: 7,
  0b10000000: 8,
  0b100000000: 9,
} as const;

export const SudokuValueFlagSet = new Set<number>(
  Object.values(SudokuValueFlags)
);

export const SudokuAllValueFlags = 0b111111111;

export function isSudokuValueFlag(
  value: number
): value is keyof typeof SudokuValueFlagsValues {
  return value in SudokuValueFlagsValues;
}

export interface SudokuSubGrid {
  get(index: number): number;
  set(index: number, value: number): this;

  readonly indices: number[];
}

export interface SudokuChecker {
  isValid: boolean;
  isComplete: boolean;
  missingValues: number[];
  missingIndices: number[];
  missingCount: number;
}
