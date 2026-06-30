import { db } from "../common/db";
import type { VideoFile } from "../common/entities";
import { create } from "zustand";

type VideoState = {
  videos: Array<VideoFile>;
  activeVideo: VideoFile | null;
  isLoading: boolean;
};

type VideoActions = {
  importVideo: (file: File) => Promise<void>;
  loadVideos: () => Promise<void>;
  selectVideo: (id: number) => Promise<void>;
  deleteVideo: (id: number) => Promise<void>;
  linkSubtitle: (videoId: number, subtitleFileId: number) => Promise<void>;
};

type VideoStore = VideoState & VideoActions;

const useVideoStore = create<VideoStore>((set, get) => ({
  videos: [],
  activeVideo: null,
  isLoading: true,
  importVideo: async (file): Promise<void> => {
    const data = await file.arrayBuffer();
    const existing = await db.videos.where("name").equals(file.name).first();
    await db.videos.put({
      id: existing?.id,
      name: file.name,
      data,
      mimeType: file.type,
    });
    await get().loadVideos();
  },
  loadVideos: async (): Promise<void> => {
    set({ isLoading: true });
    const videos = await db.videos.toArray();
    set({ videos, isLoading: false });
  },
  selectVideo: async (id): Promise<void> => {
    const video = await db.videos.get(id);
    if (video) {
      set({ activeVideo: video });
    }
  },
  deleteVideo: async (id): Promise<void> => {
    await db.videos.delete(id);
    const { activeVideo } = get();
    if (activeVideo?.id === id) {
      set({ activeVideo: null });
    }
    await get().loadVideos();
  },
  linkSubtitle: async (videoId, subtitleFileId): Promise<void> => {
    await db.subtitleFiles.update(subtitleFileId, { videoId });
    await get().loadVideos();
  },
}));

export { useVideoStore };
