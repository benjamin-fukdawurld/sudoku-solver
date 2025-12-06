import { describe, expect, it } from "vitest";
import {
  getSquareCellIndex,
  getSquareIndex,
  rowColToSudokuIndex,
  sudokuIndexToRowCol,
  sudokuIndexToSquareIndex,
  sudokuIndexToSquareLocalIndex,
} from "./index-conversions";

describe("index utils", () => {
  describe("sudokuIndexToRowCol", () => {
    it("should convert index to row and column", () => {
      expect(sudokuIndexToRowCol(0)).toEqual({ row: 0, col: 0 });
      expect(sudokuIndexToRowCol(10)).toEqual({ row: 1, col: 1 });
      expect(sudokuIndexToRowCol(80)).toEqual({ row: 8, col: 8 });
    });
  });

  describe("rowColToSudokuIndex", () => {
    it("should convert row and column to index", () => {
      expect(rowColToSudokuIndex(0, 0)).toBe(0);
      expect(rowColToSudokuIndex(1, 1)).toBe(10);
      expect(rowColToSudokuIndex(8, 8)).toBe(80);
    });
  });

  describe("square index conversions", () => {
    describe("getSquareIndex", () => {
      it("should get square index from row and column", () => {
        expect(getSquareIndex(0, 0)).toBe(0);
        expect(getSquareIndex(0, 3)).toBe(1);
        expect(getSquareIndex(0, 6)).toBe(2);
        expect(getSquareIndex(3, 0)).toBe(3);
        expect(getSquareIndex(3, 3)).toBe(4);
        expect(getSquareIndex(3, 6)).toBe(5);
        expect(getSquareIndex(6, 0)).toBe(6);
        expect(getSquareIndex(6, 3)).toBe(7);
        expect(getSquareIndex(6, 6)).toBe(8);
        expect(getSquareIndex(5, 2)).toBe(3);
        expect(getSquareIndex(4, 5)).toBe(4);
        expect(getSquareIndex(8, 8)).toBe(8);
      });
    });
    describe("sudokuIndexToSquareIndex", () => {
      it("should convert sudoku index to square index", () => {
        expect(sudokuIndexToSquareIndex(0)).toBe(0);
        expect(sudokuIndexToSquareIndex(4)).toBe(1);
        expect(sudokuIndexToSquareIndex(7)).toBe(2);
        expect(sudokuIndexToSquareIndex(10)).toBe(0);
        expect(sudokuIndexToSquareIndex(13)).toBe(1);
        expect(sudokuIndexToSquareIndex(16)).toBe(2);
        expect(sudokuIndexToSquareIndex(20)).toBe(0);
        expect(sudokuIndexToSquareIndex(23)).toBe(1);
        expect(sudokuIndexToSquareIndex(26)).toBe(2);
        expect(sudokuIndexToSquareIndex(27)).toBe(3);
        expect(sudokuIndexToSquareIndex(35)).toBe(5);
        expect(sudokuIndexToSquareIndex(36)).toBe(3);
        expect(sudokuIndexToSquareIndex(80)).toBe(8);
      });
    });
    describe("getSquareCellIndex", () => {
      it("should get square cell index from row and column", () => {
        expect(getSquareCellIndex(0, 0)).toBe(0);
        expect(getSquareCellIndex(0, 1)).toBe(1);
        expect(getSquareCellIndex(0, 2)).toBe(2);
        expect(getSquareCellIndex(1, 0)).toBe(3);
        expect(getSquareCellIndex(1, 1)).toBe(4);
        expect(getSquareCellIndex(1, 2)).toBe(5);
        expect(getSquareCellIndex(2, 0)).toBe(6);
        expect(getSquareCellIndex(2, 1)).toBe(7);
        expect(getSquareCellIndex(2, 2)).toBe(8);
        expect(getSquareCellIndex(4, 5)).toBe(5);
        expect(getSquareCellIndex(7, 8)).toBe(5);
        expect(getSquareCellIndex(8, 8)).toBe(8);
      });
    });
    describe("sudokuIndexToSquareLocalIndex", () => {
      it("should convert sudoku index to square local index", () => {
        expect(sudokuIndexToSquareLocalIndex(0)).toBe(0);
        expect(sudokuIndexToSquareLocalIndex(1)).toBe(1);
        expect(sudokuIndexToSquareLocalIndex(2)).toBe(2);
        expect(sudokuIndexToSquareLocalIndex(9)).toBe(3);
        expect(sudokuIndexToSquareLocalIndex(10)).toBe(4);
        expect(sudokuIndexToSquareLocalIndex(11)).toBe(5);
        expect(sudokuIndexToSquareLocalIndex(18)).toBe(6);
        expect(sudokuIndexToSquareLocalIndex(19)).toBe(7);
        expect(sudokuIndexToSquareLocalIndex(20)).toBe(8);
        expect(sudokuIndexToSquareLocalIndex(40)).toBe(4);
        expect(sudokuIndexToSquareLocalIndex(80)).toBe(8);
      });
    });
  });
});
