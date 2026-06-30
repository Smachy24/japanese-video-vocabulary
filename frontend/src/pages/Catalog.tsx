import { useEffect } from "react";
import type { FunctionComponent } from "../common/types";
import { useVideoStore } from "../store/video-store";
import { Link } from "@tanstack/react-router";

export const Catalog = (): FunctionComponent => {
  const { videos, loadVideos, deleteVideo, isLoading } = useVideoStore();

  useEffect(() => {
    void loadVideos();
  }, [loadVideos]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Catalogue</h1>
          <Link
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
            to="/import"
          >
            Importer
          </Link>
        </div>

        {isLoading ? null : videos.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-md">
            <p className="text-gray-500">Aucune vidéo importée</p>
            <Link
              className="mt-4 inline-block text-blue-500 hover:underline"
              to="/import"
            >
              Importer une vidéo
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {videos.map((video) => (
              <li
                key={video.id}
                className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm"
              >
                <div>
                  <p className="font-medium text-gray-800">{video.name}</p>
                  <p className="text-sm text-gray-400">Vidéo importée</p>
                </div>
                <button
                  className="text-sm text-red-400 transition hover:text-red-600"
                  type="button"
                  onClick={() => video.id && deleteVideo(video.id)}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
