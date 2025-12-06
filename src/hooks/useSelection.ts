import { useContext, useMemo } from "react";
import { SelectionContext } from "../SelectionContext";

export function useSelection() {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error(
      "useSelection must be used within a SelectionContext.Provider"
    );
  }

  const selectedRow = useMemo(() => {
    if (context.selectedCell === null) return null;
    return Math.floor(context.selectedCell / 9);
  }, [context]);

  const selectedColumn = useMemo(() => {
    if (context.selectedCell === null) return null;
    return context.selectedCell % 9;
  }, [context]);

  const selectedSquare = useMemo(() => {
    if (context.selectedCell === null) return null;
    const row = Math.floor(context.selectedCell / 9);
    const col = context.selectedCell % 9;
    return Math.floor(row / 3) * 3 + Math.floor(col / 3);
  }, [context]);

  return {
    ...context,
    selectedRow,
    selectedColumn,
    selectedSquare,
  };
}
