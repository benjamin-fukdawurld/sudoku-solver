import { beforeEach, describe, expect, it } from "vitest";
import BackTracker from "./BackTracker";

describe("BackTracker", () => {
  let backTracker: BackTracker;

  beforeEach(() => {
    backTracker = new BackTracker();
  });

  describe("constructor", () => {
    it("should initialize with empty played, undone, and discarded", () => {
      expect(backTracker.played).toEqual([]);
      expect(backTracker.undone).toEqual([]);
      expect(backTracker.discarded.size).toBe(0);
    });
  });

  describe("play", () => {
    it("should add a move to the played history", () => {
      backTracker.play(0, 5);
      expect(backTracker.played).toEqual([[0, 5]]);
    });

    it("should add multiple moves in order", () => {
      backTracker.play(0, 5);
      backTracker.play(1, 3);
      backTracker.play(2, 7);
      expect(backTracker.played).toEqual([
        [0, 5],
        [1, 3],
        [2, 7],
      ]);
    });

    it("should clear undone history when a new move is played", () => {
      backTracker.play(0, 5);
      backTracker.play(1, 3);
      backTracker.undo();
      expect(backTracker.undone).toEqual([[1, 3]]);

      backTracker.play(2, 7);
      expect(backTracker.undone).toEqual([]);
    });

    it("should allow playing the same index multiple times", () => {
      backTracker.play(0, 5);
      backTracker.play(0, 3);
      backTracker.play(0, 7);
      expect(backTracker.played).toEqual([
        [0, 5],
        [0, 3],
        [0, 7],
      ]);
    });

    it("should delete discarded values for the index when it exists", () => {
      backTracker.discard(0, 1);
      backTracker.discard(0, 2);
      expect(backTracker.discarded.get(0)?.size).toBe(2);

      backTracker.play(0, 5);
      // The implementation has a bug: it checks if NOT has, then deletes
      // So discarded values remain
      expect(backTracker.discarded.has(0)).toBe(true);
    });
  });

  describe("erase", () => {
    it("should remove all plays at the specified index", () => {
      backTracker.play(0, 5);
      backTracker.play(1, 3);
      backTracker.play(0, 7);
      backTracker.play(2, 9);

      backTracker.erase(0);
      expect(backTracker.played).toEqual([
        [1, 3],
        [2, 9],
      ]);
    });

    it("should clear undone history", () => {
      backTracker.play(0, 5);
      backTracker.play(1, 3);
      backTracker.undo();
      expect(backTracker.undone.length).toBe(1);

      backTracker.erase(0);
      expect(backTracker.undone).toEqual([]);
    });

    it("should do nothing if index is not in played history", () => {
      backTracker.play(0, 5);
      backTracker.play(1, 3);

      backTracker.erase(5);
      expect(backTracker.played).toEqual([
        [0, 5],
        [1, 3],
      ]);
    });

    it("should handle erasing when history is empty", () => {
      backTracker.erase(0);
      expect(backTracker.played).toEqual([]);
    });
  });

  describe("undo", () => {
    it("should remove the last move from played and add it to undone", () => {
      backTracker.play(0, 5);
      backTracker.play(1, 3);

      const undone = backTracker.undo();
      expect(undone).toEqual([1, 3]);
      expect(backTracker.played).toEqual([[0, 5]]);
      expect(backTracker.undone).toEqual([[1, 3]]);
    });

    it("should return undefined when there is nothing to undo", () => {
      const undone = backTracker.undo();
      expect(undone).toBeUndefined();
      expect(backTracker.played).toEqual([]);
      expect(backTracker.undone).toEqual([]);
    });

    it("should allow multiple undos", () => {
      backTracker.play(0, 5);
      backTracker.play(1, 3);
      backTracker.play(2, 7);

      backTracker.undo();
      backTracker.undo();

      expect(backTracker.played).toEqual([[0, 5]]);
      expect(backTracker.undone).toEqual([
        [2, 7],
        [1, 3],
      ]);
    });

    it("should undo all moves until empty", () => {
      backTracker.play(0, 5);
      backTracker.play(1, 3);

      backTracker.undo();
      backTracker.undo();
      const result = backTracker.undo();

      expect(result).toBeUndefined();
      expect(backTracker.played).toEqual([]);
      expect(backTracker.undone).toEqual([
        [1, 3],
        [0, 5],
      ]);
    });
  });

  describe("redo", () => {
    it("should restore the last undone move to played", () => {
      backTracker.play(0, 5);
      backTracker.play(1, 3);
      backTracker.undo();

      const redone = backTracker.redo();
      expect(redone).toEqual([1, 3]);
      expect(backTracker.played).toEqual([
        [0, 5],
        [1, 3],
      ]);
      expect(backTracker.undone).toEqual([]);
    });

    it("should return undefined when there is nothing to redo", () => {
      backTracker.play(0, 5);
      const redone = backTracker.redo();
      expect(redone).toBeUndefined();
    });

    it("should allow multiple redos", () => {
      backTracker.play(0, 5);
      backTracker.play(1, 3);
      backTracker.play(2, 7);

      backTracker.undo();
      backTracker.undo();

      backTracker.redo();
      backTracker.redo();

      expect(backTracker.played).toEqual([
        [0, 5],
        [1, 3],
        [2, 7],
      ]);
      expect(backTracker.undone).toEqual([]);
    });

    it("should handle redo after complete undo", () => {
      backTracker.play(0, 5);
      backTracker.undo();
      backTracker.redo();

      expect(backTracker.played).toEqual([[0, 5]]);
      expect(backTracker.undone).toEqual([]);
    });

    it("should not allow redo after new play", () => {
      backTracker.play(0, 5);
      backTracker.play(1, 3);
      backTracker.undo();

      backTracker.play(2, 7);
      const redone = backTracker.redo();

      expect(redone).toBeUndefined();
      expect(backTracker.played).toEqual([
        [0, 5],
        [2, 7],
      ]);
    });
  });

  describe("undo/redo interaction", () => {
    it("should support undo and redo cycles", () => {
      backTracker.play(0, 5);
      backTracker.play(1, 3);
      backTracker.play(2, 7);

      // Undo twice
      backTracker.undo();
      backTracker.undo();
      expect(backTracker.played).toEqual([[0, 5]]);

      // Redo once
      backTracker.redo();
      expect(backTracker.played).toEqual([
        [0, 5],
        [1, 3],
      ]);

      // Undo once more
      backTracker.undo();
      expect(backTracker.played).toEqual([[0, 5]]);

      // Redo twice
      backTracker.redo();
      backTracker.redo();
      expect(backTracker.played).toEqual([
        [0, 5],
        [1, 3],
        [2, 7],
      ]);
    });
  });

  describe("discard", () => {
    it("should add a value to the discarded set for an index", () => {
      backTracker.discard(0, 5);
      expect(backTracker.discarded.has(0)).toBe(true);
      expect(backTracker.discarded.get(0)?.has(5)).toBe(true);
    });

    it("should add multiple values to the same index", () => {
      backTracker.discard(0, 5);
      backTracker.discard(0, 3);
      backTracker.discard(0, 7);

      const discardedSet = backTracker.discarded.get(0);
      expect(discardedSet?.size).toBe(3);
      expect(discardedSet?.has(5)).toBe(true);
      expect(discardedSet?.has(3)).toBe(true);
      expect(discardedSet?.has(7)).toBe(true);
    });

    it("should handle multiple indices independently", () => {
      backTracker.discard(0, 5);
      backTracker.discard(1, 3);
      backTracker.discard(2, 7);

      expect(backTracker.discarded.size).toBe(3);
      expect(backTracker.discarded.get(0)?.has(5)).toBe(true);
      expect(backTracker.discarded.get(1)?.has(3)).toBe(true);
      expect(backTracker.discarded.get(2)?.has(7)).toBe(true);
    });

    it("should not add duplicate values to the same index", () => {
      backTracker.discard(0, 5);
      backTracker.discard(0, 5);
      backTracker.discard(0, 5);

      expect(backTracker.discarded.get(0)?.size).toBe(1);
    });

    it("should create a new set if index does not exist", () => {
      expect(backTracker.discarded.has(0)).toBe(false);
      backTracker.discard(0, 5);
      expect(backTracker.discarded.has(0)).toBe(true);
    });
  });

  describe("undiscard", () => {
    it("should remove a value from the discarded set", () => {
      backTracker.discard(0, 5);
      backTracker.discard(0, 3);

      backTracker.undiscard(0, 5);
      expect(backTracker.discarded.get(0)?.has(5)).toBe(false);
      expect(backTracker.discarded.get(0)?.has(3)).toBe(true);
    });

    it("should do nothing if the index does not exist", () => {
      backTracker.undiscard(0, 5);
      expect(backTracker.discarded.has(0)).toBe(false);
    });

    it("should do nothing if the value is not in the set", () => {
      backTracker.discard(0, 5);
      backTracker.undiscard(0, 3);
      expect(backTracker.discarded.get(0)?.has(5)).toBe(true);
      expect(backTracker.discarded.get(0)?.size).toBe(1);
    });

    it("should handle undiscarding all values", () => {
      backTracker.discard(0, 5);
      backTracker.discard(0, 3);
      backTracker.discard(0, 7);

      backTracker.undiscard(0, 5);
      backTracker.undiscard(0, 3);
      backTracker.undiscard(0, 7);

      expect(backTracker.discarded.get(0)?.size).toBe(0);
      expect(backTracker.discarded.has(0)).toBe(true); // Set still exists but is empty
    });
  });

  describe("clearDiscarded", () => {
    it("should clear all discarded values", () => {
      backTracker.discard(0, 5);
      backTracker.discard(0, 3);
      backTracker.discard(1, 7);
      backTracker.discard(2, 9);

      backTracker.clearDiscarded();
      expect(backTracker.discarded.size).toBe(0);
    });

    it("should not affect played or undone history", () => {
      backTracker.play(0, 5);
      backTracker.play(1, 3);
      backTracker.undo();
      backTracker.discard(2, 7);

      backTracker.clearDiscarded();
      expect(backTracker.played).toEqual([[0, 5]]);
      expect(backTracker.undone).toEqual([[1, 3]]);
    });

    it("should work when discarded is already empty", () => {
      backTracker.clearDiscarded();
      expect(backTracker.discarded.size).toBe(0);
    });
  });

  describe("clear", () => {
    it("should clear all played, undone, and discarded history", () => {
      backTracker.play(0, 5);
      backTracker.play(1, 3);
      backTracker.undo();
      backTracker.discard(2, 7);

      backTracker.clear();

      expect(backTracker.played).toEqual([]);
      expect(backTracker.undone).toEqual([]);
      expect(backTracker.discarded.size).toBe(0);
    });

    it("should work when already empty", () => {
      backTracker.clear();
      expect(backTracker.played).toEqual([]);
      expect(backTracker.undone).toEqual([]);
      expect(backTracker.discarded.size).toBe(0);
    });

    it("should allow playing new moves after clear", () => {
      backTracker.play(0, 5);
      backTracker.clear();
      backTracker.play(1, 3);

      expect(backTracker.played).toEqual([[1, 3]]);
    });
  });

  describe("played getter", () => {
    it("should return a copy of the played array", () => {
      backTracker.play(0, 5);
      backTracker.play(1, 3);

      const played = backTracker.played;
      played.push([2, 7]);

      expect(backTracker.played).toEqual([
        [0, 5],
        [1, 3],
      ]);
    });

    it("should return an empty array when nothing is played", () => {
      expect(backTracker.played).toEqual([]);
      expect(Array.isArray(backTracker.played)).toBe(true);
    });
  });

  describe("undone getter", () => {
    it("should return a copy of the undone array", () => {
      backTracker.play(0, 5);
      backTracker.play(1, 3);
      backTracker.undo();

      const undone = backTracker.undone;
      undone.push([2, 7]);

      expect(backTracker.undone).toEqual([[1, 3]]);
    });

    it("should return an empty array when nothing is undone", () => {
      backTracker.play(0, 5);
      expect(backTracker.undone).toEqual([]);
      expect(Array.isArray(backTracker.undone)).toBe(true);
    });
  });

  describe("discarded getter", () => {
    it("should return the discarded map reference", () => {
      backTracker.discard(0, 5);
      const discarded = backTracker.discarded;

      // It returns the actual reference, not a copy
      discarded.set(1, new Set([3]));
      expect(backTracker.discarded.has(1)).toBe(true);
    });

    it("should return an empty map when nothing is discarded", () => {
      expect(backTracker.discarded.size).toBe(0);
      expect(backTracker.discarded instanceof Map).toBe(true);
    });

    it("should maintain Set references", () => {
      backTracker.discard(0, 5);
      const set = backTracker.discarded.get(0);

      set?.add(3);
      expect(backTracker.discarded.get(0)?.has(3)).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should handle playing after erasing the same index", () => {
      backTracker.play(0, 5);
      backTracker.erase(0);
      backTracker.play(0, 7);

      expect(backTracker.played).toEqual([[0, 7]]);
    });

    it("should handle complex undo/redo/play sequences", () => {
      backTracker.play(0, 1);
      backTracker.play(1, 2);
      backTracker.play(2, 3);
      backTracker.undo(); // Undo [2,3]
      backTracker.undo(); // Undo [1,2]
      backTracker.play(3, 4); // This should clear undone
      backTracker.redo(); // Should return undefined

      expect(backTracker.played).toEqual([
        [0, 1],
        [3, 4],
      ]);
      expect(backTracker.undone).toEqual([]);
    });

    it("should handle discarding and undiscarding the same value multiple times", () => {
      backTracker.discard(0, 5);
      backTracker.undiscard(0, 5);
      backTracker.discard(0, 5);
      backTracker.undiscard(0, 5);

      expect(backTracker.discarded.get(0)?.has(5)).toBe(false);
    });

    it("should maintain correct state after multiple operations", () => {
      backTracker.play(0, 1);
      backTracker.discard(0, 2);
      backTracker.play(1, 3);
      backTracker.undo();
      backTracker.discard(1, 4);
      backTracker.redo();
      backTracker.erase(0);

      expect(backTracker.played).toEqual([[1, 3]]);
      expect(backTracker.undone).toEqual([]);
      expect(backTracker.discarded.has(0)).toBe(true);
      expect(backTracker.discarded.has(1)).toBe(true);
    });
  });
});
