import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SudokuContext } from "../SudokuContext";
import {
  getAllPossibleValues,
  getAllUniquePossibilities,
  getSinglePossibilities,
} from "../ai/utils";

export function useSudoku() {
  const context = useContext(SudokuContext);
  const [resolverState, setResolverState] = useState<
    "stopped" | "playing" | "paused"
  >("stopped");
  const resolverInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  if (!context) {
    throw new Error("useSudoku must be used within a SudokuContext.Provider");
  }

  const erase = (row: number, column: number) => {
    const index = row * 9 + column;

    context.sudoku.set(index, 0);
    context.backTracker.erase(index);
    context.invalidate();
  };

  const play = useCallback(
    (row: number, column: number, value: number) => {
      const index = row * 9 + column;

      context.sudoku.set(index, value);
      context.backTracker.play(index, value);
      context.invalidate();
    },
    [context]
  );

  const undo = useCallback(() => {
    const undone = context.backTracker.undo();
    if (undone) {
      const [index] = undone;
      context.sudoku.set(index, 0);
      context.invalidate();
    }
  }, [context]);

  const redo = useCallback(() => {
    const redone = context.backTracker.redo();
    if (redone) {
      const [index, value] = redone;
      context.sudoku.set(index, value);
      context.invalidate();
    }
  }, [context]);

  const discard = useCallback(
    (row: number, column: number, value: number) => {
      const index = row * 9 + column;
      context.backTracker.discard(index, value);
      context.sudoku.set(index, 0);
      context.invalidate();
    },
    [context]
  );

  const undiscard = useCallback(
    (row: number, column: number, value: number) => {
      const index = row * 9 + column;
      context.backTracker.undiscard(index, value);
    },
    [context]
  );

  const possibilitiesArray = useMemo(
    () => getAllPossibleValues(context.sudoku),
    [context]
  );

  const possibilities = useMemo(
    () => new Map(possibilitiesArray),
    [possibilitiesArray]
  );

  const singlePossibilitiesArray = useMemo(
    () => getSinglePossibilities(possibilitiesArray),
    [possibilitiesArray]
  );

  const singlePossibilities = useMemo(
    () => new Map(singlePossibilitiesArray),
    [singlePossibilitiesArray]
  );

  const uniquePossibilitiesArray = useMemo(() => {
    return getAllUniquePossibilities(context.sudoku, possibilities);
  }, [context.sudoku, possibilities]);

  const uniquePossibilities = useMemo(
    () =>
      new Map<number, number>(uniquePossibilitiesArray as [number, number][]),
    [uniquePossibilitiesArray]
  );

  const startResolver = useCallback(() => {
    setResolverState("playing");
  }, []);

  const pauseResolver = useCallback(() => {
    setResolverState("paused");
  }, []);

  const stopResolver = useCallback(() => {
    setResolverState("stopped");
    context.backTracker.clear();
    context.invalidate();
  }, [context]);

  const step = useCallback(() => {
    if (resolverState === "stopped") {
      setResolverState("paused");
    }

    if (singlePossibilities.size > 0) {
      let played = 0;
      for (const [index, value] of singlePossibilities) {
        if (context.backTracker.discarded.get(index)?.has(value)) {
          continue;
        }
        play(Math.floor(index / 9), index % 9, value);
        played++;
      }

      if (played > 0) {
        return;
      }
    }

    if (uniquePossibilitiesArray.length > 0) {
      for (const [index, value] of uniquePossibilitiesArray) {
        if (context.backTracker.discarded.get(index)?.has(value)) {
          continue;
        }
        play(Math.floor(index / 9), index % 9, value);
        return;
      }
    }

    for (const [index, values] of possibilitiesArray) {
      const discarded = context.backTracker.discarded.get(index);
      let valueIndex = 0;
      if (!discarded) {
        play(Math.floor(index / 9), index % 9, values[0]);
        return;
      }
      while (discarded && valueIndex < values.length) {
        const value = values[valueIndex];
        if (!discarded.has(value)) {
          play(Math.floor(index / 9), index % 9, value);
          return;
        }
        valueIndex++;
      }
    }

    const lastPlayed = context.backTracker.undo();
    if (lastPlayed) {
      const [index, value] = lastPlayed;
      discard(Math.floor(index / 9), index % 9, value);
    }
  }, [
    singlePossibilities,
    uniquePossibilitiesArray,
    possibilitiesArray,
    play,
    discard,
    context,
    resolverState,
  ]);

  useEffect(() => {
    if (resolverState === "paused") {
      if (resolverInterval.current) {
        clearInterval(resolverInterval.current);
        resolverInterval.current = null;
      }
      return;
    }

    if (resolverState === "stopped") {
      if (resolverInterval.current) {
        clearInterval(resolverInterval.current);
        resolverInterval.current = null;
      }

      return;
    }

    resolverInterval.current = setInterval(() => {
      if (context.sudoku.isValid) {
        stopResolver();
        return;
      }

      step();
    }, 500);
  }, [resolverState, stopResolver]);

  return {
    ...context,
    play,
    erase,
    undo,
    redo,
    discard,
    undiscard,
    possibilities,
    singlePossibilities,
    uniquePossibilities,
    resolverState,
    step,
    startResolver,
    stopResolver,
    pauseResolver,
  };
}
