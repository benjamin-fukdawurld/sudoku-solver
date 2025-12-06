import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import SudokuArray from "../SudokuArray";
import { missingCount, missingIndices, missingValues } from "./helpers";
import { rowIndexGenerator } from "./index-iterators";

describe("helpers", () => {
  let sudoku: SudokuArray;

  beforeAll(() => {
    sudoku = new SudokuArray();
  });

  beforeEach(() => {
    sudoku.fill(Array(81).fill(0));
  });

  describe("missingValues", () => {
    it("should return all values when sub-grid is empty", () => {
      const missing = missingValues(sudoku, rowIndexGenerator(0));
      expect(missing.sort()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it("should return no values when sub-grid is complete", () => {
      sudoku.fill([
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      const missing = missingValues(sudoku, rowIndexGenerator(0));
      expect(missing).toEqual([]);
    });

    it("should return correct missing values for a partial sub-grid", () => {
      [0, 2, 3, 4, 5, 6, 7, 8, 9].forEach((value, index) => {
        sudoku.set(index, value);
      });
      expect(missingValues(sudoku, rowIndexGenerator(0)).sort()).toEqual([1]);
    });
  });

  describe("missingIndices", () => {
    it("should return all indices when sub-grid is empty", () => {
      expect(missingIndices(sudoku, rowIndexGenerator(0))).toEqual([
        0, 1, 2, 3, 4, 5, 6, 7, 8,
      ]);
    });

    it("should return no indices when sub-grid is complete", () => {
      sudoku.fill([
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(missingIndices(sudoku, rowIndexGenerator(0))).toEqual([]);
    });

    it("should return correct missing indices for a partial sub-grid", () => {
      [0, 2, 3, 4, 5, 6, 7, 8, 9].forEach((value, index) => {
        sudoku.set(index, value);
      });
      expect(missingIndices(sudoku, rowIndexGenerator(0))).toEqual([0]);

      sudoku.set(0, -1);
      expect(missingIndices(sudoku, rowIndexGenerator(0))).toEqual([0]);

      sudoku.set(0, 10);
      expect(missingIndices(sudoku, rowIndexGenerator(0))).toEqual([0]);
    });
  });

  describe("missingCount", () => {
    it("should return 9 when sub-grid is empty", () => {
      expect(missingCount(sudoku, rowIndexGenerator(0))).toBe(9);
    });

    it("should return 0 when sub-grid is complete", () => {
      sudoku.fill([
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(missingCount(sudoku, rowIndexGenerator(0))).toEqual(0);
    });

    it("should return correct missing count for a partial sub-grid", () => {
      [0, 2, 3, 4, 5, 6, 7, 8, 9].forEach((value, index) => {
        sudoku.set(index, value);
      });
      expect(missingCount(sudoku, rowIndexGenerator(0))).toBe(1);

      [0, 2, 0, 4, -5, 6, 7, 8, 9].forEach((value, index) => {
        sudoku.set(index, value);
      });

      expect(missingCount(sudoku, rowIndexGenerator(0))).toBe(3);
    });
  });
});
