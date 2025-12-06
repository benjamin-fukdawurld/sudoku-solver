import {
  ArrowRightIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  PauseIcon,
  PlayIcon,
  StopIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useSudoku } from "../../hooks/useSudoku";

function ResolverAction({
  children,
  ...props
}: { children: React.ReactNode } & React.ComponentProps<"button">) {
  return (
    <button
      className={clsx([
        "w-10",
        "p-2",
        "bg-blue-600",
        "hover:bg-blue-700",
        "text-white",
        "rounded-full",
        "cursor-pointer",
        "shadow-black/50",
        "shadow-md",
      ])}
      {...props}
    >
      {children}
    </button>
  );
}

export function ResolverToolbar() {
  const {
    resolverState,
    startResolver,
    stopResolver,
    pauseResolver,
    undo,
    redo,
    step,
    backTracker,
    sudoku,
  } = useSudoku();

  return (
    <div className="my-2 flex justify-center items-center gap-2">
      <ResolverAction
        title="undo"
        disabled={!backTracker.played.length}
        onClick={undo}
      >
        <ArrowUturnLeftIcon />
      </ResolverAction>
      <ResolverAction
        title="redo"
        disabled={!backTracker.undone.length}
        onClick={redo}
      >
        <ArrowUturnRightIcon />
      </ResolverAction>
      <ResolverAction
        title="next step"
        disabled={sudoku.isValid}
        onClick={step}
      >
        <ArrowRightIcon />
      </ResolverAction>
      <ResolverAction
        title="pause"
        disabled={resolverState !== "playing"}
        onClick={pauseResolver}
      >
        <PauseIcon />
      </ResolverAction>
      <ResolverAction
        title="play"
        disabled={resolverState === "playing"}
        onClick={startResolver}
      >
        <PlayIcon />
      </ResolverAction>
      <ResolverAction
        title="stop"
        disabled={resolverState === "stopped"}
        onClick={stopResolver}
      >
        <StopIcon />
      </ResolverAction>
    </div>
  );
}
