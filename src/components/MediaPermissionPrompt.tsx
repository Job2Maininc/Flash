"use client";

import { useState } from "react";
import { humanizeMediaError, requestMediaAccess } from "@/lib/media";

type Props = {
  onGranted: () => void;
};

export function MediaPermissionPrompt({ onGranted }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function activate() {
    setLoading(true);
    setError(null);
    try {
      await requestMediaAccess();
      onGranted();
    } catch (err) {
      setError(humanizeMediaError(err));
      setLoading(false);
    }
  }

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-black/80 px-6 text-center backdrop-blur-sm">
      <p className="font-[family-name:var(--font-display)] text-2xl text-white">
        Caméra & micro
      </p>
      <p className="max-w-sm text-sm text-white/70">
        Flash a besoin de ta caméra pour les appels vidéo. Clique ci-dessous —
        Chrome affichera la demande d’accès si nécessaire.
      </p>
      {error ? (
        <p className="max-w-sm text-sm text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="button"
        disabled={loading}
        onClick={activate}
        className="bg-[var(--accent)] px-6 py-3 font-[family-name:var(--font-display)] text-lg text-[var(--ink)] disabled:opacity-60"
      >
        {loading ? "Activation…" : "Activer caméra et micro"}
      </button>
    </div>
  );
}
