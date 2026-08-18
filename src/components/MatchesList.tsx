"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FlashLogo } from "@/components/FlashLogo";
import { Spinner } from "@/components/Spinner";
import { AmbientOrbs } from "@/components/AmbientOrbs";
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
      <div className="relative overflow-hidden">
        <AmbientOrbs variant="warm" className="opacity-60" />
        <div className="flash-fade-in flash-card relative flex flex-col items-center gap-4 px-6 py-10 text-center">
          <FlashLogo size={48} glow="strong" />
          <p className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
            {t.matches.emptyTitle}
          </p>
          <p className="max-w-xs text-sm leading-relaxed text-[var(--ink-muted)]">
            {t.matches.emptyBody}
          </p>
        </div>
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
            className="flash-card flash-fade-in flex items-center justify-between gap-4 px-4 py-4 transition hover:bg-white/70"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <div className="min-w-0">
              <p className="truncate font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
                {m.nickname}
              </p>
              <p className="text-xs text-[var(--ink-muted)]">
                {formatMatchDate(m.matchedAt)}
              </p>
            </div>
            <button
              type="button"
              disabled={loadingId === m.peerId}
              onClick={() => recall(m.peerId)}
              className="flash-btn flash-btn-primary shrink-0 px-4 py-2.5 text-sm"
            >
              {loadingId === m.peerId ? (
                <Spinner size="sm" className="border-[var(--paper)]/30 border-t-[var(--paper)]" />
              ) : (
                t.matches.recall
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}