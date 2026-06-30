import type { ChangeEvent } from "react";
import type { FunctionComponent } from "../../common/types";

const ACCEPTED_EXTENSIONS = [".mp4", ".mkv", ".webm"];

type Props = {
  value: File | null;
  onChange: (file: File) => void;
};

export const VideoFileInput = ({ value, onChange }: Props): FunctionComponent => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;

    const hasValidExtension = ACCEPTED_EXTENSIONS.some((extension) => file.name.toLowerCase().endsWith(extension));
    if (!hasValidExtension) return;

    onChange(file);
    event.target.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-brand-light/40 px-6 py-8 text-center transition hover:border-brand hover:bg-brand-light">
        <input
          accept={ACCEPTED_EXTENSIONS.join(",")}
          className="hidden"
          type="file"
          onChange={handleFileChange}
        />
        <span className="text-sm font-medium text-brand">Sélectionner une vidéo</span>
        <span className="text-xs text-ink-muted">MP4, WebM, MKV</span>
      </label>
      {value && (
        <p className="text-sm text-ink-muted">
          Fichier : <span className="font-medium text-ink">{value.name}</span>
        </p>
      )}
    </div>
  );
};
