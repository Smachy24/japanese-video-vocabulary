import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import type { FunctionComponent } from "../common/types";
import { useVideoStore } from "../store/video-store";

export const Catalog = (): FunctionComponent => {
  const { videos, loadVideos, deleteVideo, isLoading } = useVideoStore();

  useEffect(() => {
    void loadVideos();
  }, [loadVideos]);

  return (
    <div className="min-h-screen bg-app">
      <header className="border-b border-border bg-surface px-6 py-3.5">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand font-japanese text-sm font-bold text-white">
              木
            </div>
            <span className="text-[17px] font-bold text-ink">Komorebi</span>
          </div>
          <Link
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            to="/import"
          >
            + Importer
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="mb-1 text-[22px] font-bold text-ink">Ma bibliothèque</h1>
        <p className="mb-6 text-sm text-ink-muted">{videos.length} vidéo{videos.length !== 1 ? "s" : ""}</p>

        {isLoading ? null : videos.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-12 text-center shadow-sm">
            <p className="text-ink-muted">Aucune vidéo importée</p>
            <Link
              className="mt-3 inline-block text-sm font-medium text-brand hover:underline"
              to="/import"
            >
              Importer une vidéo
            </Link>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {videos.map((video) => (
              <li
                key={video.id}
                className="flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-4 shadow-sm transition hover:border-brand/30"
              >
                <Link
                  className="font-japanese font-medium text-ink transition hover:text-brand"
                  params={{ videoId: String(video.id) }}
                  to="/player/$videoId"
                >
                  {video.name}
                </Link>
                <button
                  className="text-sm text-ink-faint transition hover:text-new-text"
                  type="button"
                  onClick={() => video.id && deleteVideo(video.id)}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};
