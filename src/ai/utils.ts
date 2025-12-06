import type SudokuArray from "../engine/SudokuArray";
import type { SudokuSubGrid } from "../engine/types";

export function getPossibleValuesAtIndex(
  sudoku: SudokuArray,
  index: number
): number[] {
  if (index < 0 || index > 80 || sudoku.get(index) !== 0) {
    return [];
  }

  const rowIndex = Math.floor(index / 9);
  const colIndex = index % 9;
  const squareIndex = Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3);

  return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((value) => {
    return (
      sudoku.row(rowIndex).missingValues.includes(value) &&
      sudoku.column(colIndex).missingValues.includes(value) &&
      sudoku.square(squareIndex).missingValues.includes(value)
    );
  });
}

export function getAllPossibleValues(
  sudoku: SudokuArray
): [number, number[]][] {
  const allPossibleValues: [number, number[]][] = [];

  Array.from({ length: 81 }).forEach((_, index) => {
    const possibleValues = getPossibleValuesAtIndex(sudoku, index);
    if (possibleValues.length > 0) {
      allPossibleValues.push([index, possibleValues]);
    }
  });

  return allPossibleValues.sort((a, b) => a[1].length - b[1].length);
}

export function getSinglePossibilities(
  possibilities: [number, number[]][]
): [number, number][] {
  const playable: [number, number][] = [];

  for (const [index, values] of possibilities) {
    if (values.length === 1) {
      playable.push([index, values[0]]);
    }
  }

  return playable;
}

export function playSinglePossibilities(
  sudoku: SudokuArray,
  possibilities: [number, number[]][],
  playFunction?: (index: number, value: number) => void
): number {
  const play =
    playFunction ??
    ((index: number, value: number) => sudoku.set(index, value));
  const singlePossibilities = getSinglePossibilities(possibilities);

  singlePossibilities.forEach(([index, value]) => {
    play(index, value);
  });

  return singlePossibilities.length;
}

export function getUniqueSubGridPossibility(
  subgrid: SudokuSubGrid,
  possibleValueMap: Map<number, number[]>,
  index: number
): number | undefined {
  let value = [...(possibleValueMap.get(index) || [])];
  const indices = subgrid.indices;
  for (const i of indices) {
    if (i === index) {
      continue;
    }

    const otherValues = possibleValueMap.get(i);
    if (!otherValues) {
      continue;
    }

    value = value.filter((v) => !otherValues.includes(v));
    if (value.length === 0) {
      return undefined;
    }
  }

  if (value.length === 1) {
    return value[0];
  }

  return undefined;
}

export function getUniquePossibility(
  sudoku: SudokuArray,
  possibleValueMap: Map<number, number[]>,
  index: number
): number | undefined {
  const rowIndex = Math.floor(index / 9);
  const colIndex = index % 9;
  const squareIndex = Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3);

  return (
    getUniqueSubGridPossibility(
      sudoku.row(rowIndex),
      possibleValueMap,
      index
    ) ??
    getUniqueSubGridPossibility(
      sudoku.column(colIndex),
      possibleValueMap,
      index
    ) ??
    getUniqueSubGridPossibility(
      sudoku.square(squareIndex),
      possibleValueMap,
      index
    )
  );
}

export function getAllUniquePossibilities(
  sudoku: SudokuArray,
  possibleValueMap: Map<number, number[]>
): [number, number][] {
  const uniquePossibilities: [number, number][] = [];

  Array.from({ length: 81 }).forEach((_, index) => {
    const uniqueValue = getUniquePossibility(sudoku, possibleValueMap, index);
    if (uniqueValue !== undefined) {
      uniquePossibilities.push([index, uniqueValue]);
    }
  });

  return uniquePossibilities;
}

export function playUniquePossibilities(
  sudoku: SudokuArray,
  possibleValueMap: Map<number, number[]>,
  playFunction?: (index: number, value: number) => void
): number {
  let played = 0;

  const play =
    playFunction ??
    ((index: number, value: number) => sudoku.set(index, value));

  for (const [index] of possibleValueMap) {
    const uniqueValue = getUniquePossibility(sudoku, possibleValueMap, index);
    if (uniqueValue !== undefined) {
      play(index, uniqueValue);
      played++;
    }
  }

  return played;
}
