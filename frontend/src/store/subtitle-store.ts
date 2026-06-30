import { db } from "../common/db";
import { analyzeSubtitles } from "../features/analysis/analysis-pipeline";
import type { SubtitleAnalysis } from "../types/subtitle";
import { create } from "zustand";

type SubtitleState = {
  activeSubtitles: Array<SubtitleAnalysis>;
  activeFileName: string;
  isAnalyzing: boolean;
};

type SubtitleActions = {
  importSubtitles: (file: File, videoId?: number) => Promise<void>;
  loadSubtitleFile: (id: number) => Promise<void>;
  loadSubtitlesByVideoId: (videoId: number) => Promise<void>;
  clearActiveSubtitles: () => void;
};

type SubtitleStore = SubtitleState & SubtitleActions;

const useSubtitleStore = create<SubtitleStore>((set) => ({
  activeSubtitles: [],
  activeFileName: "",
  isAnalyzing: false,
  importSubtitles: async (file, videoId): Promise<void> => {
    set({ isAnalyzing: true });
    try {
      const content = await file.text();
      const result = await analyzeSubtitles(content);
      const existing = await db.subtitleFiles.where("fileName").equals(file.name).first();
      await db.subtitleFiles.put({ id: existing?.id, fileName: file.name, videoId, analyses: result });
      set({ activeSubtitles: result, activeFileName: file.name });
    } finally {
      set({ isAnalyzing: false });
    }
  },
  loadSubtitleFile: async (id): Promise<void> => {
    const entry = await db.subtitleFiles.get(id);
    if (entry) {
      set({ activeSubtitles: entry.analyses, activeFileName: entry.fileName });
    }
  },
  loadSubtitlesByVideoId: async (videoId): Promise<void> => {
    const entry = await db.subtitleFiles.where("videoId").equals(videoId).first();
    if (entry) {
      set({ activeSubtitles: entry.analyses, activeFileName: entry.fileName });
    } else {
      set({ activeSubtitles: [], activeFileName: "" });
    }
  },
  clearActiveSubtitles: (): void => {
    set({ activeSubtitles: [], activeFileName: "" });
  },
}));

export { useSubtitleStore };
