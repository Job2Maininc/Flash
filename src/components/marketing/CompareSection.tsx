"use client";

import { ScrollReveal } from "@/components/ui/Accordion";
import { Section } from "@/components/ui/Section";
import { useI18n } from "@/components/LocaleProvider";

/** Compact “apps vs Flash” contrast — no fake quotes, no stats. */
export function CompareSection() {
  const { t } = useI18n();
  const rows = t.home.compare.rows;

  return (
    <Section inverted>
      <ScrollReveal>
        <p className="cam-eyebrow !text-[var(--ink-600)]">
          {t.home.compare.eyebrow}
        </p>
        <h2 className="cam-h2 mt-3 max-w-[22ch] !text-[var(--ink-900)]">
          {t.home.compare.title}
        </h2>
        <p className="cam-body mt-4 max-w-[48ch] !text-[var(--ink-700)]">
          {t.home.compare.lead}
        </p>
      </ScrollReveal>

      <div className="mt-10 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--ink-900)]/10 bg-white/75 shadow-[var(--shadow-soft)]">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 border-b border-[var(--ink-900)]/8 px-5 py-3 text-[13px] font-medium text-[var(--ink-600)] sm:gap-6 sm:px-6">
          <span>{t.home.compare.appsLabel}</span>
          <span aria-hidden className="text-[var(--ink-900)]/25">
            →
          </span>
          <span className="text-right sm:text-left">{t.home.compare.flashLabel}</span>
        </div>
        <ul className="divide-y divide-[var(--ink-900)]/8">
          {rows.map((row) => (
            <li
              key={row.apps}
              className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-3 px-5 py-4 text-sm leading-relaxed text-[var(--ink-700)] sm:gap-6 sm:px-6 sm:text-base"
            >
              <span>{row.apps}</span>
              <span aria-hidden className="text-[var(--ink-900)]/30">
                →
              </span>
              <span className="font-medium text-[var(--ink-900)]">{row.flash}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
