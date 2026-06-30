import type { SubtitleAnalysis } from "../../types/subtitle";

export function findCurrentSubtitle(
  subtitles: Array<SubtitleAnalysis>,
  currentTime: number
): SubtitleAnalysis | null {
  let lo = 0;
  let hi = subtitles.length - 1;

  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const sub = subtitles[mid]!;

    if (currentTime < sub.startTime) {
      hi = mid - 1;
    } else if (currentTime >= sub.endTime) {
      lo = mid + 1;
    } else {
      return sub;
    }
  }

  return null;
}
