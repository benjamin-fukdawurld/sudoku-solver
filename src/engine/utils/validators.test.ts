import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import SudokuArray from "../SudokuArray";
import { rowIndexGenerator, squareIndexGenerator } from "./index-iterators";
import {
  isIncomplete,
  isInvalid,
  isSolved,
  isSubGridIncomplete,
  isSubGridInvalid,
  isSubGridSolved,
} from "./validators";

describe("validators", () => {
  let sudokuArray: SudokuArray;

  beforeAll(() => {
    sudokuArray = new SudokuArray();
  });

  beforeEach(() => {
    sudokuArray.fill([
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);
  });

  describe("isSubGridInvalid", () => {
    it("should return true for an empty sudoku", () => {
      expect(isSubGridInvalid(sudokuArray, rowIndexGenerator(0))).toBe(true);
    });

    it("should return false for a valid sub-grid", () => {
      sudokuArray.fill([
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
      expect(isSubGridInvalid(sudokuArray, rowIndexGenerator(0))).toBe(false);
      sudokuArray.fill([
        [1, 2, 3, 0, 0, 0, 0, 0, 0],
        [4, 5, 6, 0, 0, 0, 0, 0, 0],
        [7, 8, 9, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);
      expect(isSubGridInvalid(sudokuArray, squareIndexGenerator(0))).toBe(
        false
      );
    });

    it("should return true for an invalid sub-grid", () => {
      sudokuArray.fill([
        [1, 2, 3, 4, 5, 6, 7, 8, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);
      expect(isSubGridInvalid(sudokuArray, rowIndexGenerator(0))).toBe(true);

      sudokuArray.set(0, 0);
      expect(isSubGridInvalid(sudokuArray, rowIndexGenerator(0))).toBe(true);
      sudokuArray.set(0, 10);
      expect(isSubGridInvalid(sudokuArray, rowIndexGenerator(0))).toBe(true);
      sudokuArray.set(0, -1);
      expect(isSubGridInvalid(sudokuArray, rowIndexGenerator(0))).toBe(true);
    });
  });

  describe("isSubGridSolved", () => {
    it("should return false for an empty sudoku", () => {
      expect(isSubGridSolved(sudokuArray, rowIndexGenerator(0))).toBe(false);
    });

    it("should return true for a valid sub-grid", () => {
      sudokuArray.fill([
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
      expect(isSubGridSolved(sudokuArray, rowIndexGenerator(0))).toBe(true);
      sudokuArray.fill([
        [1, 2, 3, 0, 0, 0, 0, 0, 0],
        [4, 5, 6, 0, 0, 0, 0, 0, 0],
        [7, 8, 9, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);
      expect(isSubGridSolved(sudokuArray, squareIndexGenerator(0))).toBe(true);
    });

    it("should return false for an invalid sub-grid", () => {
      sudokuArray.fill([
        [1, 2, 3, 4, 5, 6, 7, 8, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);
      expect(isSubGridSolved(sudokuArray, rowIndexGenerator(0))).toBe(false);

      sudokuArray.set(0, 0);
      expect(isSubGridSolved(sudokuArray, rowIndexGenerator(0))).toBe(false);
      sudokuArray.set(0, 10);
      expect(isSubGridSolved(sudokuArray, rowIndexGenerator(0))).toBe(false);
      sudokuArray.set(0, -1);
      expect(isSubGridSolved(sudokuArray, rowIndexGenerator(0))).toBe(false);
    });
  });

  describe("isSubGridSolved", () => {
    it("should return false for an empty sudoku", () => {
      expect(isSubGridSolved(sudokuArray, rowIndexGenerator(0))).toBe(false);
    });

    it("should return true for a valid sub-grid", () => {
      sudokuArray.fill([
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
      expect(isSubGridSolved(sudokuArray, rowIndexGenerator(0))).toBe(true);
      sudokuArray.fill([
        [1, 2, 3, 0, 0, 0, 0, 0, 0],
        [4, 5, 6, 0, 0, 0, 0, 0, 0],
        [7, 8, 9, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);
      expect(isSubGridSolved(sudokuArray, squareIndexGenerator(0))).toBe(true);
    });

    it("should return false for an invalid sub-grid", () => {
      sudokuArray.fill([
        [1, 2, 3, 4, 5, 6, 7, 8, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);
      expect(isSubGridSolved(sudokuArray, rowIndexGenerator(0))).toBe(false);

      sudokuArray.set(0, 0);
      expect(isSubGridSolved(sudokuArray, rowIndexGenerator(0))).toBe(false);
      sudokuArray.set(0, 10);
      expect(isSubGridSolved(sudokuArray, rowIndexGenerator(0))).toBe(false);
      sudokuArray.set(0, -1);
      expect(isSubGridSolved(sudokuArray, rowIndexGenerator(0))).toBe(false);
    });
  });

  describe("isSubGridIncomplete", () => {
    it("should return true for an empty sudoku", () => {
      expect(isSubGridIncomplete(sudokuArray, rowIndexGenerator(0))).toBe(true);
    });

    it("should return false for a complete sub-grid", () => {
      sudokuArray.fill([
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
      expect(isSubGridIncomplete(sudokuArray, rowIndexGenerator(0))).toBe(
        false
      );
    });

    it("should return true for an incomplete sub-grid", () => {
      sudokuArray.fill([
        [0, 2, 3, 4, 5, 6, 7, 8, 9],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(isSubGridIncomplete(sudokuArray, rowIndexGenerator(0))).toBe(true);
      sudokuArray.set(0, -1);
      expect(isSubGridIncomplete(sudokuArray, rowIndexGenerator(0))).toBe(true);
      sudokuArray.set(0, 10);
      expect(isSubGridIncomplete(sudokuArray, rowIndexGenerator(0))).toBe(true);
    });
  });

  describe("isInvalid", () => {
    it("should return true for an empty sudoku", () => {
      expect(isInvalid(sudokuArray)).toBe(true);
    });

    it("should return true for an invalid sudoku", () => {
      sudokuArray.fill([
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
      expect(isInvalid(sudokuArray)).toBe(true);
      sudokuArray.fill([
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
      ]);
      expect(isInvalid(sudokuArray)).toBe(true);

      sudokuArray.fill([
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 7, 1, 3, 6, 4, 8, 9, 5],
        [8, 3, 5, 2, 9, 1, 6, 4, 7],
        [9, 6, 4, 5, 7, 8, 2, 3, 1],
        [3, 1, 2, 6, 4, 5, 9, 7, 8],
        [5, 9, 7, 8, 1, 2, 3, 6, 4],
        [1, 4, 8, 9, 3, 7, 5, 1, 2],
      ]);
      expect(isInvalid(sudokuArray)).toBe(true);

      sudokuArray.set(72, 0);
      expect(isInvalid(sudokuArray)).toBe(true);

      sudokuArray.set(72, -1);
      expect(isInvalid(sudokuArray)).toBe(true);

      sudokuArray.set(72, 10);
      expect(isInvalid(sudokuArray)).toBe(true);
    });

    it("should return false for a valid sudoku", () => {
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

      expect(isInvalid(sudokuArray)).toBe(false);
    });
  });

  describe("isSolved", () => {
    it("should return false for an empty sudoku", () => {
      expect(isSolved(sudokuArray)).toBe(false);
    });

    it("should return false for an invalid sudoku", () => {
      sudokuArray.fill([
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
      expect(isSolved(sudokuArray)).toBe(false);
      sudokuArray.fill([
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
      ]);
      expect(isSolved(sudokuArray)).toBe(false);

      sudokuArray.fill([
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 7, 1, 3, 6, 4, 8, 9, 5],
        [8, 3, 5, 2, 9, 1, 6, 4, 7],
        [9, 6, 4, 5, 7, 8, 2, 3, 1],
        [3, 1, 2, 6, 4, 5, 9, 7, 8],
        [5, 9, 7, 8, 1, 2, 3, 6, 4],
        [1, 4, 8, 9, 3, 7, 5, 1, 2],
      ]);
      expect(isSolved(sudokuArray)).toBe(false);

      sudokuArray.set(72, 0);
      expect(isSolved(sudokuArray)).toBe(false);

      sudokuArray.set(72, -1);
      expect(isSolved(sudokuArray)).toBe(false);

      sudokuArray.set(72, 10);
      expect(isSolved(sudokuArray)).toBe(false);
    });

    it("should return true for a valid sudoku", () => {
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

      expect(isSolved(sudokuArray)).toBe(true);
    });
  });

  describe("isIncomplete", () => {
    it("should return true for an empty sudoku", () => {
      expect(isIncomplete(sudokuArray)).toBe(true);
    });

    it("should return true for an incomplete sudoku", () => {
      sudokuArray.fill([
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
      expect(isIncomplete(sudokuArray)).toBe(true);

      sudokuArray.fill([
        [-1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
      ]);
      expect(isIncomplete(sudokuArray)).toBe(true);
    });

    it("should return false for a complete sudoku", () => {
      sudokuArray.fill([
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
      ]);
      expect(isIncomplete(sudokuArray)).toBe(false);

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
      expect(isIncomplete(sudokuArray)).toBe(false);
    });
  });
});

/*
export function isIncomplete(sudokuArray: SudokuArray) {
  for (let i = 0; i < 9; i++) {
    if (isSubGridIncomplete(sudokuArray, rowIndexGenerator(i))) {
      return true;
    }
  }

  return false;
}
*/
