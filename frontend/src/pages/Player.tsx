import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import type { FunctionComponent } from "../common/types";
import { getOrCreateBlobUrl } from "../features/player/blob-url-cache";
import { VideoPlayer } from "../components/ui/VideoPlayer";
import { useVideoStore } from "../store/video-store";
import { Route } from "../routes/player.$videoId";

export const Player = (): FunctionComponent => {
  const { videoId } = Route.useParams();
  const { selectVideo, activeVideo } = useVideoStore();

  useEffect(() => {
    void selectVideo(Number(videoId));
  }, [videoId, selectVideo]);

  const blobUrl = activeVideo?.id ? getOrCreateBlobUrl(activeVideo) : null;

  if (!blobUrl || !activeVideo) return null;

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <div className="flex items-center gap-4 bg-gray-900 px-4 py-3">
        <Link className="text-sm text-gray-400 transition hover:text-white" to="/">
          ← Catalogue
        </Link>
        <span className="text-sm font-medium text-white">{activeVideo.name}</span>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-5xl">
          <VideoPlayer src={blobUrl} />
        </div>
      </div>
    </div>
  );
};
