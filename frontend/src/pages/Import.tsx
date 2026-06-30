import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { FunctionComponent } from "../common/types";
import { SubtitleFileInput } from "../components/ui/SubtitleFileInput";
import { VideoFileInput } from "../components/ui/VideoFileInput";
import { useSubtitleStore } from "../store/subtitle-store";
import { useVideoStore } from "../store/video-store";

export const Import = (): FunctionComponent => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [subtitleFile, setSubtitleFile] = useState<File | null>(null);

  const navigate = useNavigate();
  const { importVideo } = useVideoStore();
  const { importSubtitles, isAnalyzing } = useSubtitleStore();

  const canSubmit = videoFile !== null && subtitleFile !== null && !isAnalyzing;

  const handleSubmit = async (): Promise<void> => {
    if (!videoFile || !subtitleFile) return;

    await importVideo(videoFile);
    await importSubtitles(subtitleFile);

    setVideoFile(null);
    setSubtitleFile(null);
    await navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Importer</h1>

        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-700">Vidéo</h2>
          <VideoFileInput value={videoFile} onChange={setVideoFile} />
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-700">Sous-titres</h2>
          <SubtitleFileInput value={subtitleFile} onChange={setSubtitleFile} />
        </section>

        <button
          className="w-full rounded-lg bg-blue-500 px-4 py-3 font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
          disabled={!canSubmit}
          type="button"
          onClick={() => void handleSubmit()}
        >
          {isAnalyzing ? "Analyse en cours..." : "Importer"}
        </button>
      </div>
    </div>
  );
};
