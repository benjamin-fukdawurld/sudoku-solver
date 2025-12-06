import { createContext } from "react";

export const SelectionContext = createContext<{
  selectedCell: number | null;
  select: (cell: number | null) => void;
} | null>(null);
