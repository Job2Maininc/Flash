"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/components/LocaleProvider";
import { Section } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/ui/Accordion";

type MatchRow = {
  id: string;
  peerId: string;
  peerNickname: string;
  createdAt: number;
  unlocked: boolean;
};

/** Renders nothing when empty — never an empty-state panel on the homepage. */
export function MatchesSection() {
  const { t } = useI18n();
  const [matches, setMatches] = useState<MatchRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/matches", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) return null;
        return res.json() as Promise<{ matches?: MatchRow[] }>;
      })
      .then((data) => {
        if (cancelled || !data?.matches?.length) {
          if (!cancelled) setMatches([]);
          return;
        }
        setMatches(data.matches);
      })
      .catch(() => {
        if (!cancelled) setMatches([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!matches || matches.length === 0) return null;

  return (
    <Section seam>
      <ScrollReveal>
        <p className="cam-eyebrow text-[var(--faint)]">{t.matches.eyebrow}</p>
        <h2 className="cam-h2 mt-3 max-w-[18ch]">
          {t.matches.title}
        </h2>
      </ScrollReveal>
      <ul className="mt-8 divide-y divide-[var(--ink-700)]">
        {matches.map((m) => (
          <li
            key={m.id}
            className="flex items-center justify-between gap-4 py-4"
          >
            <div>
              <p className="font-[family-name:var(--font-camera-display)] text-lg font-bold text-[var(--cam-paper)]">
                {m.peerNickname}
              </p>
              <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.12em] text-[var(--faint)]">
                {m.unlocked ? t.matches.unlocked : t.matches.locked}
              </p>
            </div>
            <Link
              href="/matches"
              className="inline-flex min-h-11 items-center rounded-[var(--radius-pill)] border border-[var(--ink-600)] px-4 text-sm text-[var(--cam-paper)]"
            >
              {t.matches.open}
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
