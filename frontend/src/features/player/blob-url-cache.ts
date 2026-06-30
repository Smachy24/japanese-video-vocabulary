import type { VideoFile } from "../../common/entities";

const cache = new Map<number, string>();

export function getOrCreateBlobUrl(video: VideoFile): string {
  const id = video.id!;
  if (!cache.has(id)) {
    cache.set(id, URL.createObjectURL(new Blob([video.data], { type: video.mimeType })));
  }
  return cache.get(id)!;
}

export function evictBlobUrl(id: number): void {
  const url = cache.get(id);
  if (url) {
    URL.revokeObjectURL(url);
    cache.delete(id);
  }
}
