"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/config";
import { useI18n } from "@/components/LocaleProvider";
import { cn } from "@/lib/cn";

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
      className={cn(
        "inline-flex overflow-hidden rounded-[var(--radius-pill)] border text-[13px] font-medium tracking-normal",
        isDark
          ? "border-[var(--ink-600)] bg-[var(--ink-800)] text-[var(--muted)]"
          : "border-[var(--ink)]/12 bg-white/50 text-[var(--ink-muted)]",
      )}
    >
      {LOCALES.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            disabled={pending}
            onClick={() => select(code)}
            className={cn(
              "px-3 py-2.5 transition-colors duration-[var(--dur-fast)] active:opacity-80",
              active
                ? isDark
                  ? "bg-[var(--ink-700)] text-[var(--cam-paper)]"
                  : "bg-[var(--ink)] text-[var(--paper)]"
                : isDark
                  ? "hover:bg-[var(--ink-700)]/60 hover:text-[var(--cam-paper)]"
                  : "hover:bg-white/80 hover:text-[var(--ink)]",
            )}
            aria-pressed={active}
          >
            {LOCALE_LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}
