import type { FunctionComponent } from "../../common/types";
import { JlptLevel, type Token } from "../../types/token";
import { useCurrentSubtitle } from "../../hooks/use-current-subtitle";
import { useJlptFilter, type JlptFilter } from "../../hooks/use-jlpt-filter";
import { FuriganaText } from "./FuriganaText";

const JLPT_LEVELS: Array<JlptLevel> = [JlptLevel.N5, JlptLevel.N4, JlptLevel.N3, JlptLevel.N2, JlptLevel.N1];

const JLPT_BADGE: Record<string, { text: string; bg: string }> = {
  N5: { text: "text-known-text", bg: "bg-known-bg" },
  N4: { text: "text-known-text", bg: "bg-known-bg" },
  N3: { text: "text-learning-text", bg: "bg-learning-bg" },
  N2: { text: "text-new-text", bg: "bg-new-bg" },
  N1: { text: "text-new-text", bg: "bg-new-bg" },
};

function matchesFilter(token: Token, filter: JlptFilter): boolean {
  if (token.pos === "記号") return false;
  if (filter === null) return true;
  if (!token.jlpt) return true;
  return parseInt(token.jlpt[1]!) >= parseInt(filter[1]!);
}

const JlptBadge = ({ level }: { level: string }): FunctionComponent => {
  const style = JLPT_BADGE[level] ?? { text: "text-ink-muted", bg: "bg-surface-alt" };
  return (
    <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${style.text} ${style.bg}`}>
      {level}
    </span>
  );
};

const WordCard = ({ token, colSpan }: { token: Token; colSpan?: boolean }): FunctionComponent => (
  <div
    className="flex gap-3 rounded-lg border border-border bg-surface p-3"
    style={{ borderLeftWidth: "3px", borderLeftColor: "var(--color-border)", gridColumn: colSpan ? "1 / -1" : undefined }}
  >
    <div className="min-w-0 flex-1">
      <div className="font-japanese text-[21px] text-ink">
        <FuriganaText tokens={[token]} />
      </div>
      {token.meanings && token.meanings.length > 0 && (
        <p className="mt-1 text-sm text-ink">{token.meanings[0]}</p>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="rounded bg-surface-alt px-2 py-0.5 text-[10px] text-ink-secondary">{token.pos}</span>
        {token.jlpt && <JlptBadge level={token.jlpt} />}
      </div>
    </div>
  </div>
);

const FilterBar = ({ filter, setFilter }: { filter: JlptFilter; setFilter: (f: JlptFilter) => void }): FunctionComponent => (
  <div className="flex flex-wrap items-center gap-1.5 border-b border-border-subtle px-4 py-2.5">
    <button
      className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${filter === null ? "bg-ink text-surface" : "text-ink-muted hover:text-ink"}`}
      type="button"
      onClick={() => { setFilter(null); }}
    >
      Tous
    </button>
    {JLPT_LEVELS.map((level) => (
      <button
        key={level}
        className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${filter === level ? "bg-brand text-surface" : "text-ink-muted hover:text-ink"}`}
        type="button"
        onClick={() => { setFilter(level); }}
      >
        {level}
      </button>
    ))}
  </div>
);

export const WordPanel = (): FunctionComponent => {
  const subtitle = useCurrentSubtitle();
  const { filter, setFilter } = useJlptFilter();

  const visibleTokens = subtitle
    ? subtitle.tokens.filter((token) => matchesFilter(token, filter))
    : [];

  return (
    <div className="flex flex-col border-t border-border bg-surface lg:border-l lg:border-t-0">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Phrase en cours</span>
          {subtitle && (
            <span className="text-xs text-ink-faint">{visibleTokens.length} mots</span>
          )}
        </div>
        {subtitle && (
          <p className="mt-2.5 font-japanese text-[19px] text-ink">{subtitle.text}</p>
        )}
      </div>

      <FilterBar filter={filter} setFilter={setFilter} />

      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-2.5">
          {visibleTokens.map((token, index) => (
            <WordCard
              key={index}
              colSpan={visibleTokens.length % 2 !== 0 && index === visibleTokens.length - 1}
              token={token}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
