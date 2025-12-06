import clsx from "clsx";

type ResolverChipsProps = {
  index: number;
  value: number;
  color?: string;
  textColor?: string;
  onClick: () => void;
};

export function ResolverChip({
  index,
  value,
  color,
  textColor,
  onClick,
}: ResolverChipsProps) {
  return (
    <button
      className={clsx(
        [
          "rounded-md",
          "py-0.5",
          "px-1.5",
          "border-2",
          "border-transparent",
          "text-sm",
          "transition-all",
          "shadow-black/50",
          "shadow-md",
          "cursor-pointer",
          "font-medium",
          "scale-100",
          "hover:scale-105",
        ],
        {
          "bg-white": color === "white",
          "hover:bg-gray-100": color === "white",
          "bg-black": color === "black",
          "hover:bg-gray-900": color === "black",
          "bg-gray-500": color === "gray",
          "bg-blue-600": !color || color === "blue",
          "hover:bg-blue-700": !color || color === "blue",
          "bg-red-600": color === "red",
          "hover:bg-red-700": color === "red",
          "bg-green-600": color === "green",
          "hover:bg-green-700": color === "green",
          "bg-yellow-600": color === "yellow",
          "hover:bg-yellow-700": color === "yellow",
          "bg-purple-600": color === "purple",
          "hover:bg-purple-700": color === "purple",
        },
        {
          "text-white": !textColor || textColor === "white",
          "text-black": textColor === "black",
          "text-gray-500": textColor === "gray",
          "text-blue-600": !color || color === "blue",
          "text-red-600": color === "red",
          "text-green-600": color === "green",
          "text-yellow-600": color === "yellow",
          "text-purple-600": color === "purple",
        }
      )}
      onClick={onClick}
    >
      [{Math.floor(index / 9)},{index % 9}]: {value}
    </button>
  );
}
