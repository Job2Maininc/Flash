"use client";

import { useState } from "react";
import { Spinner } from "@/components/Spinner";
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
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/75 px-6 backdrop-blur-md">
      <div className="flash-fade-in w-full max-w-sm rounded-2xl border border-white/10 bg-[var(--ink)] p-6 text-center shadow-2xl">
        <p className="font-[family-name:var(--font-display)] text-2xl text-white">
          Caméra & micro
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/65">
          Flash a besoin de ta caméra et ton micro pour les appels. Ton
          navigateur affichera une demande d&apos;accès.
        </p>
        {error ? (
          <p className="mt-4 text-sm text-[var(--danger)]" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="button"
          disabled={loading}
          onClick={activate}
          className="flash-btn flash-btn-accent mt-6 w-full px-6 py-3.5 text-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner size="sm" />
              Activation…
            </span>
          ) : (
            "Activer caméra et micro"
          )}
        </button>
      </div>
    </div>
  );
}
