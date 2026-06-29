import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSubtitleStore } from "../../src/store/subtitle-store";
import { db } from "../../src/common/db";

const MULTI_LINE_SRT = `1
00:00:01,000 --> 00:00:03,000
今日は学校へ行きます

2
00:00:04,000 --> 00:00:06,000
明日は休みです`;

const SINGLE_LINE_SRT = `1
00:00:01,000 --> 00:00:03,000
今日は学校へ行きます`;

vi.mock("../../src/features/analysis/analysis-pipeline", () => ({
  analyzeSubtitles: vi.fn(async (srt: string) => {
    const blocks = srt.trim().split(/\n\n+/);
    return blocks
      .filter((b) => b.includes("-->"))
      .map((block) => {
        const lines = block.split("\n");
        const text = lines.slice(2).join("\n").trim();
        return {
          startTime: 0,
          endTime: 1,
          text,
          tokens: [{ surface: text, lemma: text, pos: "noun" }],
        };
      });
  }),
}));

function createFile(name: string, content: string): File {
  return new File([content], name, { type: "text/plain" });
}

describe("subtitle-store", () => {
  beforeEach(async () => {
    useSubtitleStore.setState({
      activeSubtitles: [],
      activeFileName: "",
      isAnalyzing: false,
    });
    await db.subtitleFiles.clear();
  });

  describe("importSubtitles", () => {
    it("should import a multi-line SRT file", async () => {
      const file = createFile("multi.srt", MULTI_LINE_SRT);

      await useSubtitleStore.getState().importSubtitles(file);

      const state = useSubtitleStore.getState();
      expect(state.activeSubtitles).toHaveLength(2);
      expect(state.activeFileName).toBe("multi.srt");
      expect(state.isAnalyzing).toBe(false);
    });

    it("should import a single-line SRT file", async () => {
      const file = createFile("single.srt", SINGLE_LINE_SRT);

      await useSubtitleStore.getState().importSubtitles(file);

      const state = useSubtitleStore.getState();
      expect(state.activeSubtitles).toHaveLength(1);
      expect(state.activeFileName).toBe("single.srt");
    });

    it("should persist data in IndexedDB after import", async () => {
      const file = createFile("persist.srt", SINGLE_LINE_SRT);

      await useSubtitleStore.getState().importSubtitles(file);

      const entries = await db.subtitleFiles.toArray();
      expect(entries).toHaveLength(1);
      expect(entries[0]?.fileName).toBe("persist.srt");
      expect(entries[0]?.analyses).toHaveLength(1);
    });

    it("should not create duplicates when re-uploading the same file", async () => {
      const file1 = createFile("same.srt", SINGLE_LINE_SRT);
      const file2 = createFile("same.srt", MULTI_LINE_SRT);

      await useSubtitleStore.getState().importSubtitles(file1);
      await useSubtitleStore.getState().importSubtitles(file2);

      const entries = await db.subtitleFiles.toArray();
      expect(entries).toHaveLength(1);
      expect(entries[0]?.analyses).toHaveLength(2);
    });

    it("should set isAnalyzing to false even if analysis fails", async () => {
      const { analyzeSubtitles } = await import(
        "../../src/features/analysis/analysis-pipeline"
      );
      vi.mocked(analyzeSubtitles).mockRejectedValueOnce(new Error("fail"));

      const file = createFile("error.srt", SINGLE_LINE_SRT);

      await expect(
        useSubtitleStore.getState().importSubtitles(file),
      ).rejects.toThrow("fail");

      expect(useSubtitleStore.getState().isAnalyzing).toBe(false);
    });
  });

  describe("loadSubtitleFile", () => {
    it("should load a file from IndexedDB by id", async () => {
      const id = await db.subtitleFiles.add({
        fileName: "loaded.srt",
        analyses: [
          { startTime: 0, endTime: 1, text: "テスト", tokens: [] },
        ],
      });

      await useSubtitleStore.getState().loadSubtitleFile(id!);

      const state = useSubtitleStore.getState();
      expect(state.activeFileName).toBe("loaded.srt");
      expect(state.activeSubtitles).toHaveLength(1);
    });

    it("should not change state if id does not exist", async () => {
      await useSubtitleStore.getState().loadSubtitleFile(9999);

      const state = useSubtitleStore.getState();
      expect(state.activeFileName).toBe("");
      expect(state.activeSubtitles).toHaveLength(0);
    });
  });

  describe("clearActiveSubtitles", () => {
    it("should reset active state", async () => {
      const file = createFile("clear.srt", SINGLE_LINE_SRT);
      await useSubtitleStore.getState().importSubtitles(file);

      useSubtitleStore.getState().clearActiveSubtitles();

      const state = useSubtitleStore.getState();
      expect(state.activeSubtitles).toHaveLength(0);
      expect(state.activeFileName).toBe("");
    });
  });
});
