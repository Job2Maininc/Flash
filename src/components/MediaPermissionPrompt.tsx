"use client";

import { useState } from "react";
import { Spinner } from "@/components/Spinner";
import { useI18n } from "@/components/LocaleProvider";
import { humanizeMediaError, requestMediaAccess } from "@/lib/media";

type Props = {
  onGranted: () => void;
};

export function MediaPermissionPrompt({ onGranted }: Props) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function activate() {
    setLoading(true);
    setError(null);
    try {
      await requestMediaAccess();
      onGranted();
    } catch (err) {
      setError(humanizeMediaError(err, t.media));
      setLoading(false);
    }
  }

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/75 px-6 backdrop-blur-md">
      <div className="flash-fade-in w-full max-w-sm rounded-2xl border border-white/10 bg-[var(--ink)] p-6 text-center shadow-2xl">
        <p className="font-[family-name:var(--font-display)] text-2xl text-white">
          {t.media.title}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/65">
          {t.media.body}
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
              {t.media.activating}
            </span>
          ) : (
            t.media.activate
          )}
        </button>
      </div>
    </div>
  );
}