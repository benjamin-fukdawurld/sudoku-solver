import { describe, expect, it } from "vitest";
import {
  isSudokuValueFlag,
  SudokuAllValueFlags,
  SudokuValueFlags,
  SudokuValueFlagsValues,
  SudokuValueFlagSet,
} from "./types";

describe("types", () => {
  describe("SudokuValueFlags", () => {
    it("should map values 1-9 to correct bit flags", () => {
      expect(SudokuValueFlags[1]).toBe(0b1);
      expect(SudokuValueFlags[2]).toBe(0b10);
      expect(SudokuValueFlags[3]).toBe(0b100);
      expect(SudokuValueFlags[4]).toBe(0b1000);
      expect(SudokuValueFlags[5]).toBe(0b10000);
      expect(SudokuValueFlags[6]).toBe(0b100000);
      expect(SudokuValueFlags[7]).toBe(0b1000000);
      expect(SudokuValueFlags[8]).toBe(0b10000000);
      expect(SudokuValueFlags[9]).toBe(0b100000000);
    });

    it("should map values 1-9 to correct decimal equivalents", () => {
      expect(SudokuValueFlags[1]).toBe(1);
      expect(SudokuValueFlags[2]).toBe(2);
      expect(SudokuValueFlags[3]).toBe(4);
      expect(SudokuValueFlags[4]).toBe(8);
      expect(SudokuValueFlags[5]).toBe(16);
      expect(SudokuValueFlags[6]).toBe(32);
      expect(SudokuValueFlags[7]).toBe(64);
      expect(SudokuValueFlags[8]).toBe(128);
      expect(SudokuValueFlags[9]).toBe(256);
    });

    it("should have exactly 9 entries", () => {
      expect(Object.keys(SudokuValueFlags)).toHaveLength(9);
    });

    it("should have unique bit flag values", () => {
      const values = Object.values(SudokuValueFlags);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });

    it("should use powers of 2 for all flags", () => {
      Object.values(SudokuValueFlags).forEach((flag) => {
        // Check if flag is a power of 2: (n & (n-1)) === 0 for powers of 2
        expect(flag & (flag - 1)).toBe(0);
        expect(flag).toBeGreaterThan(0);
      });
    });
  });

  describe("SudokuValueFlagsValues", () => {
    it("should map bit flags back to values 1-9", () => {
      expect(SudokuValueFlagsValues[0b1]).toBe(1);
      expect(SudokuValueFlagsValues[0b10]).toBe(2);
      expect(SudokuValueFlagsValues[0b100]).toBe(3);
      expect(SudokuValueFlagsValues[0b1000]).toBe(4);
      expect(SudokuValueFlagsValues[0b10000]).toBe(5);
      expect(SudokuValueFlagsValues[0b100000]).toBe(6);
      expect(SudokuValueFlagsValues[0b1000000]).toBe(7);
      expect(SudokuValueFlagsValues[0b10000000]).toBe(8);
      expect(SudokuValueFlagsValues[256]).toBe(9); // 0b100000000 = 256
    });

    it("should map decimal flag values back to values 1-9", () => {
      expect(SudokuValueFlagsValues[1]).toBe(1);
      expect(SudokuValueFlagsValues[2]).toBe(2);
      expect(SudokuValueFlagsValues[4]).toBe(3);
      expect(SudokuValueFlagsValues[8]).toBe(4);
      expect(SudokuValueFlagsValues[16]).toBe(5);
      expect(SudokuValueFlagsValues[32]).toBe(6);
      expect(SudokuValueFlagsValues[64]).toBe(7);
      expect(SudokuValueFlagsValues[128]).toBe(8);
      expect(SudokuValueFlagsValues[256]).toBe(9);
    });

    it("should have exactly 9 entries", () => {
      expect(Object.keys(SudokuValueFlagsValues)).toHaveLength(9);
    });

    it("should be the inverse mapping of SudokuValueFlags", () => {
      Object.entries(SudokuValueFlags).forEach(([value, flag]) => {
        expect(SudokuValueFlagsValues[flag]).toBe(Number(value));
      });
    });
  });

  describe("SudokuValueFlagSet", () => {
    it("should contain all flag values from SudokuValueFlags", () => {
      Object.values(SudokuValueFlags).forEach((flag) => {
        expect(SudokuValueFlagSet.has(flag)).toBe(true);
      });
    });

    it("should have exactly 9 elements", () => {
      expect(SudokuValueFlagSet.size).toBe(9);
    });

    it("should contain the correct flag values", () => {
      expect(SudokuValueFlagSet.has(1)).toBe(true);
      expect(SudokuValueFlagSet.has(2)).toBe(true);
      expect(SudokuValueFlagSet.has(4)).toBe(true);
      expect(SudokuValueFlagSet.has(8)).toBe(true);
      expect(SudokuValueFlagSet.has(16)).toBe(true);
      expect(SudokuValueFlagSet.has(32)).toBe(true);
      expect(SudokuValueFlagSet.has(64)).toBe(true);
      expect(SudokuValueFlagSet.has(128)).toBe(true);
      expect(SudokuValueFlagSet.has(256)).toBe(true);
    });

    it("should not contain invalid flag values", () => {
      expect(SudokuValueFlagSet.has(0)).toBe(false);
      expect(SudokuValueFlagSet.has(3)).toBe(false);
      expect(SudokuValueFlagSet.has(5)).toBe(false);
      expect(SudokuValueFlagSet.has(512)).toBe(false);
      expect(SudokuValueFlagSet.has(-1)).toBe(false);
    });

    it("should be a Set instance", () => {
      expect(SudokuValueFlagSet).toBeInstanceOf(Set);
    });
  });

  describe("SudokuAllValueFlags", () => {
    it("should equal 0b111111111", () => {
      expect(SudokuAllValueFlags).toBe(0b111111111);
    });

    it("should equal 511 in decimal", () => {
      expect(SudokuAllValueFlags).toBe(511);
    });

    it("should be the bitwise OR of all individual flags", () => {
      const combined = Object.values(SudokuValueFlags).reduce(
        (acc, flag) => acc | flag,
        0
      );
      expect(SudokuAllValueFlags).toBe(combined);
    });

    it("should have all 9 bits set", () => {
      // Count the number of set bits
      let count = 0;
      let n = SudokuAllValueFlags;
      while (n > 0) {
        count += n & 1;
        n >>= 1;
      }
      expect(count).toBe(9);
    });

    it("should contain all individual flags when ANDed", () => {
      Object.values(SudokuValueFlags).forEach((flag) => {
        expect((SudokuAllValueFlags & flag) === flag).toBe(true);
      });
    });
  });

  describe("isSudokuValueFlag", () => {
    it("should return true for valid flag values", () => {
      expect(isSudokuValueFlag(1)).toBe(true);
      expect(isSudokuValueFlag(2)).toBe(true);
      expect(isSudokuValueFlag(4)).toBe(true);
      expect(isSudokuValueFlag(8)).toBe(true);
      expect(isSudokuValueFlag(16)).toBe(true);
      expect(isSudokuValueFlag(32)).toBe(true);
      expect(isSudokuValueFlag(64)).toBe(true);
      expect(isSudokuValueFlag(128)).toBe(true);
      expect(isSudokuValueFlag(256)).toBe(true);
    });

    it("should return true for valid binary flag values", () => {
      expect(isSudokuValueFlag(0b1)).toBe(true);
      expect(isSudokuValueFlag(0b10)).toBe(true);
      expect(isSudokuValueFlag(0b100)).toBe(true);
      expect(isSudokuValueFlag(0b1000)).toBe(true);
      expect(isSudokuValueFlag(0b10000)).toBe(true);
      expect(isSudokuValueFlag(0b100000)).toBe(true);
      expect(isSudokuValueFlag(0b1000000)).toBe(true);
      expect(isSudokuValueFlag(0b10000000)).toBe(true);
      expect(isSudokuValueFlag(256)).toBe(true); // 0b100000000 = 256
    });

    it("should return false for invalid flag values", () => {
      expect(isSudokuValueFlag(0)).toBe(false);
      expect(isSudokuValueFlag(3)).toBe(false);
      expect(isSudokuValueFlag(5)).toBe(false);
      expect(isSudokuValueFlag(6)).toBe(false);
      expect(isSudokuValueFlag(7)).toBe(false);
      expect(isSudokuValueFlag(512)).toBe(false);
      expect(isSudokuValueFlag(1024)).toBe(false);
    });

    it("should return false for negative numbers", () => {
      expect(isSudokuValueFlag(-1)).toBe(false);
      expect(isSudokuValueFlag(-256)).toBe(false);
    });

    it("should return false for combined flags", () => {
      expect(isSudokuValueFlag(3)).toBe(false); // 1 | 2
      expect(isSudokuValueFlag(7)).toBe(false); // 1 | 2 | 4
      expect(isSudokuValueFlag(511)).toBe(false); // All flags combined
    });

    it("should return false for non-power-of-2 numbers", () => {
      expect(isSudokuValueFlag(10)).toBe(false);
      expect(isSudokuValueFlag(15)).toBe(false);
      expect(isSudokuValueFlag(100)).toBe(false);
      expect(isSudokuValueFlag(255)).toBe(false);
    });

    it("should work with all SudokuValueFlags values", () => {
      Object.values(SudokuValueFlags).forEach((flag) => {
        expect(isSudokuValueFlag(flag)).toBe(true);
      });
    });

    it("should work with all SudokuValueFlagsValues keys", () => {
      Object.keys(SudokuValueFlagsValues).forEach((key) => {
        expect(isSudokuValueFlag(Number(key))).toBe(true);
      });
    });
  });

  describe("Flag consistency", () => {
    it("should maintain bidirectional mapping consistency", () => {
      // Forward: value -> flag
      for (let i = 1; i <= 9; i++) {
        const flag = SudokuValueFlags[i as keyof typeof SudokuValueFlags];
        // Backward: flag -> value
        const value = SudokuValueFlagsValues[flag];
        expect(value).toBe(i);
      }
    });

    it("should have SudokuValueFlagSet contain exactly the same values as SudokuValueFlags", () => {
      const flagsArray = Object.values(SudokuValueFlags);
      const setArray = Array.from(SudokuValueFlagSet).sort((a, b) => a - b);
      expect(setArray).toEqual(flagsArray.sort((a, b) => a - b));
    });

    it("should have isSudokuValueFlag return true for all SudokuValueFlagSet members", () => {
      SudokuValueFlagSet.forEach((flag) => {
        expect(isSudokuValueFlag(flag)).toBe(true);
      });
    });

    it("should use sequential powers of 2 starting from 2^0", () => {
      for (let i = 1; i <= 9; i++) {
        const flag = SudokuValueFlags[i as keyof typeof SudokuValueFlags];
        expect(flag).toBe(2 ** (i - 1));
      }
    });
  });
});
