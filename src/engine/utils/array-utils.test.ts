import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import SudokuArray from "../SudokuArray";
import { every, fill, filter, forEach, map, reduce, some } from "./array-utils";
import { rowIndexGenerator } from "./index-iterators";

describe("array-utils", () => {
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

  describe("every", () => {
    it("should return true if all elements satisfy the predicate", () => {
      expect(every(sudokuArray, (value) => value === 0)).toBe(true);

      sudokuArray.row(0).indices.forEach((index) => {
        sudokuArray.set(index, 1);
      });

      expect(
        every(sudokuArray, (value) => value === 1, rowIndexGenerator(0))
      ).toBe(true);

      sudokuArray.row(0).set(2, 0);

      expect(
        every(sudokuArray, (value) => value === 1, rowIndexGenerator(0))
      ).toBe(false);
    });
  });

  describe("fill", () => {
    it("should fill the entire array with the specified value", () => {
      fill(sudokuArray, 5);
      expect(every(sudokuArray, (value) => value === 5)).toBe(true);
    });

    it("should fill a portion of the array with the specified value", () => {
      fill(sudokuArray, 3, { start: 10, end: 20 });
      for (let i = 0; i < 81; i++) {
        if (i >= 10 && i < 20) {
          expect(sudokuArray.get(i)).toBe(3);
        } else {
          expect(sudokuArray.get(i)).toBe(0);
        }
      }
    });

    it("should fill using a custom index generator", () => {
      fill(sudokuArray, 7, { generator: rowIndexGenerator(0) });
      for (let i = 0; i < 81; i++) {
        if (i >= 0 && i < 9) {
          expect(sudokuArray.get(i)).toBe(7);
        } else {
          expect(sudokuArray.get(i)).toBe(0);
        }
      }
    });

    it("should fill using a custom index generator with start and end", () => {
      fill(sudokuArray, 9, {
        generator: rowIndexGenerator(0),
        start: 2,
        end: 5,
      });
      for (let i = 0; i < 81; i++) {
        if (i >= 2 && i < 5) {
          expect(sudokuArray.get(i)).toBe(9);
        } else {
          expect(sudokuArray.get(i)).toBe(0);
        }
      }
    });
  });

  describe("filter", () => {
    it("should return indices of elements that satisfy the predicate", () => {
      sudokuArray.set(0, 1);
      sudokuArray.set(10, 1);
      sudokuArray.set(20, 2);
      sudokuArray.set(30, 1);

      const result = filter(sudokuArray, (value: number) => value === 1);
      expect(result).toEqual([0, 10, 30]);
    });

    it("should work with a custom index generator", () => {
      sudokuArray.row(0).indices.forEach((index) => {
        sudokuArray.set(index, 4);
      });
      const result = filter(
        sudokuArray,
        (value: number) => value === 4,
        rowIndexGenerator(0)
      );
      expect(result).toEqual(sudokuArray.row(0).indices);
    });
  });

  describe("some", () => {
    it("should return true if any element satisfies the predicate", () => {
      expect(some(sudokuArray, (value) => value === 1)).toBe(false);
      sudokuArray.set(5, 1);
      expect(some(sudokuArray, (value) => value === 1)).toBe(true);

      sudokuArray.row(1).indices.forEach((index) => {
        sudokuArray.set(index, 2);
      });

      expect(
        some(sudokuArray, (value) => value === 2, rowIndexGenerator(1))
      ).toBe(true);
    });
  });

  describe("map", () => {
    it("should map values correctly", () => {
      sudokuArray.set(0, 1);
      sudokuArray.set(1, 2);
      sudokuArray.set(2, 3);
      let result = map(sudokuArray, (value) => value * 2);
      expect(result[0]).toBe(2);
      expect(result[1]).toBe(4);
      expect(result[2]).toBe(6);
      expect(result[3]).toBe(0);

      const rowGenerator = rowIndexGenerator(1);
      sudokuArray.set(10, 5);
      result = map(sudokuArray, (value) => value + 1, rowGenerator);
      expect(result[0]).toBe(1);
      expect(result[1]).toBe(6);
      expect(result[2]).toBe(1);
      expect(result[3]).toBe(1);
    });
  });

  describe("forEach", () => {
    it("should execute callback for each element", () => {
      let sum = 0;
      forEach(sudokuArray, (value) => {
        sum += value;
      });

      expect(sum).toBe(0);
      sudokuArray.set(0, 1);
      sudokuArray.set(1, 2);
      sudokuArray.set(2, 3);
      sum = 0;
      forEach(sudokuArray, (value) => {
        sum += value;
      });

      expect(sum).toBe(6);

      sum = 0;
      const rowGenerator = rowIndexGenerator(2);
      sudokuArray.set(18, 4);
      sudokuArray.set(19, 5);
      sudokuArray.set(20, 6);
      sum = 0;
      forEach(
        sudokuArray,
        (value) => {
          sum += value;
        },
        rowGenerator
      );

      expect(sum).toBe(15);
    });
  });

  describe("reduce", () => {
    it("should reduce values correctly", () => {
      sudokuArray.set(0, 1);
      sudokuArray.set(1, 2);
      sudokuArray.set(2, 3);
      const sum = reduce(
        sudokuArray,
        (accumulator, value) => accumulator + value,
        0
      );
      expect(sum).toBe(6);

      const rowGenerator = rowIndexGenerator(3);
      sudokuArray.set(27, 4);
      sudokuArray.set(28, 5);
      sudokuArray.set(29, 6);
      const rowSum = reduce(
        sudokuArray,
        (accumulator, value) => accumulator + value,
        0,
        rowGenerator
      );
      expect(rowSum).toBe(15);
    });
  });
});
