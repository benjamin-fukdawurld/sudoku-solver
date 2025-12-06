import { beforeEach, describe, expect, it, vi } from "vitest";
import PossibilityMap from "./PossibilityMap";
import SudokuArray from "../SudokuArray";
import { SudokuValueFlags } from "../types";

describe("PossibilityMap", () => {
  let sudokuArray: SudokuArray;
  let possibilityMap: PossibilityMap;

  beforeEach(() => {
    sudokuArray = new SudokuArray();
    sudokuArray.fill(Array(81).fill(0));
    possibilityMap = new PossibilityMap(sudokuArray);
  });

  describe("constructor and update", () => {
    it("should initialize possibilities, singlePossibilities, and uniquePossibilities accordingly for empty grid", () => {
      for (let i = 0; i < 81; i++) {
        expect(possibilityMap.possibilities[i]).toBe(0b111111111);
        expect(possibilityMap.singlePossibilities[i]).toBe(0);
        expect(possibilityMap.uniquePossibilities[i]).toBe(0);
      }
    });

    it("should update possibilities, singlePossibilities, and uniquePossibilities accordingly for resolved grid", () => {
      sudokuArray.fill([
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 7, 1, 3, 6, 4, 8, 9, 5],
        [8, 3, 5, 2, 9, 1, 6, 4, 7],
        [9, 6, 4, 5, 7, 8, 2, 3, 1],
        [3, 1, 2, 6, 4, 5, 9, 7, 8],
        [5, 9, 7, 8, 1, 2, 3, 6, 4],
        [6, 4, 8, 9, 3, 7, 5, 1, 2],
      ]);
      possibilityMap.update();
      for (let i = 0; i < 81; i++) {
        expect(possibilityMap.possibilities[i]).toBe(0);
        expect(possibilityMap.singlePossibilities[i]).toBe(0);
        expect(possibilityMap.uniquePossibilities[i]).toBe(0);
      }
    });

    it("should update possibilities, singlePossibilities, and uniquePossibilities accordingly for partially filled grid", () => {
      sudokuArray.fill([
        [0, 2, 3, 4, 5, 6, 7, 0, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 0, 9, 1, 2, 3, 4, 5, 6],
        [2, 7, 1, 3, 6, 4, 8, 9, 5],
        [0, 3, 5, 2, 9, 1, 6, 4, 7],
        [9, 6, 4, 5, 7, 8, 2, 3, 1],
        [3, 0, 2, 6, 4, 5, 9, 7, 8],
        [5, 9, 7, 8, 1, 2, 3, 6, 4],
        [6, 4, 8, 9, 3, 7, 5, 1, 2],
      ]);
      possibilityMap.update();
      expect(possibilityMap.possibilities[0]).toBe(
        SudokuValueFlags[1] | SudokuValueFlags[8]
      );
      expect(possibilityMap.singlePossibilities[0]).toBe(0);
      expect(possibilityMap.uniquePossibilities[0]).toBe(SudokuValueFlags[1]);

      expect(possibilityMap.possibilities[7]).toBe(SudokuValueFlags[8]);
      expect(possibilityMap.singlePossibilities[7]).toBe(SudokuValueFlags[8]);
    });
  });

  describe("sudoku property", () => {
    it("should get and set the sudoku property correctly", () => {
      const newSudokuArray = new SudokuArray();
      possibilityMap.sudoku = newSudokuArray;
      expect(possibilityMap.sudoku).toBe(newSudokuArray);
    });

    it("should update possibilities when sudoku property is set", () => {
      const spy = vi.spyOn(possibilityMap, "update");
      const newSudokuArray = new SudokuArray();
      newSudokuArray.fill([
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 7, 1, 3, 6, 4, 8, 9, 5],
        [8, 3, 5, 2, 9, 1, 6, 4, 7],
        [9, 6, 4, 5, 7, 8, 2, 3, 1],
        [3, 1, 2, 6, 4, 5, 9, 7, 8],
        [5, 9, 7, 8, 1, 2, 3, 6, 4],
        [6, 4, 8, 9, 3, 7, 5, 1, 2],
      ]);
      possibilityMap.sudoku = newSudokuArray;
      expect(spy).toHaveBeenCalled();
    });
  });

  describe("possibility getters", () => {
    it("should get possible values at a given index", () => {
      sudokuArray.fill([
        [0, 2, 3, 4, 5, 6, 7, 0, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 0, 9, 1, 2, 3, 4, 5, 6],
        [2, 7, 1, 3, 6, 4, 8, 9, 5],
        [0, 3, 5, 2, 9, 1, 6, 4, 7],
        [9, 6, 4, 5, 7, 8, 2, 3, 1],
        [3, 0, 2, 6, 4, 5, 9, 7, 8],
        [5, 9, 7, 8, 1, 2, 3, 6, 4],
        [6, 4, 8, 9, 3, 7, 5, 1, 2],
      ]);
      possibilityMap.update();
      expect(possibilityMap.getPossibleValuesAt(0)).toEqual([1, 8]);
      expect(possibilityMap.getSinglePossibleValueAt(0)).toBe(0);
      expect(possibilityMap.getUniquePossibleValueAt(0)).toBe(1);

      expect(possibilityMap.getPossibleValuesAt(7)).toEqual([8]);
      expect(possibilityMap.getSinglePossibleValueAt(7)).toBe(8);
      expect(possibilityMap.getUniquePossibleValueAt(1)).toBe(0);
    });
  });

  describe("updateIndexPossibilities", () => {
    it("should update possibilities, singlePossibilities, and uniquePossibilities for the affected indices when a cell is played", () => {
      sudokuArray.fill([
        [0, 2, 3, 4, 5, 6, 7, 0, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 0, 9, 1, 2, 3, 4, 5, 6],
        [2, 7, 1, 3, 6, 4, 8, 9, 5],
        [0, 3, 5, 2, 9, 1, 6, 4, 7],
        [9, 6, 4, 5, 7, 8, 2, 3, 1],
        [3, 0, 2, 6, 4, 5, 9, 7, 8],
        [5, 9, 7, 8, 1, 2, 3, 6, 4],
        [6, 4, 8, 9, 3, 7, 5, 1, 2],
      ]);

      possibilityMap.update();

      // Play a value at index 0 (row 0, col 0)
      sudokuArray.set(7, 8);
      possibilityMap.updateIndexPossibilities(7);
      console.log(possibilityMap.possibilities[0]);
      expect(possibilityMap.getPossibleValuesAt(0)).toEqual([1]);
      expect(possibilityMap.getSinglePossibleValueAt(0)).toBe(1);
      expect(possibilityMap.getUniquePossibleValueAt(0)).toBe(1);

      expect(possibilityMap.getPossibleValuesAt(7)).toEqual([]);
      expect(possibilityMap.getSinglePossibleValueAt(7)).toBe(0);
      expect(possibilityMap.getUniquePossibleValueAt(7)).toBe(0);

      sudokuArray.set(7, 0);
      possibilityMap.updateIndexPossibilities(7);
      expect(possibilityMap.getPossibleValuesAt(0)).toEqual([1, 8]);
      expect(possibilityMap.getSinglePossibleValueAt(0)).toBe(0);
      expect(possibilityMap.getUniquePossibleValueAt(0)).toBe(1);

      expect(possibilityMap.getPossibleValuesAt(7)).toEqual([8]);
      expect(possibilityMap.getSinglePossibleValueAt(7)).toBe(8);
      expect(possibilityMap.getUniquePossibleValueAt(1)).toBe(0);
    });
  });
});

/*
export default class PossibilityMap {
  getPossibleValuesAt(index: number): number[] {
    const flags = this.possibilities[index];
    return possibleValuesToArray(flags);
  }

  setPossibleValuesAt(index: number, values: number[]) {
    let flags = 0;
    for (const value of values) {
      if (value < 1 || value > 9) {
        continue;
      }
      flags |= 1 << (value - 1);
    }
    this.possibilities[index] = flags;
  }

  getSinglePossibleValueAt(index: number): number {
    const flag = this.singlePossibilities[index];
    return flag
      ? SudokuValueFlagsValues[flag as keyof typeof SudokuValueFlagsValues]
      : 0;
  }

  getUniquePossibleValueAt(index: number): number {
    const flag = this.uniquePossibilities[index];
    return flag
      ? SudokuValueFlagsValues[flag as keyof typeof SudokuValueFlagsValues]
      : 0;
  }

  onPlayed(index: number) {
    this.updateIndexPossibilities(index);
  }

  private updateUniqueAndSinglePossibilities(indices: Iterable<number>) {
    const possibilities = this.possibilities;
    const singlePossibilities = this.singlePossibilities;
    const uniquePossibilities = this.uniquePossibilities;

    for (const i of indices) {
      const value = this.sudoku.get(i);
      if (value >= 1 && value <= 9) {
        possibilities[i] = 0;
        singlePossibilities[i] = 0;
        uniquePossibilities[i] = 0;
        continue;
      }

      if (SudokuValueFlagSet.has(possibilities[i])) {
        singlePossibilities[i] = possibilities[i];
      } else {
        singlePossibilities[i] = 0;
      }

      const { row, col } = sudokuIndexToRowCol(i);
      const squareIndex = getSquareIndex(row, col);

      uniquePossibilities[i] =
        getIndexUniquePossibilities(i, possibilities, rowIndexGenerator(row)) |
        getIndexUniquePossibilities(i, possibilities, colIndexGenerator(col)) |
        getIndexUniquePossibilities(
          i,
          possibilities,
          squareIndexGenerator(squareIndex)
        );
    }
  }

  private updateIndexPossibilities(index: number) {
    const { row, col } = sudokuIndexToRowCol(index);
    const squareIndex = getSquareIndex(row, col);
    const possibilities = this.possibilities;

    const indices = new Set<number>([
      ...rowIndexGenerator(row),
      ...colIndexGenerator(col),
      ...squareIndexGenerator(squareIndex),
    ]);

    const value = this.sudoku.get(index);
    const flag = value
      ? SudokuValueFlags[value as keyof typeof SudokuValueFlags]
      : 0;
    for (const i of indices) {
      possibilities[i] = value
        ? possibilities[i] & ~flag
        : getIndexPossibilities(this._sudoku, i);
    }

    this.updateUniqueAndSinglePossibilities(indices);
  }
}
*/
