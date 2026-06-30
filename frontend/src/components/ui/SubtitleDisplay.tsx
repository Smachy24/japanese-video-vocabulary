import type { FunctionComponent } from "../../common/types";
import { useCurrentSubtitle } from "../../hooks/use-current-subtitle";
import { FuriganaText } from "./FuriganaText";

export const SubtitleDisplay = (): FunctionComponent => {
  const subtitle = useCurrentSubtitle();

  if (!subtitle) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-16 flex justify-center px-4">
      <p className="rounded bg-black/70 px-3 py-1 text-center text-xl font-medium text-white">
        <FuriganaText tokens={subtitle.tokens} />
      </p>
    </div>
  );
};
