import clsx from "clsx";
import { useSudoku } from "../../hooks/useSudoku";
import { ResolverSection } from "./ResolverSection";
import { ResolverToolbar } from "./ResolverToolbar";

export function Resolver() {
  const {
    backTracker,
    possibilities,
    singlePossibilities,
    uniquePossibilities,
  } = useSudoku();

  return (
    <div
      className={clsx([
        "relative",
        "flex",
        "flex-col",
        "my-6",
        "bg-white",
        "shadow-sm",
        "shadow-black/50",
        "border",
        "border-slate-200",
        "rounded-lg",
        "w-8/12",
        "p-4",
      ])}
    >
      <h2 className="text-xl font-bold">Sudoku Resolver</h2>
      <p className="px-2">Total empty cells: {possibilities.size}</p>
      <p className="px-2">
        Cells with single possibilities: {singlePossibilities.size}
      </p>
      <ResolverSection
        title="Single Possibilities"
        values={Array.from(singlePossibilities)}
        onClick={() => {}}
      />
      <ResolverSection
        title="Unique Possibilities"
        values={Array.from(uniquePossibilities)}
        onClick={() => {}}
      />
      <div>
        <ResolverSection
          title="Backtracking Steps"
          values={backTracker.played}
          color="green"
          onClick={() => {}}
        />
        <div className="pl-2">
          <ResolverSection
            title="Backtracking Attempts"
            titleAs="h4"
            values={Array.from(backTracker.discarded).reduce((acc, current) => {
              const [index, values] = current;
              values.forEach((value) => {
                acc.push([index, value]);
              });
              return acc;
            }, [] as [number, number][])}
            color="red"
            onClick={() => {}}
          />
        </div>
      </div>
      <ResolverToolbar />
    </div>
  );
}

export default Resolver;
