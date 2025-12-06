import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import SudokuArray from "../SudokuArray";
import {
  colIndexGenerator,
  rowIndexGenerator,
  squareIndexGenerator,
} from "./index-iterators";
import {
  getAllPossibilities,
  getAllSinglePossibilities,
  getIndexPossibilities,
  getSubGridIndexPossibilities,
  getIndexUniquePossibilities,
  getAllUniquePossibilities,
  aggregatePossibleValues,
  possibleValuesToArray,
} from "./possibilities";
import { SudokuAllValueFlags, SudokuValueFlags } from "../types";
import { getSquareIndex, sudokuIndexToRowCol } from "./index-conversions";

describe("possibilities", () => {
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

  describe("getSubGridIndexPossibilities", () => {
    it("should return zero possibilities for a filled cell", () => {
      sudokuArray.set(0, 1);

      const possibilities = getSubGridIndexPossibilities(
        sudokuArray,
        rowIndexGenerator(0),
        0
      );
      expect(possibilities).toBe(0);
    });

    it("should return all possibilities for an empty row", () => {
      const possibilities = getSubGridIndexPossibilities(
        sudokuArray,
        rowIndexGenerator(0),
        0
      );
      expect(possibilities).toBe(SudokuAllValueFlags);
    });

    it("should return all possibilities for an empty column", () => {
      const possibilities = getSubGridIndexPossibilities(
        sudokuArray,
        colIndexGenerator(0),
        0
      );
      expect(possibilities).toBe(SudokuAllValueFlags);
    });

    it("should return all possibilities for an empty square", () => {
      const possibilities = getSubGridIndexPossibilities(
        sudokuArray,
        squareIndexGenerator(0),
        0
      );
      expect(possibilities).toBe(SudokuAllValueFlags);
    });

    it("should return zero possibilities for a filled row", () => {
      let val = 1;
      for (const index of rowIndexGenerator(0)) {
        sudokuArray.set(index, val);
        val++;
      }

      const possibilities = getSubGridIndexPossibilities(
        sudokuArray,
        rowIndexGenerator(0),
        0
      );
      expect(possibilities).toBe(0);
    });

    it("should return zero possibilities for a filled column", () => {
      let val = 1;
      for (const index of colIndexGenerator(0)) {
        sudokuArray.set(index, val);
        val++;
      }

      const possibilities = getSubGridIndexPossibilities(
        sudokuArray,
        colIndexGenerator(0),
        0
      );
      expect(possibilities).toBe(0);
    });

    it("should return zero possibilities for a filled square", () => {
      let val = 1;
      for (const index of squareIndexGenerator(0)) {
        sudokuArray.set(index, val);
        val++;
      }

      const possibilities = getSubGridIndexPossibilities(
        sudokuArray,
        squareIndexGenerator(0),
        0
      );
      expect(possibilities).toBe(0);
    });
  });

  describe("getIndexPossibilities", () => {
    it("should return all possibilities for an empty cell", () => {
      const possibilities = getIndexPossibilities(sudokuArray, 0);
      expect(possibilities).toBe(SudokuAllValueFlags);
    });

    it("should return zero possibilities for a filled cell", () => {
      sudokuArray.set(0, 5);
      const possibilities = getIndexPossibilities(sudokuArray, 0);
      expect(possibilities).toBe(0);
    });

    it("should return correct possibilities for a partially filled grid", () => {
      sudokuArray.set(0, 1); // Row 0, Col 0
      sudokuArray.set(1, 2); // Row 0, Col 1
      sudokuArray.set(9, 3); // Row 1, Col 0
      sudokuArray.set(10, 4); // Row 1, Col 1
      sudokuArray.set(20, 5); // Row 2, Col 2

      const possibilities = getIndexPossibilities(sudokuArray, 2);
      expect(possibilities).toBe(
        SudokuValueFlags[6] |
          SudokuValueFlags[7] |
          SudokuValueFlags[8] |
          SudokuValueFlags[9]
      );
    });

    it("should return zero possibilities when all numbers are taken", () => {
      // Fill first row
      for (let i = 0; i < 9; i++) {
        sudokuArray.set(i, i + 1);
      }

      const possibilities = getIndexPossibilities(sudokuArray, 0);
      expect(possibilities).toBe(0);
    });
  });

  describe("getAllPossibilities", () => {
    it("should return correct possibilities for all cells in an empty grid", () => {
      const possibilities = getAllPossibilities(sudokuArray);
      for (let i = 0; i < 81; i++) {
        expect(possibilities[i]).toBe(SudokuAllValueFlags);
      }
    });

    it("should return correct possibilities for all cells in a partially filled grid", () => {
      sudokuArray.set(0, 1); // Row 0, Col 0
      sudokuArray.set(1, 2); // Row 0, Col 1
      sudokuArray.set(9, 3); // Row 1, Col 0
      sudokuArray.set(10, 4); // Row 1, Col 1
      sudokuArray.set(20, 5); // Row 2, Col 2

      const possibilities = getAllPossibilities(sudokuArray);

      expect(possibilities[2]).toBe(
        SudokuValueFlags[6] |
          SudokuValueFlags[7] |
          SudokuValueFlags[8] |
          SudokuValueFlags[9]
      );

      expect(possibilities[0]).toBe(0);
      expect(possibilities[1]).toBe(0);
      expect(possibilities[9]).toBe(0);
      expect(possibilities[10]).toBe(0);
      expect(possibilities[20]).toBe(0);
    });

    it("should return zero possibilities for all cells in a filled grid", () => {
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

      const possibilities = getAllPossibilities(sudokuArray);

      for (let i = 0; i < 81; i++) {
        expect(possibilities[i]).toBe(0);
      }
    });
  });

  describe("getAllSinglePossibilities", () => {
    it("should return no single possibilities from an empty possibilities array", () => {
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
      const possibilitiesArray = getAllPossibilities(sudokuArray);
      const singlePossibilities = getAllSinglePossibilities(possibilitiesArray);

      for (let i = 0; i < 81; i++) {
        expect(singlePossibilities[i]).toBe(0);
      }
    });

    it("should return single possibilities from a possibilities array with singles", () => {
      sudokuArray.fill([
        [0, 2, 3, 4, 5, 6, 7, 0, 9],
        [4, 5, 6, 7, 8, 9, 1, 0, 3],
        [7, 8, 9, 1, 2, 0, 4, 5, 6],
        [2, 7, 1, 3, 6, 4, 8, 9, 5],
        [8, 3, 5, 2, 9, 1, 6, 4, 7],
        [9, 6, 4, 5, 7, 8, 2, 3, 1],
        [3, 1, 2, 6, 4, 5, 9, 7, 8],
        [5, 9, 7, 8, 1, 2, 3, 6, 4],
        [6, 4, 8, 9, 3, 7, 5, 1, 2],
      ]);

      const possibilitiesArray = getAllPossibilities(sudokuArray);
      const singlePossibilities = getAllSinglePossibilities(possibilitiesArray);

      expect(singlePossibilities[0]).toBe(SudokuValueFlags[1]);
      expect(singlePossibilities[7]).toBe(SudokuValueFlags[8]);
      expect(singlePossibilities[16]).toBe(SudokuValueFlags[2]);
      expect(singlePossibilities[23]).toBe(SudokuValueFlags[3]);

      sudokuArray.fill([
        [0, 0, 3, 4, 5, 6, 7, 0, 9],
        [4, 5, 6, 7, 0, 9, 1, 0, 3],
        [7, 0, 9, 1, 2, 0, 4, 5, 6],
        [0, 7, 1, 3, 6, 4, 8, 9, 5],
        [0, 3, 5, 2, 9, 1, 6, 4, 7],
        [9, 6, 4, 5, 7, 8, 0, 3, 1],
        [3, 1, 2, 6, 4, 5, 9, 7, 8],
        [5, 9, 7, 8, 1, 2, 3, 6, 4],
        [6, 4, 8, 9, 3, 7, 5, 1, 2],
      ]);

      getAllPossibilities(sudokuArray, possibilitiesArray as number[]);
      getAllSinglePossibilities(
        possibilitiesArray,
        singlePossibilities as number[]
      );

      expect(singlePossibilities[0]).toBe(0);
      expect(singlePossibilities[7]).toBe(0);
    });

    it("should return no single possibilities for an empty grid", () => {
      const possibilitiesArray = getAllPossibilities(sudokuArray);
      const singlePossibilities = getAllSinglePossibilities(possibilitiesArray);

      for (let i = 0; i < 81; i++) {
        expect(singlePossibilities[i]).toBe(0);
      }
    });
  });

  describe("getIndexUniquePossibilities", () => {
    it("should return no unique possibilities for an empty grid", () => {
      const possibilitiesArray = getAllPossibilities(sudokuArray);

      for (let i = 0; i < 81; i++) {
        expect(
          getIndexUniquePossibilities(
            i,
            possibilitiesArray,
            rowIndexGenerator(Math.floor(i / 9))
          )
        ).toBe(0);

        expect(
          getIndexUniquePossibilities(
            i,
            possibilitiesArray,
            colIndexGenerator(Math.floor(i % 9))
          )
        ).toBe(0);

        const { row, col } = sudokuIndexToRowCol(i);
        expect(
          getIndexUniquePossibilities(
            i,
            possibilitiesArray,
            squareIndexGenerator(getSquareIndex(row, col))
          )
        ).toBe(0);
      }
    });

    it("should return no unique possibilities for a filled grid", () => {
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

      const possibilitiesArray = getAllPossibilities(sudokuArray);
      for (let i = 0; i < 81; i++) {
        expect(
          getIndexUniquePossibilities(
            i,
            possibilitiesArray,
            rowIndexGenerator(Math.floor(i / 9))
          )
        ).toBe(0);

        expect(
          getIndexUniquePossibilities(
            i,
            possibilitiesArray,
            colIndexGenerator(Math.floor(i % 9))
          )
        ).toBe(0);

        const { row, col } = sudokuIndexToRowCol(i);
        expect(
          getIndexUniquePossibilities(
            i,
            possibilitiesArray,
            squareIndexGenerator(getSquareIndex(row, col))
          )
        ).toBe(0);
      }
    });

    it("should return correct unique possibilities for a grid with some filled cells", () => {
      sudokuArray.fill([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 7, 1, 3, 6, 4, 8, 9, 5],
        [8, 3, 5, 2, 9, 1, 6, 4, 7],
        [9, 6, 4, 5, 7, 8, 2, 3, 1],
        [3, 1, 2, 6, 4, 5, 9, 7, 8],
        [5, 9, 7, 8, 1, 2, 3, 6, 4],
        [6, 4, 8, 9, 3, 7, 5, 1, 2],
      ]);

      const possibilitiesArray = getAllPossibilities(sudokuArray);

      // Row 0, Col 0
      expect(
        getIndexUniquePossibilities(0, possibilitiesArray, rowIndexGenerator(0))
      ).toBe(SudokuValueFlags[1]);

      expect(
        getIndexUniquePossibilities(1, possibilitiesArray, colIndexGenerator(0))
      ).toBe(SudokuValueFlags[2]);

      expect(
        getIndexUniquePossibilities(
          2,
          possibilitiesArray,
          squareIndexGenerator(0)
        )
      ).toBe(SudokuValueFlags[3]);

      expect(
        getIndexUniquePossibilities(3, possibilitiesArray, rowIndexGenerator(0))
      ).toBe(SudokuValueFlags[4]);

      expect(
        getIndexUniquePossibilities(4, possibilitiesArray, rowIndexGenerator(0))
      ).toBe(SudokuValueFlags[5]);

      expect(
        getIndexUniquePossibilities(5, possibilitiesArray, rowIndexGenerator(0))
      ).toBe(SudokuValueFlags[6]);

      expect(
        getIndexUniquePossibilities(6, possibilitiesArray, rowIndexGenerator(0))
      ).toBe(SudokuValueFlags[7]);

      expect(
        getIndexUniquePossibilities(7, possibilitiesArray, rowIndexGenerator(0))
      ).toBe(SudokuValueFlags[8]);

      expect(
        getIndexUniquePossibilities(8, possibilitiesArray, rowIndexGenerator(0))
      ).toBe(SudokuValueFlags[9]);
    });
  });

  describe("getAllUniquePossibilities", () => {
    it("should return no unique possibilities for a filled grid", () => {
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

      const possibilitiesArray = getAllPossibilities(sudokuArray);
      const uniquePossibilities = getAllUniquePossibilities(possibilitiesArray);

      for (let i = 0; i < 81; i++) {
        expect(uniquePossibilities[i]).toBe(0);
      }
    });

    it("should return correct unique possibilities for a grid with some filled cells", () => {
      sudokuArray.fill([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 7, 1, 3, 6, 4, 8, 9, 5],
        [8, 3, 5, 2, 9, 1, 6, 4, 7],
        [9, 6, 4, 5, 7, 8, 2, 3, 1],
        [3, 1, 2, 6, 4, 5, 9, 7, 8],
        [5, 9, 7, 8, 1, 2, 3, 6, 4],
        [6, 4, 8, 9, 3, 7, 5, 1, 2],
      ]);

      const possibilitiesArray = getAllPossibilities(sudokuArray);
      const uniquePossibilities = getAllUniquePossibilities(possibilitiesArray);

      expect(uniquePossibilities[0]).toBe(SudokuValueFlags[1]);
      expect(uniquePossibilities[1]).toBe(SudokuValueFlags[2]);
      expect(uniquePossibilities[2]).toBe(SudokuValueFlags[3]);
      expect(uniquePossibilities[3]).toBe(SudokuValueFlags[4]);
      expect(uniquePossibilities[4]).toBe(SudokuValueFlags[5]);
      expect(uniquePossibilities[5]).toBe(SudokuValueFlags[6]);
      expect(uniquePossibilities[6]).toBe(SudokuValueFlags[7]);
      expect(uniquePossibilities[7]).toBe(SudokuValueFlags[8]);
      expect(uniquePossibilities[8]).toBe(SudokuValueFlags[9]);
    });
  });

  describe("agregatePossibleValues", () => {
    it("should correctly aggregate possible values", () => {
      const flagsArray = [
        SudokuAllValueFlags, // All values possible
        0b111111110, // 1 not possible
        0b111111101, // 2 not possible
        0b111111011, // 3 not possible
      ];

      const aggregated = aggregatePossibleValues(flagsArray);
      expect(aggregated).toBe(0b111111000);
    });
  });

  describe("possibleValuesToArray", () => {
    it("should convert possible values flags to an array of numbers", () => {
      const flags = 0b101010101; // Possible values: 1, 3, 5, 7, 9
      const valuesArray = possibleValuesToArray(flags);
      expect(valuesArray).toEqual([1, 3, 5, 7, 9]);
    });
  });
});
