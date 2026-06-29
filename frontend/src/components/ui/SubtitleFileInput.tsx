import type { ChangeEvent } from "react";
import type { FunctionComponent } from "../../common/types";
import { useSubtitleStore } from "../../store/subtitle-store";

export const SubtitleFileInput = (): FunctionComponent => {
  const { importSubtitles, isAnalyzing, activeFileName } = useSubtitleStore();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".srt")) {
      return;
    }

    await importSubtitles(file);
    input.value = "";
  };

  return (
    <div className="flex flex-col gap-3">
      <label
        className={`flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 transition ${
          isAnalyzing
            ? "cursor-not-allowed border-gray-300 bg-gray-50 text-gray-400"
            : "border-gray-300 bg-white text-gray-600 hover:border-blue-400 hover:bg-blue-50"
        }`}
      >
        <input
          accept=".srt"
          className="hidden"
          disabled={isAnalyzing}
          type="file"
          onChange={handleFileChange}
        />
        {isAnalyzing ? (
          <span>Analyse en cours...</span>
        ) : (
          <span>Sélectionner un fichier de sous-titres (.srt)</span>
        )}
      </label>
      {activeFileName && !isAnalyzing && (
        <p className="text-sm text-gray-500">
          Fichier importé : <span className="font-medium text-gray-700">{activeFileName}</span>
        </p>
      )}
    </div>
  );
};
