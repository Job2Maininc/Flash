"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FlashLogo } from "@/components/FlashLogo";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/components/LocaleProvider";
import type { MatchEntry } from "@/lib/types";

type Props = {
  initialMatches: MatchEntry[];
};

export function MatchesList({ initialMatches }: Props) {
  const router = useRouter();
  const { locale, t } = useI18n();
  const [matches] = useState(initialMatches);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function formatMatchDate(ms: number): string {
    if (!ms) return "";
    return new Date(ms).toLocaleDateString(locale === "de" ? "de-DE" : "en-US", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function recall(peerId: string) {
    setError(null);
    setLoadingId(peerId);
    try {
      const res = await fetch("/api/session/recall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ peerId }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? t.matches.recallError);
      router.push("/browse?recall=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : t.matches.genericError);
      setLoadingId(null);
    }
  }

  if (matches.length === 0) {
    return (
      <div className="cam-reveal relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--ink-600)] bg-[var(--ink-800)]/80 px-6 py-10 text-center shadow-[var(--elev-1)]">
        <FlashLogo size={48} glow="strong" />
        <p className="mt-4 font-[family-name:var(--font-camera-display)] text-xl text-[var(--cam-paper)]">
          {t.matches.emptyTitle}
        </p>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[var(--cam-paper)]/55">
          {t.matches.emptyBody}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {error ? (
        <p className="text-sm text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}
      <ul className="flex flex-col gap-3">
        {matches.map((m, i) => (
          <li
            key={m.peerId}
            className="cam-reveal flex items-center justify-between gap-4 rounded-[1.25rem] border border-[var(--ink-600)] bg-[var(--ink-800)]/70 px-4 py-4 transition-colors hover:border-[var(--key-500)]/35 hover:bg-[var(--ink-700)]"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <div className="min-w-0">
              <p className="truncate font-[family-name:var(--font-camera-display)] text-xl text-[var(--cam-paper)]">
                {m.nickname}
              </p>
              <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--cam-paper)]/45">
                {formatMatchDate(m.matchedAt)}
              </p>
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              loading={loadingId === m.peerId}
              disabled={loadingId === m.peerId}
              onClick={() => recall(m.peerId)}
              className="shrink-0"
            >
              {t.matches.recall}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
