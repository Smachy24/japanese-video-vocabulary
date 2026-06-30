import type { FunctionComponent } from "../../common/types";
import type { Token } from "../../types/token";
import { useCurrentSubtitle } from "../../hooks/use-current-subtitle";
import { FuriganaText } from "./FuriganaText";

const JLPT_COLORS: Record<string, string> = {
  N5: "bg-green-700",
  N4: "bg-teal-700",
  N3: "bg-blue-700",
  N2: "bg-purple-700",
  N1: "bg-red-700",
};

const WordCard = ({ token }: { token: Token }): FunctionComponent => (
  <div className="flex min-w-0 overflow-hidden rounded-lg bg-gray-800">
    {/* Status bar — colorée en Story 12 */}
    <div className="w-1 shrink-0 bg-gray-600" />
    <div className="flex flex-col gap-1 px-3 py-2">
      <span className="text-base font-medium text-white">
        <FuriganaText tokens={[token]} />
      </span>
      {token.readingSurfaceHiragana && (
        <span className="text-xs text-gray-300">{token.readingSurfaceHiragana}</span>
      )}
      {token.meanings && token.meanings.length > 0 && (
        <span className="max-w-40 truncate text-xs text-gray-400">{token.meanings[0]}</span>
      )}
      <div className="flex flex-wrap gap-1">
        {token.jlpt && (
          <span className={`rounded px-1.5 py-0.5 text-xs font-semibold text-white ${JLPT_COLORS[token.jlpt] ?? "bg-gray-600"}`}>
            {token.jlpt}
          </span>
        )}
        <span className="rounded bg-gray-700 px-1.5 py-0.5 text-xs text-gray-300">
          {token.pos}
        </span>
      </div>
    </div>
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
