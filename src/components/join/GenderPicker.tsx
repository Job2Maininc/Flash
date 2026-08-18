"use client";

import type { Sex } from "@/lib/types";
import { JoinIconButton } from "@/components/join/JoinIconButton";
import { JoinMenu, JoinMenuItem } from "@/components/join/JoinMenu";
import { useI18n } from "@/components/LocaleProvider";

const SEX_EMOJI: Record<Sex, string> = {
  homme: "👨",
  femme: "👩",
  non_binaire: "🧑",
};

type Props = {
  value: Sex | "";
  open: boolean;
  onToggle: () => void;
  onChange: (value: Sex) => void;
};

export function GenderPicker({ value, open, onToggle, onChange }: Props) {
  const { t } = useI18n();
  const options: { value: Sex; label: string; emoji: string }[] = [
    { value: "homme", label: t.form.sexHomme, emoji: SEX_EMOJI.homme },
    { value: "femme", label: t.form.sexFemme, emoji: SEX_EMOJI.femme },
    {
      value: "non_binaire",
      label: t.form.sexNonBinaire,
      emoji: SEX_EMOJI.non_binaire,
    },
  ];

  return (
    <div className="relative">
      <JoinIconButton
        label={t.form.iAm}
        active={Boolean(value)}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={onToggle}
      >
        {value ? SEX_EMOJI[value] : "👤"}
      </JoinIconButton>
      <JoinMenu open={open}>
        {options.map((option) => (
          <JoinMenuItem
            key={option.value}
            active={value === option.value}
            onClick={() => onChange(option.value)}
          >
            <span className="text-lg">{option.emoji}</span>
            {option.label}
          </JoinMenuItem>
        ))}
      </JoinMenu>
    </div>
  );
}
