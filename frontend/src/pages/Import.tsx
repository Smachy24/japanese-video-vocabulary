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

    const videoId = await importVideo(videoFile);
    await importSubtitles(subtitleFile, videoId);

    setVideoFile(null);
    setSubtitleFile(null);
    await navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-app px-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <h1 className="mb-1 text-[19px] font-bold text-ink">Nouvelle vidéo</h1>
        <p className="mb-6 text-sm text-ink-muted">
          La vidéo et les sous-titres restent sur votre appareil.
        </p>

        <section className="mb-6">
          <h2 className="mb-2.5 text-sm font-semibold text-ink-secondary">Vidéo</h2>
          <VideoFileInput value={videoFile} onChange={setVideoFile} />
        </section>

        <section className="mb-8">
          <h2 className="mb-2.5 text-sm font-semibold text-ink-secondary">Sous-titres</h2>
          <SubtitleFileInput value={subtitleFile} onChange={setSubtitleFile} />
        </section>

        <button
          className="w-full rounded-lg bg-brand py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!canSubmit}
          type="button"
          onClick={() => void handleSubmit()}
        >
          {isAnalyzing ? "Analyse en cours…" : "Importer"}
        </button>
      </div>
    </div>
  );
};
