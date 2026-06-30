import type { FunctionComponent } from "../../common/types";
import type { Token } from "../../types/token";
import { useCurrentSubtitle } from "../../hooks/use-current-subtitle";
import { FuriganaText } from "./FuriganaText";

const WordCard = ({ token }: { token: Token }) => (
  <div className="flex min-w-0 flex-col items-center gap-1 rounded-lg bg-gray-800 px-3 py-2">
    <span className="text-base text-white">
      <FuriganaText tokens={[token]} />
    </span>
    <span className="text-xs text-gray-400">{token.pos}</span>
  </div>
);

export const WordPanel = (): FunctionComponent => {
  const subtitle = useCurrentSubtitle();

  return (
    <div className="min-h-24 border-t border-gray-700 bg-gray-900 px-4 py-3">
      {subtitle ? (
        <div className="flex flex-wrap gap-2">
          {subtitle.tokens.map((token, index) => (
            <WordCard key={index} token={token} />
          ))}
        </div>
      ) : null}
    </div>
  );
};
