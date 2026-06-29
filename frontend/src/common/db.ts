import Dexie, { type EntityTable } from "dexie";
import type { SubtitleFile } from "./entities";


const db = new Dexie("komorebi") as Dexie & {
  subtitleFiles: EntityTable<SubtitleFile, "id">;
};

db.version(1).stores({
  subtitleFiles: "++id, &fileName",
});

export { db };