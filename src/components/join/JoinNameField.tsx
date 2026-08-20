"use client";

import { useI18n } from "@/components/LocaleProvider";
import { cn } from "@/lib/cn";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function JoinNameField({ value, onChange }: Props) {
  const { t } = useI18n();

  return (
    <label
      className={cn(
        "flex h-14 min-w-0 flex-1 items-center gap-2.5 rounded-[var(--radius-pill)] border border-[var(--ink-600)] bg-[var(--ink-800)]/80 px-3.5",
        "transition-[border-color,background-color] duration-[var(--dur-fast)]",
        "hover:border-[var(--ink-700)] focus-within:border-[var(--key-500)]/55 focus-within:bg-[var(--ink-700)]",
      )}
    >
      <span aria-hidden className="text-2xl leading-none">
        ✏️
      </span>
      <span className="shrink-0 font-[family-name:var(--font-camera-display)] text-sm font-semibold tracking-tight text-[var(--cam-paper)] sm:text-base">
        {t.join.controlName}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={24}
        autoComplete="nickname"
        placeholder={t.form.placeholder}
        aria-label={t.form.nickname}
        className="min-w-0 flex-1 bg-transparent text-base text-[var(--cam-paper)] placeholder:text-[var(--cam-paper)]/35 focus:outline-none"
      />
    </label>
  );
}
