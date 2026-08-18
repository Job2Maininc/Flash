"use client";

import { useI18n } from "@/components/LocaleProvider";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function JoinNameField({ value, onChange }: Props) {
  const { t } = useI18n();

  return (
    <label className="flex h-14 min-w-0 flex-1 items-center gap-2.5 rounded-2xl border border-white/15 bg-white/8 px-3.5 transition hover:border-white/35 focus-within:border-[var(--accent)] focus-within:bg-white/10">
      <span aria-hidden className="text-2xl leading-none">
        ✏️
      </span>
      <span className="shrink-0 font-[family-name:var(--font-display)] text-sm font-semibold tracking-tight text-white sm:text-base">
        {t.join.controlName}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={24}
        autoComplete="nickname"
        placeholder={t.form.placeholder}
        aria-label={t.form.nickname}
        className="min-w-0 flex-1 bg-transparent text-base text-white placeholder:text-white/35 focus:outline-none"
      />
    </label>
  );
}
