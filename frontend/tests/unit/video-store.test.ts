import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import { useVideoStore } from "../../src/store/video-store";
import { db } from "../../src/common/db";

function createVideoFile(name: string, type = "video/mp4"): File {
  const buffer = new ArrayBuffer(8);
  return new File([buffer], name, { type });
}

describe("video-store", () => {
  beforeEach(async () => {
    useVideoStore.setState({ videos: [], activeVideo: null });
    await db.videos.clear();
    await db.subtitleFiles.clear();
  });

  describe("importVideo", () => {
    it("should import a video and update the list", async () => {
      const file = createVideoFile("test.mp4");

      await useVideoStore.getState().importVideo(file);

      const state = useVideoStore.getState();
      expect(state.videos).toHaveLength(1);
      expect(state.videos[0]?.name).toBe("test.mp4");
      expect(state.videos[0]?.mimeType).toBe("video/mp4");
    });

    it("should persist video in IndexedDB", async () => {
      const file = createVideoFile("persist.mp4");

      await useVideoStore.getState().importVideo(file);

      const entries = await db.videos.toArray();
      expect(entries).toHaveLength(1);
      expect(entries[0]?.name).toBe("persist.mp4");
    });

    it("should not create duplicates when re-uploading the same file", async () => {
      const file1 = createVideoFile("same.mp4");
      const file2 = createVideoFile("same.mp4");

      await useVideoStore.getState().importVideo(file1);
      await useVideoStore.getState().importVideo(file2);

      const entries = await db.videos.toArray();
      expect(entries).toHaveLength(1);
    });

    it("should import multiple different videos", async () => {
      await useVideoStore.getState().importVideo(createVideoFile("a.mp4"));
      await useVideoStore.getState().importVideo(createVideoFile("b.mp4"));

      const state = useVideoStore.getState();
      expect(state.videos).toHaveLength(2);
    });
  });

  describe("selectVideo", () => {
    it("should set the active video", async () => {
      const file = createVideoFile("select.mp4");
      await useVideoStore.getState().importVideo(file);

      const id = useVideoStore.getState().videos[0]!.id!;
      await useVideoStore.getState().selectVideo(id);

      expect(useVideoStore.getState().activeVideo?.name).toBe("select.mp4");
    });

    it("should not change state for non-existent id", async () => {
      await useVideoStore.getState().selectVideo(9999);

      expect(useVideoStore.getState().activeVideo).toBeNull();
    });
  });

  describe("deleteVideo", () => {
    it("should remove the video from DB and list", async () => {
      const file = createVideoFile("delete.mp4");
      await useVideoStore.getState().importVideo(file);

      const id = useVideoStore.getState().videos[0]!.id!;
      await useVideoStore.getState().deleteVideo(id);

      expect(useVideoStore.getState().videos).toHaveLength(0);
      const entries = await db.videos.toArray();
      expect(entries).toHaveLength(0);
    });

    it("should clear activeVideo if deleted video was active", async () => {
      const file = createVideoFile("active.mp4");
      await useVideoStore.getState().importVideo(file);

      const id = useVideoStore.getState().videos[0]!.id!;
      await useVideoStore.getState().selectVideo(id);
      await useVideoStore.getState().deleteVideo(id);

      expect(useVideoStore.getState().activeVideo).toBeNull();
    });
  });

  describe("linkSubtitle", () => {
    it("should link a subtitle file to a video", async () => {
      await useVideoStore.getState().importVideo(createVideoFile("link.mp4"));
      const videoId = useVideoStore.getState().videos[0]!.id!;

      const subtitleId = await db.subtitleFiles.add({
        fileName: "link.srt",
        analyses: [],
      });

      await useVideoStore.getState().linkSubtitle(videoId, subtitleId);

      const subtitle = await db.subtitleFiles.get(subtitleId);
      expect(subtitle?.videoId).toBe(videoId);
    });
  });
});
