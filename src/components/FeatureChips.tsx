"use client";

import { useI18n } from "@/components/LocaleProvider";

export function FeatureChips() {
  const { t } = useI18n();
  const features = [
    { label: t.chips.videoDating, icon: "◎" },
    { label: t.chips.filteredMatches, icon: "♡" },
    { label: t.chips.tapRecall, icon: "⚡" },
  ];

  return (
    <ul className="flex flex-wrap gap-2 pt-2">
      {features.map((f, i) => (
        <li
          key={f.label}
          className="flash-fade-in flex items-center gap-1.5 rounded-full border border-[var(--ink)]/10 bg-white/45 px-3 py-1.5 text-xs font-medium text-[var(--ink-muted)] backdrop-blur-sm"
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          <span className="text-[var(--ink)]" aria-hidden>
            {f.icon}
          </span>
          {f.label}
        </li>
      ))}
    </ul>
  );
}