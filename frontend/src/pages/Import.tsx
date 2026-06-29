import type { FunctionComponent } from "../common/types";
import { SubtitleFileInput } from "../components/ui/SubtitleFileInput";

export const Import = (): FunctionComponent => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Importer</h1>

        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-700">Sous-titres</h2>
          <SubtitleFileInput />
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-700">Vidéo</h2>
          <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 px-6 py-8 text-gray-400">
            Bientôt disponible
          </div>
        </section>
      </div>
    </div>
  );
};
