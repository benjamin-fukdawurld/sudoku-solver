import { createContext } from "react";
import SudokuArray from "./engine/SudokuArray";
import type BackTracker from "./engine/ai/BackTracker";

export const SudokuContext = createContext<{
  sudoku: SudokuArray;
  backTracker: BackTracker;
  invalidate: () => void;
} | null>(null);
