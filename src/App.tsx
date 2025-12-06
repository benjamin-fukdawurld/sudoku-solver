import { useState } from "react";
import "./App.css";
import SudokuArray from "./engine/SudokuArray";
import { SudokuContext } from "./SudokuContext";
import Sudoku from "./components/Sudoku";
import BackTracker from "./engine/ai/BackTracker";
import { SelectionContext } from "./SelectionContext";
import { Resolver } from "./components/Resolver/Resolver";

function App() {
  const [state, setState] = useState<{
    sudoku: SudokuArray;
    backTracker: BackTracker;
  }>({
    sudoku: new SudokuArray().parseJSON(`[
      [0,0,0,0,0,2,0,0,3],
      [0,4,0,0,0,1,6,0,7],
      [0,0,1,0,0,0,0,0,4],
      [0,8,0,1,0,0,0,0,0],
      [4,3,0,0,0,0,0,6,2],
      [0,0,0,7,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [6,0,9,8,0,7,3,0,0],
      [0,0,0,3,0,4,7,0,0]
    ]`),
    backTracker: new BackTracker(),
  });

  const [selection, setSelection] = useState<number | null>(null);

  return (
    <SudokuContext.Provider
      value={{
        sudoku: state.sudoku,
        backTracker: state.backTracker,
        invalidate: () => {
          setState((current) => ({ ...current }));
        },
      }}
    >
      <SelectionContext.Provider
        value={{
          selectedCell: selection,
          select: setSelection,
        }}
      >
        <div className="w-full h-full flex flex-row justify-center items-center">
          <div className="w-full h-full flex flex-row justify-center items-center">
            <Sudoku />
          </div>
          <div className="w-full h-full flex flex-row justify-center items-center">
            <Resolver />
          </div>
        </div>
      </SelectionContext.Provider>
    </SudokuContext.Provider>
  );
}

export default App;
