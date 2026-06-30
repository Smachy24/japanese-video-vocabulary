import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import type { FunctionComponent } from "../common/types";
import { getOrCreateBlobUrl } from "../features/player/blob-url-cache";
import { VideoPlayer } from "../components/ui/VideoPlayer";
import { WordPanel } from "../components/ui/WordPanel";
import { useVideoStore } from "../store/video-store";
import { useSubtitleStore } from "../store/subtitle-store";
import { Route } from "../routes/player.$videoId";

export const Player = (): FunctionComponent => {
  const { videoId } = Route.useParams();
  const { selectVideo, activeVideo } = useVideoStore();
  const { loadSubtitlesByVideoId, clearActiveSubtitles } = useSubtitleStore();

  useEffect(() => {
    void selectVideo(Number(videoId));
  }, [videoId, selectVideo]);

  useEffect(() => {
    void loadSubtitlesByVideoId(Number(videoId));
    return (): void => { clearActiveSubtitles(); };
  }, [videoId, loadSubtitlesByVideoId, clearActiveSubtitles]);

  const blobUrl = activeVideo?.id ? getOrCreateBlobUrl(activeVideo) : null;

  if (!blobUrl || !activeVideo) return null;

  return (
    <div className="flex min-h-screen flex-col bg-app">
      <header className="flex items-center gap-3 border-b border-border bg-surface px-5 py-3.5">
        <Link
          className="flex items-center gap-1 text-sm text-ink-secondary transition hover:text-ink"
          to="/"
        >
          ‹ Catalogue
        </Link>
        <div className="h-4 w-px bg-border" />
        <span className="font-japanese text-sm font-medium text-ink">{activeVideo.name}</span>
      </header>

      <div className="flex flex-1 flex-col lg:grid lg:grid-cols-[1fr_380px]">
        <div className="bg-black">
          <VideoPlayer src={blobUrl} />
        </div>
        <WordPanel />
      </div>
    </div>
  );
};
