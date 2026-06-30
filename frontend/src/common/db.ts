import Dexie, { type EntityTable } from "dexie";
import type { SubtitleFile, VideoFile } from "./entities";


const db = new Dexie("komorebi") as Dexie & {
  subtitleFiles: EntityTable<SubtitleFile, "id">;
  videos: EntityTable<VideoFile, "id">;
};

db.version(2).stores({
  subtitleFiles: "++id, &fileName, videoId",
  videos: "++id, &name",
});

export { db };
