import { beforeEach, describe, expect, it } from "vitest";
import SudokuArray from "./SudokuArray";
import SudokuRow from "./SudokuRow";

describe("SudokuRow", () => {
  let sudokuArray: SudokuArray;
  let sudokuRow: SudokuRow;

  beforeEach(() => {
    sudokuArray = new SudokuArray();
    sudokuArray.fill(Array(81).fill(0));
    sudokuRow = new SudokuRow(sudokuArray, 0);
  });

  describe("constructor", () => {
    it("should create a SudokuRow with the correct sudokuArray and rowIndex", () => {
      expect(sudokuRow.sudokuArray).toBe(sudokuArray);
      expect(sudokuRow.rowIndex).toBe(0);
    });

    it("should create rows for different indices", () => {
      const row1 = new SudokuRow(sudokuArray, 1);
      const row8 = new SudokuRow(sudokuArray, 8);

      expect(row1.rowIndex).toBe(1);
      expect(row8.rowIndex).toBe(8);
    });
  });

  describe("get and set", () => {
    it("should get values correctly from the row", () => {
      sudokuArray.fill([
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(sudokuRow.get(0)).toBe(1);
      expect(sudokuRow.get(4)).toBe(5);
      expect(sudokuRow.get(8)).toBe(9);

      const row1 = new SudokuRow(sudokuArray, 1);
      expect(row1.get(0)).toBe(4);
      expect(row1.get(4)).toBe(8);
      expect(row1.get(8)).toBe(3);
    });

    it("should set values correctly in the row", () => {
      sudokuRow.set(0, 5);
      expect(sudokuRow.get(0)).toBe(5);
      expect(sudokuArray.at({ row: 0, col: 0 })).toBe(5);

      sudokuRow.set(8, 9);
      expect(sudokuRow.get(8)).toBe(9);
      expect(sudokuArray.at({ row: 0, col: 8 })).toBe(9);
    });

    it("should return this for method chaining on set", () => {
      const result = sudokuRow.set(0, 1);
      expect(result).toBe(sudokuRow);

      // Test chaining
      sudokuRow.set(0, 1).set(1, 2).set(2, 3);
      expect(sudokuRow.get(0)).toBe(1);
      expect(sudokuRow.get(1)).toBe(2);
      expect(sudokuRow.get(2)).toBe(3);
    });

    it("should work correctly for different rows", () => {
      const row5 = new SudokuRow(sudokuArray, 5);
      row5.set(3, 7);
      expect(row5.get(3)).toBe(7);
      expect(sudokuArray.at({ row: 5, col: 3 })).toBe(7);
      expect(sudokuArray.get(5 * 9 + 3)).toBe(7);
    });
  });

  describe("indices", () => {
    it("should return correct indices for row 0", () => {
      expect(sudokuRow.indices).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it("should return correct indices for row 1", () => {
      const row1 = new SudokuRow(sudokuArray, 1);
      expect(row1.indices).toEqual([9, 10, 11, 12, 13, 14, 15, 16, 17]);
    });

    it("should return correct indices for row 8", () => {
      const row8 = new SudokuRow(sudokuArray, 8);
      expect(row8.indices).toEqual([72, 73, 74, 75, 76, 77, 78, 79, 80]);
    });

    it("should return correct indices for middle rows", () => {
      const row4 = new SudokuRow(sudokuArray, 4);
      expect(row4.indices).toEqual([36, 37, 38, 39, 40, 41, 42, 43, 44]);
    });
  });

  describe("isValid", () => {
    it("should return false for an empty row", () => {
      expect(sudokuRow.isValid).toBe(false);
    });

    it("should return true for a valid complete row", () => {
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

      expect(sudokuRow.isValid).toBe(true);
    });

    it("should return false for a row with duplicates", () => {
      sudokuArray.fill([
        [1, 2, 3, 4, 5, 6, 7, 8, 1], // Duplicate 1
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(sudokuRow.isValid).toBe(false);
    });

    it("should return false for a partially filled row (not complete)", () => {
      sudokuArray.fill([
        [1, 2, 3, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(sudokuRow.isValid).toBe(false);
    });

    it("should work correctly for different rows", () => {
      sudokuArray.fill([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [6, 4, 8, 9, 3, 7, 5, 1, 2],
      ]);

      expect(sudokuRow.isValid).toBe(false);

      const row1 = new SudokuRow(sudokuArray, 1);
      expect(row1.isValid).toBe(true);

      const row8 = new SudokuRow(sudokuArray, 8);
      expect(row8.isValid).toBe(true);
    });
  });

  describe("isComplete", () => {
    it("should return false for an empty row", () => {
      expect(sudokuRow.isComplete).toBe(false);
    });

    it("should return true for a complete row", () => {
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

      expect(sudokuRow.isComplete).toBe(true);
    });

    it("should return false for a partially filled row", () => {
      sudokuArray.fill([
        [1, 2, 3, 4, 5, 6, 7, 8, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(sudokuRow.isComplete).toBe(false);
    });

    it("should return true even if row has duplicates (only checks completeness)", () => {
      sudokuArray.fill([
        [1, 2, 3, 4, 5, 6, 7, 8, 1], // Duplicate 1
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(sudokuRow.isComplete).toBe(true);
    });

    it("should work correctly for different rows", () => {
      sudokuArray.fill([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 0, 6, 7, 8, 9],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(sudokuRow.isComplete).toBe(false);

      const row1 = new SudokuRow(sudokuArray, 1);
      expect(row1.isComplete).toBe(true);

      const row2 = new SudokuRow(sudokuArray, 2);
      expect(row2.isComplete).toBe(false);
    });
  });

  describe("missingValues", () => {
    it("should return all values for an empty row", () => {
      expect(sudokuRow.missingValues.sort()).toEqual([
        1, 2, 3, 4, 5, 6, 7, 8, 9,
      ]);
    });

    it("should return no values for a complete row", () => {
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

      expect(sudokuRow.missingValues).toEqual([]);
    });

    it("should return correct missing values for a partially filled row", () => {
      sudokuArray.fill([
        [1, 2, 3, 4, 5, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(sudokuRow.missingValues.sort()).toEqual([6, 7, 8, 9]);
    });

    it("should return only one missing value when row is almost complete", () => {
      sudokuArray.fill([
        [1, 2, 3, 4, 5, 6, 7, 8, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(sudokuRow.missingValues).toEqual([9]);
    });

    it("should work correctly for different rows", () => {
      sudokuArray.fill([
        [1, 2, 3, 0, 0, 0, 0, 0, 0],
        [4, 5, 6, 7, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      const row1 = new SudokuRow(sudokuArray, 1);
      expect(row1.missingValues.sort()).toEqual([1, 2, 3, 8, 9]);
    });
  });

  describe("missingIndices", () => {
    it("should return all indices for an empty row", () => {
      expect(sudokuRow.missingIndices).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it("should return no indices for a complete row", () => {
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

      expect(sudokuRow.missingIndices).toEqual([]);
    });

    it("should return correct missing indices for a partially filled row", () => {
      sudokuArray.fill([
        [1, 2, 3, 4, 5, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(sudokuRow.missingIndices).toEqual([5, 6, 7, 8]);
    });

    it("should handle scattered missing cells", () => {
      sudokuArray.fill([
        [1, 0, 3, 0, 5, 0, 7, 0, 9],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(sudokuRow.missingIndices).toEqual([1, 3, 5, 7]);
    });

    it("should work correctly for different rows", () => {
      sudokuArray.fill([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [4, 5, 6, 7, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      const row1 = new SudokuRow(sudokuArray, 1);
      expect(row1.missingIndices).toEqual([13, 14, 15, 16, 17]);
    });
  });

  describe("missingCount", () => {
    it("should return 9 for an empty row", () => {
      expect(sudokuRow.missingCount).toBe(9);
    });

    it("should return 0 for a complete row", () => {
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

      expect(sudokuRow.missingCount).toBe(0);
    });

    it("should return correct count for a partially filled row", () => {
      sudokuArray.fill([
        [1, 2, 3, 4, 5, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(sudokuRow.missingCount).toBe(4);
    });

    it("should return 1 when row has only one missing value", () => {
      sudokuArray.fill([
        [1, 2, 3, 4, 5, 6, 7, 8, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(sudokuRow.missingCount).toBe(1);
    });

    it("should handle invalid values as missing", () => {
      sudokuArray.fill([
        [1, 2, 3, 4, -5, 6, 7, 8, 10],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(sudokuRow.missingCount).toBe(2);
    });

    it("should work correctly for different rows", () => {
      sudokuArray.fill([
        [1, 2, 3, 0, 0, 0, 0, 0, 0],
        [4, 5, 6, 7, 0, 0, 0, 0, 0],
        [7, 8, 9, 1, 2, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(sudokuRow.missingCount).toBe(6);

      const row1 = new SudokuRow(sudokuArray, 1);
      expect(row1.missingCount).toBe(5);

      const row2 = new SudokuRow(sudokuArray, 2);
      expect(row2.missingCount).toBe(4);
    });
  });
});
