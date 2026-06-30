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

    const hasValidExtension = ACCEPTED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!hasValidExtension) return;

    onChange(file);
    event.target.value = "";
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white px-6 py-8 text-gray-600 transition hover:border-blue-400 hover:bg-blue-50">
        <input
          accept={ACCEPTED_EXTENSIONS.join(",")}
          className="hidden"
          type="file"
          onChange={handleFileChange}
        />
        <span>Sélectionner une vidéo (.mp4, .mkv, .webm)</span>
      </label>
      {value && (
        <p className="text-sm text-gray-500">
          Fichier sélectionné : <span className="font-medium text-gray-700">{value.name}</span>
        </p>
      )}
    </div>
  );
};
