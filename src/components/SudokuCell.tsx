import clsx from "clsx";
import { useSelection } from "../hooks/useSelection";
import { useSudoku } from "../hooks/useSudoku";
import { SudokuCellOverlay } from "./SudokuCellOverlay";
import type { KeyboardEvent, MouseEvent } from "react";

type SudokuCellProps = {
  row: number;
  col: number;
};

export function SudokuCell(props: SudokuCellProps) {
  const { sudoku, erase, play } = useSudoku();
  const { selectedCell, select } = useSelection();
  const value = sudoku.at({ row: props.row, col: props.col });

  const index = props.row * 9 + props.col;
  const isSelected = selectedCell === index;

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    (event.target as HTMLDivElement).focus();
    if (isSelected) {
      select(null);
      return;
    }

    select(props.row * 9 + props.col);
  };

  const handleBlur = () => {
    if (selectedCell === index) {
      select(null);
    }
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      !["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(event.key)
    ) {
      return;
    }

    if (event.key === "0") {
      erase(props.row, props.col);
      return;
    }

    play(props.row, props.col, parseInt(event.key, 10));
  };

  return (
    <div
      className={clsx([
        "w-full h-full flex justify-center items-center relative cursor-pointer",
      ])}
      tabIndex={props.row * 9 + props.col}
      onClick={handleClick}
      onBlur={handleBlur}
      onKeyUp={handleKeyUp}
    >
      {value || <SudokuCellOverlay row={props.row} col={props.col} />}
    </div>
  );
}
