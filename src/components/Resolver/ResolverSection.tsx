import clsx from "clsx";
import { ResolverChip } from "./ResolverChip";

type ResolverSectionProps = {
  title: string;
  titleAs?: "h2" | "h3" | "h4" | "h5" | "h6";
  values: [number, number][];
  color?: string;
  textColor?: string;
  onClick: (index: number, value: number) => void;
};

export function ResolverSection({
  title,
  titleAs,
  values,
  color,
  textColor,
  onClick,
}: ResolverSectionProps) {
  const Tag = titleAs || "h3";

  return (
    <section className="my-2 px-1">
      <Tag
        className={clsx({
          "font-bold": ["h2", "h3"].includes(Tag),
          "font-semibold": ["h4", "h5", "h6"].includes(Tag),
          "text-xl": Tag === "h2",
          "text-lg": Tag === "h3",
          "text-md": Tag === "h4",
        })}
      >
        {title}
      </Tag>
      <ul className="pl-4 flex flex-row flex-wrap gap-2 mt-2 h-24 overflow-y-scroll">
        {values.length > 0 ? (
          values.map(([index, value]) => (
            <li key={[index, value].join("-")}>
              <ResolverChip
                index={index}
                value={value}
                color={color}
                textColor={textColor}
                onClick={() => onClick?.(index, value)}
              />
            </li>
          ))
        ) : (
          <li className="text-current/50">No items to display.</li>
        )}
      </ul>
    </section>
  );
}
