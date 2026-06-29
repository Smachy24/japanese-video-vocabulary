import type { SrtEntry } from "../../types/subtitle";

function srtTimeToSeconds(time: string): number {
  const match = time.match(/(\d\d):(\d\d):(\d\d),(\d\d\d)/);
  if (!match || !match[1] || !match[2] || !match[3] || !match[4]) {
    throw new Error(`Invalid SRT time format: ${time}`);
  }

  const hours = +match[1];
  const minutes = +match[2];
  const seconds = +match[3];
  const milliseconds = +match[4];

  return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
}

export function parseSrt(srt: string): Array<SrtEntry> {
  const blocks = srt.trim().split(/\n\n+/);

  return blocks
    .filter((block) => block.includes("-->"))
    .map((block) => {
      const lines = block.split("\n");
      const timecodeIndex = lines.findIndex((l) => l.includes("-->"));
      const timecodeLine = lines[timecodeIndex]!;
      const text = lines.slice(timecodeIndex + 1).join("\n").trim();

      const match = timecodeLine.match(
        /(\d\d:\d\d:\d\d,\d\d\d) --> (\d\d:\d\d:\d\d,\d\d\d)/,
      );
      if (!match || !match[1] || !match[2]) {
        throw new Error(`Invalid SRT timecode: ${timecodeLine}`);
      }

      return {
        startTime: srtTimeToSeconds(match[1]),
        endTime: srtTimeToSeconds(match[2]),
        text,
      };
    });
}

