"use client";

import { useI18n } from "@/components/LocaleProvider";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function JoinNameField({ value, onChange }: Props) {
  const { t } = useI18n();

  return (
    <label className="relative min-w-0 flex-1">
      <span className="sr-only">{t.form.nickname}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={24}
        autoComplete="nickname"
        placeholder={t.form.placeholder}
        className="h-14 w-full rounded-2xl border border-white/15 bg-white/8 px-4 text-base text-white placeholder:text-white/35 transition hover:border-white/35 focus:border-[var(--accent)] focus:bg-white/10 focus:outline-none"
      />
    </label>
  );
}
