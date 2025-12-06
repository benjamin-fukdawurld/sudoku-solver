import clsx from "clsx";
import { useSelection } from "../hooks/useSelection";
import { SudokuCell } from "./SudokuCell";
import { useSudoku } from "../hooks/useSudoku";

function Sudoku() {
  const { sudoku, singlePossibilities, uniquePossibilities } = useSudoku();
  const { selectedCell, selectedRow, selectedColumn, selectedSquare } =
    useSelection();

  return (
    <table>
      <tbody>
        {Array.from({ length: 9 }).map((_, rowIndex) => {
          const squareIndex = Math.floor(rowIndex / 3) * 3;
          const row = sudoku.row(rowIndex);

          return (
            <tr key={rowIndex}>
              {Array.from({ length: 9 }).map((_, colIndex) => {
                const index = colIndex + rowIndex * 9;
                const isSelected = selectedCell === index;
                const selectedArea =
                  selectedRow === rowIndex ||
                  selectedColumn === colIndex ||
                  selectedSquare === squareIndex + Math.floor(colIndex / 3);

                const col = sudoku.column(colIndex);
                const square = sudoku.square(squareIndex);
                const isValid = row.isValid || col.isValid || square.isValid;

                const singleValue = singlePossibilities.get(index);
                const uniqueValue = uniquePossibilities.get(index);

                return (
                  <td
                    key={colIndex}
                    className={clsx(["w-15", "h-15"], {
                      "bg-sky-300/10":
                        !singleValue && !uniqueValue && selectedArea,
                      border: !isSelected,
                      "border-2": isSelected,
                      "border-l-2": !isSelected && colIndex % 3 === 0,
                      "border-t-2": !isSelected && rowIndex % 3 === 0,
                      "border-r-2": !isSelected && colIndex === 8,
                      "border-b-2": !isSelected && rowIndex === 8,
                      "border-solid": !isSelected,
                      "border-inset": isSelected,
                      "border-blue-500": !isValid && isSelected,
                      "bg-green-500/10": isValid,
                      "bg-emerald-500/25": singleValue || uniqueValue,
                      "font-bold": selectedArea,
                      "text-blue-700/75": selectedArea,
                    })}
                  >
                    <SudokuCell row={rowIndex} col={colIndex} />
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Sudoku;
