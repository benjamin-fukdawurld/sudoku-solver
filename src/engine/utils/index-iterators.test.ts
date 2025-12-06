import { describe, expect, it } from "vitest";
import {
  allIndicesGenerator,
  colIndexGenerator,
  makeAllIndicesIterator,
  makeColIterator,
  makeRowIterator,
  makeSquareIterator,
  rowIndexGenerator,
  squareIndexGenerator,
} from "./index-iterators";

describe("index iterators and generators", () => {
  it("rowIndexGenerator", () => {
    expect(Array.from(rowIndexGenerator(0))).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8,
    ]);
    expect(Array.from(rowIndexGenerator(1))).toEqual([
      9, 10, 11, 12, 13, 14, 15, 16, 17,
    ]);
    expect(Array.from(rowIndexGenerator(8))).toEqual([
      72, 73, 74, 75, 76, 77, 78, 79, 80,
    ]);
  });

  it("colIndexGenerator", () => {
    expect(Array.from(colIndexGenerator(0))).toEqual([
      0, 9, 18, 27, 36, 45, 54, 63, 72,
    ]);
    expect(Array.from(colIndexGenerator(1))).toEqual([
      1, 10, 19, 28, 37, 46, 55, 64, 73,
    ]);
    expect(Array.from(colIndexGenerator(8))).toEqual([
      8, 17, 26, 35, 44, 53, 62, 71, 80,
    ]);
  });

  it("squareIndexGenerator", () => {
    expect(Array.from(squareIndexGenerator(0))).toEqual([
      0, 1, 2, 9, 10, 11, 18, 19, 20,
    ]);
    expect(Array.from(squareIndexGenerator(1))).toEqual([
      3, 4, 5, 12, 13, 14, 21, 22, 23,
    ]);
    expect(Array.from(squareIndexGenerator(2))).toEqual([
      6, 7, 8, 15, 16, 17, 24, 25, 26,
    ]);
    expect(Array.from(squareIndexGenerator(3))).toEqual([
      27, 28, 29, 36, 37, 38, 45, 46, 47,
    ]);
    expect(Array.from(squareIndexGenerator(4))).toEqual([
      30, 31, 32, 39, 40, 41, 48, 49, 50,
    ]);
    expect(Array.from(squareIndexGenerator(5))).toEqual([
      33, 34, 35, 42, 43, 44, 51, 52, 53,
    ]);
    expect(Array.from(squareIndexGenerator(6))).toEqual([
      54, 55, 56, 63, 64, 65, 72, 73, 74,
    ]);
    expect(Array.from(squareIndexGenerator(7))).toEqual([
      57, 58, 59, 66, 67, 68, 75, 76, 77,
    ]);
    expect(Array.from(squareIndexGenerator(8))).toEqual([
      60, 61, 62, 69, 70, 71, 78, 79, 80,
    ]);
  });

  it("allIndicesGenerator", () => {
    expect(Array.from(allIndicesGenerator())).toEqual(
      Array.from({ length: 81 }, (_, i) => i)
    );

    expect(Array.from(allIndicesGenerator("col"))).toEqual(
      Array.from({ length: 9 }, (_, i) => [...colIndexGenerator(i)]).flat()
    );

    expect(Array.from(allIndicesGenerator("square"))).toEqual(
      Array.from({ length: 9 }, (_, i) => [...squareIndexGenerator(i)]).flat()
    );
  });

  describe("makeRowIterator", () => {
    it("should create an iterator for the given row", () => {
      expect(Array.from(makeRowIterator(0))).toEqual([
        0, 1, 2, 3, 4, 5, 6, 7, 8,
      ]);
      expect(Array.from(makeRowIterator(1))).toEqual([
        9, 10, 11, 12, 13, 14, 15, 16, 17,
      ]);
      expect(Array.from(makeRowIterator(2))).toEqual([
        18, 19, 20, 21, 22, 23, 24, 25, 26,
      ]);

      expect(Array.from(makeRowIterator(8))).toEqual([
        72, 73, 74, 75, 76, 77, 78, 79, 80,
      ]);
    });
  });

  describe("makeColIterator", () => {
    it("should create an iterator for the given column", () => {
      expect(Array.from(makeColIterator(0))).toEqual([
        0, 9, 18, 27, 36, 45, 54, 63, 72,
      ]);
      expect(Array.from(makeColIterator(1))).toEqual([
        1, 10, 19, 28, 37, 46, 55, 64, 73,
      ]);
      expect(Array.from(makeColIterator(2))).toEqual([
        2, 11, 20, 29, 38, 47, 56, 65, 74,
      ]);

      expect(Array.from(makeColIterator(8))).toEqual([
        8, 17, 26, 35, 44, 53, 62, 71, 80,
      ]);
    });
  });

  describe("makeSquareIterator", () => {
    it("should create an iterator for the given square", () => {
      expect(Array.from(makeSquareIterator(0))).toEqual([
        0, 1, 2, 9, 10, 11, 18, 19, 20,
      ]);
      expect(Array.from(makeSquareIterator(1))).toEqual([
        3, 4, 5, 12, 13, 14, 21, 22, 23,
      ]);
      expect(Array.from(makeSquareIterator(2))).toEqual([
        6, 7, 8, 15, 16, 17, 24, 25, 26,
      ]);
    });
  });

  it("makeAllIndicesIterator", () => {
    expect(Array.from(makeAllIndicesIterator())).toEqual(
      Array.from({ length: 81 }, (_, i) => i)
    );

    expect(Array.from(makeAllIndicesIterator("col"))).toEqual(
      Array.from({ length: 9 }, (_, i) => [...colIndexGenerator(i)]).flat()
    );

    expect(Array.from(makeAllIndicesIterator("square"))).toEqual(
      Array.from({ length: 9 }, (_, i) => [...squareIndexGenerator(i)]).flat()
    );
  });
});
