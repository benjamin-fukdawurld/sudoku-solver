import { useSudoku } from "../hooks/useSudoku";

type SudokuCellOverlayProps = {
  row: number;
  col: number;
};

export function SudokuCellOverlay(props: SudokuCellOverlayProps) {
  const { possibilities, singlePossibilities, uniquePossibilities } =
    useSudoku();

  const index = props.row * 9 + props.col;
  const possibleValues = possibilities.get(index) || [];
  const singleValue = singlePossibilities.get(index);
  const uniqueValue = uniquePossibilities.get(index);

  const textFormatter = (value: number) => {
    if (value === singleValue || value === uniqueValue) {
      return "text-green-700 font-bold text-sm animate-pulse";
    }

    switch (value) {
      case 1:
        return "text-violet-500 text-xs";
      case 2:
        return "text-blue-500 text-xs";
      case 3:
        return "text-cyan-500 text-xs";
      case 4:
        return "text-green-500 text-xs";
      case 5:
        return "text-yellow-500 text-xs";
      case 6:
        return "text-orange-500 text-xs";
      case 7:
        return "text-red-500 text-xs";
      case 8:
        return "text-pink-500 text-xs";
      case 9:
        return "text-purple-500 text-xs";
      default:
        return "text-current text-xs";
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        display: "grid",
        gridTemplateRows: "repeat(3, 1fr)",
        gridTemplateColumns: "repeat(3, 1fr)",
      }}
    >
      {possibleValues.map((value) => (
        <div
          key={value}
          className={textFormatter(value)}
          style={{
            gridRow: Math.floor((value - 1) / 3) + 1,
            gridColumn: ((value - 1) % 3) + 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {value}
        </div>
      ))}
    </div>
  );
}
