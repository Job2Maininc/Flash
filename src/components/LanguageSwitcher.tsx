"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/config";
import { useI18n } from "@/components/LocaleProvider";

type Props = {
  variant?: "light" | "dark";
};

export function LanguageSwitcher({ variant = "light" }: Props) {
  const router = useRouter();
  const { locale, t } = useI18n();
  const [pending, startTransition] = useTransition();

  function select(next: Locale) {
    if (next === locale || pending) return;
    startTransition(async () => {
      await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      });
      router.refresh();
    });
  }

  const isDark = variant === "dark";

  return (
    <div
      role="group"
      aria-label={t.nav.language}
      className={`inline-flex overflow-hidden rounded-full border text-[11px] font-medium uppercase tracking-widest ${
        isDark
          ? "border-white/20 bg-black/35 text-white/70"
          : "border-[var(--ink)]/12 bg-white/50 text-[var(--ink-muted)]"
      }`}
    >
      {LOCALES.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            disabled={pending}
            onClick={() => select(code)}
            className={`flash-btn px-2.5 py-1.5 ${
              active
                ? isDark
                  ? "bg-white text-[var(--ink)]"
                  : "bg-[var(--ink)] text-[var(--paper)]"
                : isDark
                  ? "hover:bg-white/10 hover:text-white"
                  : "hover:bg-white/80 hover:text-[var(--ink)]"
            }`}
            aria-pressed={active}
          >
            {LOCALE_LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}
