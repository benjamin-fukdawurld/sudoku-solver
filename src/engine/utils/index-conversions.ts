export function sudokuIndexToRowCol(index: number): {
  row: number;
  col: number;
} {
  return { row: Math.floor(index / 9), col: index % 9 };
}

export function rowColToSudokuIndex(row: number, col: number): number {
  return row * 9 + col;
}

export function sudokuIndexToSquareIndex(index: number): number {
  const { row, col } = sudokuIndexToRowCol(index);
  return getSquareIndex(row, col);
}

export function getSquareIndex(row: number, col: number): number {
  return Math.floor(row / 3) * 3 + Math.floor(col / 3);
}

export function getSquareCellIndex(row: number, col: number): number {
  return (row % 3) * 3 + (col % 3);
}

export function sudokuIndexToSquareLocalIndex(index: number): number {
  const { row, col } = sudokuIndexToRowCol(index);
  return getSquareCellIndex(row, col);
}
