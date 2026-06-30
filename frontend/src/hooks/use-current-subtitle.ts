import type { SubtitleAnalysis } from "../types/subtitle";
import { findCurrentSubtitle } from "../features/player/subtitle-search";
import { usePlayerStore } from "../store/player-store";
import { useSubtitleStore } from "../store/subtitle-store";

export function useCurrentSubtitle(): SubtitleAnalysis | null {
  const currentTime = usePlayerStore((s) => s.currentTime);
  const activeSubtitles = useSubtitleStore((s) => s.activeSubtitles);

  return findCurrentSubtitle(activeSubtitles, currentTime);
}
