import type { FunctionComponent } from "../../common/types";
import { useCurrentSubtitle } from "../../hooks/use-current-subtitle";
import { FuriganaText } from "./FuriganaText";

export const SubtitleDisplay = (): FunctionComponent => {
  const subtitle = useCurrentSubtitle();

  if (!subtitle) return null;

  return (
    <div
      className="subtitle-overlay pointer-events-none absolute inset-x-0 bottom-0 text-center"
      style={{ background: "linear-gradient(to top, rgba(8,7,5,0.85), transparent)" }}
    >
      <p className="px-8 pb-16 pt-10 font-japanese text-[28px] font-medium leading-loose text-white">
        <FuriganaText tokens={subtitle.tokens} />
      </p>
    </div>
  );
};
