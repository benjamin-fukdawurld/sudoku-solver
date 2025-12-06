import { beforeEach, describe, expect, it } from "vitest";
import SudokuArray from "./SudokuArray";
import SudokuColumn from "./SudokuColumn";

describe("SudokuColumn", () => {
  let sudokuArray: SudokuArray;
  let sudokuColumn: SudokuColumn;

  beforeEach(() => {
    sudokuArray = new SudokuArray();
    sudokuArray.fill(Array(81).fill(0));
    sudokuColumn = new SudokuColumn(sudokuArray, 0);
  });

  describe("constructor", () => {
    it("should create a SudokuColumn with the correct sudokuArray and colIndex", () => {
      expect(sudokuColumn.sudokuArray).toBe(sudokuArray);
      expect(sudokuColumn.colIndex).toBe(0);
    });

    it("should create columns for different indices", () => {
      const col1 = new SudokuColumn(sudokuArray, 1);
      const col8 = new SudokuColumn(sudokuArray, 8);

      expect(col1.colIndex).toBe(1);
      expect(col8.colIndex).toBe(8);
    });
  });

  describe("get and set", () => {
    it("should get values correctly from the column", () => {
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

      expect(sudokuColumn.get(0)).toBe(1);
      expect(sudokuColumn.get(4)).toBe(8);
      expect(sudokuColumn.get(8)).toBe(6);

      const col1 = new SudokuColumn(sudokuArray, 1);
      expect(col1.get(0)).toBe(2);
      expect(col1.get(4)).toBe(3);
      expect(col1.get(8)).toBe(4);
    });

    it("should set values correctly in the column", () => {
      sudokuColumn.set(0, 5);
      expect(sudokuColumn.get(0)).toBe(5);
      expect(sudokuArray.at({ row: 0, col: 0 })).toBe(5);

      sudokuColumn.set(8, 9);
      expect(sudokuColumn.get(8)).toBe(9);
      expect(sudokuArray.at({ row: 8, col: 0 })).toBe(9);
    });

    it("should return this for method chaining on set", () => {
      const result = sudokuColumn.set(0, 1);
      expect(result).toBe(sudokuColumn);

      // Test chaining
      sudokuColumn.set(0, 1).set(1, 2).set(2, 3);
      expect(sudokuColumn.get(0)).toBe(1);
      expect(sudokuColumn.get(1)).toBe(2);
      expect(sudokuColumn.get(2)).toBe(3);
    });

    it("should work correctly for different columns", () => {
      const col5 = new SudokuColumn(sudokuArray, 5);
      col5.set(3, 7);
      expect(col5.get(3)).toBe(7);
      expect(sudokuArray.at({ row: 3, col: 5 })).toBe(7);
      expect(sudokuArray.get(3 * 9 + 5)).toBe(7);
    });
  });

  describe("indices", () => {
    it("should return correct indices for column 0", () => {
      expect(sudokuColumn.indices).toEqual([0, 9, 18, 27, 36, 45, 54, 63, 72]);
    });

    it("should return correct indices for column 1", () => {
      const col1 = new SudokuColumn(sudokuArray, 1);
      expect(col1.indices).toEqual([1, 10, 19, 28, 37, 46, 55, 64, 73]);
    });

    it("should return correct indices for column 8", () => {
      const col8 = new SudokuColumn(sudokuArray, 8);
      expect(col8.indices).toEqual([8, 17, 26, 35, 44, 53, 62, 71, 80]);
    });

    it("should return correct indices for middle columns", () => {
      const col4 = new SudokuColumn(sudokuArray, 4);
      expect(col4.indices).toEqual([4, 13, 22, 31, 40, 49, 58, 67, 76]);
    });
  });

  describe("isValid", () => {
    it("should return false for an empty column", () => {
      expect(sudokuColumn.isValid).toBe(false);
    });

    it("should return true for a valid complete column", () => {
      sudokuArray.fill([
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [4, 0, 0, 0, 0, 0, 0, 0, 0],
        [7, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0, 0, 0],
        [8, 0, 0, 0, 0, 0, 0, 0, 0],
        [9, 0, 0, 0, 0, 0, 0, 0, 0],
        [3, 0, 0, 0, 0, 0, 0, 0, 0],
        [5, 0, 0, 0, 0, 0, 0, 0, 0],
        [6, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(sudokuColumn.isValid).toBe(true);
    });

    it("should return false for a column with duplicates", () => {
      sudokuArray.fill([
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0, 0, 0],
        [3, 0, 0, 0, 0, 0, 0, 0, 0],
        [4, 0, 0, 0, 0, 0, 0, 0, 0],
        [5, 0, 0, 0, 0, 0, 0, 0, 0],
        [6, 0, 0, 0, 0, 0, 0, 0, 0],
        [7, 0, 0, 0, 0, 0, 0, 0, 0],
        [8, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0], // Duplicate 1
      ]);

      expect(sudokuColumn.isValid).toBe(false);
    });

    it("should return false for a partially filled column (not complete)", () => {
      sudokuArray.fill([
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0, 0, 0],
        [3, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(sudokuColumn.isValid).toBe(false);
    });

    it("should work correctly for different columns", () => {
      sudokuArray.fill([
        [0, 1, 0, 0, 0, 0, 0, 0, 6],
        [0, 4, 0, 0, 0, 0, 0, 0, 4],
        [0, 7, 0, 0, 0, 0, 0, 0, 8],
        [0, 2, 0, 0, 0, 0, 0, 0, 9],
        [0, 8, 0, 0, 0, 0, 0, 0, 3],
        [0, 9, 0, 0, 0, 0, 0, 0, 7],
        [0, 3, 0, 0, 0, 0, 0, 0, 5],
        [0, 5, 0, 0, 0, 0, 0, 0, 1],
        [0, 6, 0, 0, 0, 0, 0, 0, 2],
      ]);

      expect(sudokuColumn.isValid).toBe(false);

      const col1 = new SudokuColumn(sudokuArray, 1);
      expect(col1.isValid).toBe(true);

      const col8 = new SudokuColumn(sudokuArray, 8);
      expect(col8.isValid).toBe(true);
    });
  });

  describe("isComplete", () => {
    it("should return false for an empty column", () => {
      expect(sudokuColumn.isComplete).toBe(false);
    });

    it("should return true for a complete column", () => {
      sudokuArray.fill([
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0, 0, 0],
        [3, 0, 0, 0, 0, 0, 0, 0, 0],
        [4, 0, 0, 0, 0, 0, 0, 0, 0],
        [5, 0, 0, 0, 0, 0, 0, 0, 0],
        [6, 0, 0, 0, 0, 0, 0, 0, 0],
        [7, 0, 0, 0, 0, 0, 0, 0, 0],
        [8, 0, 0, 0, 0, 0, 0, 0, 0],
        [9, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(sudokuColumn.isComplete).toBe(true);
    });

    it("should return false for a partially filled column", () => {
      sudokuArray.fill([
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0, 0, 0],
        [3, 0, 0, 0, 0, 0, 0, 0, 0],
        [4, 0, 0, 0, 0, 0, 0, 0, 0],
        [5, 0, 0, 0, 0, 0, 0, 0, 0],
        [6, 0, 0, 0, 0, 0, 0, 0, 0],
        [7, 0, 0, 0, 0, 0, 0, 0, 0],
        [8, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(sudokuColumn.isComplete).toBe(false);
    });

    it("should return true even if column has duplicates (only checks completeness)", () => {
      sudokuArray.fill([
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0, 0, 0],
        [3, 0, 0, 0, 0, 0, 0, 0, 0],
        [4, 0, 0, 0, 0, 0, 0, 0, 0],
        [5, 0, 0, 0, 0, 0, 0, 0, 0],
        [6, 0, 0, 0, 0, 0, 0, 0, 0],
        [7, 0, 0, 0, 0, 0, 0, 0, 0],
        [8, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0], // Duplicate 1
      ]);

      expect(sudokuColumn.isComplete).toBe(true);
    });

    it("should work correctly for different columns", () => {
      sudokuArray.fill([
        [0, 1, 2, 0, 0, 0, 0, 0, 0],
        [0, 2, 3, 0, 0, 0, 0, 0, 0],
        [0, 3, 4, 0, 0, 0, 0, 0, 0],
        [0, 4, 5, 0, 0, 0, 0, 0, 0],
        [0, 5, 6, 0, 0, 0, 0, 0, 0],
        [0, 6, 7, 0, 0, 0, 0, 0, 0],
        [0, 7, 8, 0, 0, 0, 0, 0, 0],
        [0, 8, 9, 0, 0, 0, 0, 0, 0],
        [0, 9, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(sudokuColumn.isComplete).toBe(false);

      const col1 = new SudokuColumn(sudokuArray, 1);
      expect(col1.isComplete).toBe(true);

      const col2 = new SudokuColumn(sudokuArray, 2);
      expect(col2.isComplete).toBe(false);
    });
  });

  describe("missingValues", () => {
    it("should return all values for an empty column", () => {
      expect(sudokuColumn.missingValues.sort()).toEqual([
        1, 2, 3, 4, 5, 6, 7, 8, 9,
      ]);
    });

    it("should return no values for a complete column", () => {
      sudokuArray.fill([
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0, 0, 0],
        [3, 0, 0, 0, 0, 0, 0, 0, 0],
        [4, 0, 0, 0, 0, 0, 0, 0, 0],
        [5, 0, 0, 0, 0, 0, 0, 0, 0],
        [6, 0, 0, 0, 0, 0, 0, 0, 0],
        [7, 0, 0, 0, 0, 0, 0, 0, 0],
        [8, 0, 0, 0, 0, 0, 0, 0, 0],
        [9, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(sudokuColumn.missingValues).toEqual([]);
    });

    it("should return correct missing values for a partially filled column", () => {
      sudokuArray.fill([
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0, 0, 0],
        [3, 0, 0, 0, 0, 0, 0, 0, 0],
        [4, 0, 0, 0, 0, 0, 0, 0, 0],
        [5, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(sudokuColumn.missingValues.sort()).toEqual([6, 7, 8, 9]);
    });

    it("should return only one missing value when column is almost complete", () => {
      sudokuArray.fill([
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0, 0, 0],
        [3, 0, 0, 0, 0, 0, 0, 0, 0],
        [4, 0, 0, 0, 0, 0, 0, 0, 0],
        [5, 0, 0, 0, 0, 0, 0, 0, 0],
        [6, 0, 0, 0, 0, 0, 0, 0, 0],
        [7, 0, 0, 0, 0, 0, 0, 0, 0],
        [8, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(sudokuColumn.missingValues).toEqual([9]);
    });

    it("should work correctly for different columns", () => {
      sudokuArray.fill([
        [1, 4, 0, 0, 0, 0, 0, 0, 0],
        [2, 5, 0, 0, 0, 0, 0, 0, 0],
        [3, 6, 0, 0, 0, 0, 0, 0, 0],
        [0, 7, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      const col1 = new SudokuColumn(sudokuArray, 1);
      expect(col1.missingValues.sort()).toEqual([1, 2, 3, 8, 9]);
    });
  });

  describe("missingIndices", () => {
    it("should return all indices for an empty column", () => {
      expect(sudokuColumn.missingIndices).toEqual([
        0, 9, 18, 27, 36, 45, 54, 63, 72,
      ]);
    });

    it("should return no indices for a complete column", () => {
      sudokuArray.fill([
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0, 0, 0],
        [3, 0, 0, 0, 0, 0, 0, 0, 0],
        [4, 0, 0, 0, 0, 0, 0, 0, 0],
        [5, 0, 0, 0, 0, 0, 0, 0, 0],
        [6, 0, 0, 0, 0, 0, 0, 0, 0],
        [7, 0, 0, 0, 0, 0, 0, 0, 0],
        [8, 0, 0, 0, 0, 0, 0, 0, 0],
        [9, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(sudokuColumn.missingIndices).toEqual([]);
    });

    it("should return correct missing indices for a partially filled column", () => {
      sudokuArray.fill([
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0, 0, 0],
        [3, 0, 0, 0, 0, 0, 0, 0, 0],
        [4, 0, 0, 0, 0, 0, 0, 0, 0],
        [5, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(sudokuColumn.missingIndices).toEqual([45, 54, 63, 72]);
    });

    it("should handle scattered missing cells", () => {
      sudokuArray.fill([
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [3, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [5, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [7, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [9, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(sudokuColumn.missingIndices).toEqual([9, 27, 45, 63]);
    });

    it("should work correctly for different columns", () => {
      sudokuArray.fill([
        [0, 4, 0, 0, 0, 0, 0, 0, 0],
        [0, 5, 0, 0, 0, 0, 0, 0, 0],
        [0, 6, 0, 0, 0, 0, 0, 0, 0],
        [0, 7, 0, 0, 0, 0, 0, 0, 0],
        [0, 8, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      const col1 = new SudokuColumn(sudokuArray, 1);
      expect(col1.missingIndices).toEqual([46, 55, 64, 73]);
    });
  });

  describe("missingCount", () => {
    it("should return 9 for an empty column", () => {
      expect(sudokuColumn.missingCount).toBe(9);
    });

    it("should return 0 for a complete column", () => {
      sudokuArray.fill([
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0, 0, 0],
        [3, 0, 0, 0, 0, 0, 0, 0, 0],
        [4, 0, 0, 0, 0, 0, 0, 0, 0],
        [5, 0, 0, 0, 0, 0, 0, 0, 0],
        [6, 0, 0, 0, 0, 0, 0, 0, 0],
        [7, 0, 0, 0, 0, 0, 0, 0, 0],
        [8, 0, 0, 0, 0, 0, 0, 0, 0],
        [9, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(sudokuColumn.missingCount).toBe(0);
    });

    it("should return correct count for a partially filled column", () => {
      sudokuArray.fill([
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0, 0, 0],
        [3, 0, 0, 0, 0, 0, 0, 0, 0],
        [4, 0, 0, 0, 0, 0, 0, 0, 0],
        [5, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(sudokuColumn.missingCount).toBe(4);
    });

    it("should return 1 when column has only one missing value", () => {
      sudokuArray.fill([
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0, 0, 0],
        [3, 0, 0, 0, 0, 0, 0, 0, 0],
        [4, 0, 0, 0, 0, 0, 0, 0, 0],
        [5, 0, 0, 0, 0, 0, 0, 0, 0],
        [6, 0, 0, 0, 0, 0, 0, 0, 0],
        [7, 0, 0, 0, 0, 0, 0, 0, 0],
        [8, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(sudokuColumn.missingCount).toBe(1);
    });

    it("should handle invalid values as missing", () => {
      sudokuArray.fill([
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0, 0, 0],
        [3, 0, 0, 0, 0, 0, 0, 0, 0],
        [4, 0, 0, 0, 0, 0, 0, 0, 0],
        [-5, 0, 0, 0, 0, 0, 0, 0, 0],
        [6, 0, 0, 0, 0, 0, 0, 0, 0],
        [7, 0, 0, 0, 0, 0, 0, 0, 0],
        [8, 0, 0, 0, 0, 0, 0, 0, 0],
        [10, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(sudokuColumn.missingCount).toBe(2);
    });

    it("should work correctly for different columns", () => {
      sudokuArray.fill([
        [1, 4, 7, 0, 0, 0, 0, 0, 0],
        [2, 5, 8, 0, 0, 0, 0, 0, 0],
        [3, 6, 9, 0, 0, 0, 0, 0, 0],
        [0, 7, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 2, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);

      expect(sudokuColumn.missingCount).toBe(6);

      const col1 = new SudokuColumn(sudokuArray, 1);
      expect(col1.missingCount).toBe(5);

      const col2 = new SudokuColumn(sudokuArray, 2);
      expect(col2.missingCount).toBe(4);
    });
  });
});
