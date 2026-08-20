"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
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
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-[var(--ink-900)]/80 px-6 backdrop-blur-md">
      <div className="cam-reveal w-full max-w-sm rounded-[var(--radius-xl)] border border-[var(--ink-600)] bg-[var(--ink-800)] p-6 text-center shadow-[var(--elev-2)]">
        <p className="font-[family-name:var(--font-camera-display)] text-2xl text-[var(--cam-paper)]">
          {t.media.title}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--cam-paper)]/65">
          {t.media.body}
        </p>
        {error ? (
          <p className="mt-4 text-sm text-[var(--danger)]" role="alert">
            {error}
          </p>
        ) : null}
        <Button
          type="button"
          variant="primary"
          size="lg"
          loading={loading}
          disabled={loading}
          onClick={activate}
          className="mt-6 w-full"
        >
          {loading ? t.media.activating : t.media.activate}
        </Button>
      </div>
    </div>
  );
}
