import { beforeEach, describe, expect, it } from "vitest";
import SudokuArray from "./SudokuArray";

describe("SudokuArray", () => {
  let sudokuArray: SudokuArray;

  beforeEach(() => {
    sudokuArray = new SudokuArray();
  });

  describe("constructor", () => {
    it("should fill the SudokuArray with only 0s", () => {
      sudokuArray = new SudokuArray();
      for (let i = 0; i < 81; i++) {
        expect(sudokuArray.get(i)).toBe(0);
      }
    });
  });

  describe("fill", () => {
    it("should fill the SudokuArray with provided values", () => {
      const values = Array(81)
        .fill(0)
        .map((_, i) => (i % 9) + 1);
      sudokuArray.fill(values);
      for (let i = 0; i < 81; i++) {
        expect(sudokuArray.get(i)).toBe((i % 9) + 1);
      }

      sudokuArray.fill(Array(9).fill(Array(9).fill(5)));
      for (let i = 0; i < 81; i++) {
        expect(sudokuArray.get(i)).toBe(5);
      }
    });

    it("should throw an error for invalid input", () => {
      expect(() => sudokuArray.fill(Array(80).fill(0))).toThrow(
        "Invalid Sudoku array"
      );
      expect(() => sudokuArray.fill(Array(82).fill(0))).toThrow(
        "Invalid Sudoku array"
      );
      expect(() =>
        sudokuArray.fill([1, 2, "3"] as unknown as number[])
      ).toThrow("Invalid Sudoku array");

      const arr = Array(81).fill(0);
      arr[10] = "a" as unknown as number;
      expect(() => sudokuArray.fill(arr)).toThrow("Invalid value at index 10");
    });
  });

  describe("parseJSON", () => {
    it("should parse a valid JSON string and fill the SudokuArray", () => {
      const json = JSON.stringify(
        Array(81)
          .fill(0)
          .map((_, i) => (i % 9) + 1)
      );
      sudokuArray.parseJSON(json);
      for (let i = 0; i < 81; i++) {
        expect(sudokuArray.get(i)).toBe((i % 9) + 1);
      }
    });

    it("should throw an error for invalid JSON string", () => {
      const invalidJson = '{"invalid": "data"}';
      expect(() => sudokuArray.parseJSON(invalidJson)).toThrow(
        "Invalid Sudoku array"
      );
    });
  });

  describe("get and set", () => {
    it("should get and set values correctly", () => {
      sudokuArray.set(0, 5);
      sudokuArray.set(1, 1);
      expect(sudokuArray.get(0)).toBe(5);
      expect(sudokuArray.at({ row: 0, col: 0 })).toBe(5);
      expect(sudokuArray.get(1)).toBe(1);
      expect(sudokuArray.at({ row: 0, col: 1 })).toBe(1);

      sudokuArray.set(80, 9);
      sudokuArray.update({ row: 8, col: 7 }, 8);
      expect(sudokuArray.get(80)).toBe(9);
      expect(sudokuArray.at({ row: 8, col: 8 })).toBe(9);
      expect(sudokuArray.get(79)).toBe(8);
      expect(sudokuArray.at({ row: 8, col: 7 })).toBe(8);
    });
  });

  describe("indices", () => {
    it("should return an array of indices from 0 to 80", () => {
      const indices = sudokuArray.indices;
      expect(indices.length).toBe(81);
      for (let i = 0; i < 81; i++) {
        expect(indices[i]).toBe(i);
      }
    });
  });

  describe("row, column, and square", () => {
    it("should return correct SudokuRow, SudokuColumn, and SudokuSquare", () => {
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

      const row = sudokuArray.row(0);
      for (let i = 0; i < 9; i++) {
        expect(row.get(i)).toBe(sudokuArray.get(i));
      }

      const column = sudokuArray.column(0);
      for (let i = 0; i < 9; i++) {
        expect(column.get(i)).toBe(sudokuArray.get(i * 9));
      }

      const square = sudokuArray.square(0);
      console.log(square.indices);
      const expectedValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      for (let i = 0; i < 9; i++) {
        expect(square.get(i)).toBe(expectedValues[i]);
      }
    });
  });

  describe("isValid", () => {
    it("should return true for a valid SudokuArray", () => {
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
      expect(sudokuArray.isValid).toBe(true);
    });
  });

  describe("isComplete", () => {
    it("should return true for a complete SudokuArray", () => {
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
      expect(sudokuArray.isComplete).toBe(true);
    });

    it("should return false for an incomplete SudokuArray", () => {
      sudokuArray.fill([
        [1, 2, 3, 4, 5, 6, 7, 8, 0],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 7, 1, 3, 6, 4, 8, 9, 5],
        [8, 3, 5, 2, 9, 1, 6, 4, 7],
        [9, 6, 4, 5, 7, 8, 2, 3, 1],
        [3, 1, 2, 6, 4, 5, 9, 7, 8],
        [5, 9, 7, 8, 1, 2, 3, 6, 4],
        [6, 4, 8, 9, 3, 7, 5, 1, 2],
      ]);
      expect(sudokuArray.isComplete).toBe(false);
    });
  });

  describe("missingValues, missingIndices, and missingCount", () => {
    it("should return correct missing values, indices, and count", () => {
      sudokuArray.fill([
        [1, 2, 3, 4, 5, 6, 7, 8, 0],
        [4, 5, 6, 7, 8, 0, 1, 2, 3],
        [0, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 7, 1, 3, 6, 4, 8, 9, 5],
        [8, 3, 5, 2, 9, 1, 6, 4, 7],
        [9, 6, 4, 5, 7, 8, 2, 3, 1],
        [3, 1, 2, 6, 4, 5, 9, 7, 8],
        [5, 9, 7, 8, 1, 2, 3, 6, 4],
        [6, 4, 8, 9, 3, 7, 5, 1, 2],
      ]);

      expect(sudokuArray.missingValues).toEqual([9, 7]);
      expect(sudokuArray.missingIndices).toEqual([8, 14, 18]);
      expect(sudokuArray.missingCount).toBe(3);
    });
  });
});
