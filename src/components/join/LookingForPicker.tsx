"use client";

import type { LookingFor } from "@/lib/types";
import { JoinIconButton } from "@/components/join/JoinIconButton";
import { JoinMenu, JoinMenuItem } from "@/components/join/JoinMenu";
import { useI18n } from "@/components/LocaleProvider";

type Props = {
  value: LookingFor | "";
  open: boolean;
  onToggle: () => void;
  onChange: (value: LookingFor) => void;
};

export function LookingForPicker({ value, open, onToggle, onChange }: Props) {
  const { t } = useI18n();
  const options: { value: LookingFor; label: string; emoji: string }[] = [
    { value: "hommes", label: t.form.lookingHommes, emoji: "👨" },
    { value: "femmes", label: t.form.lookingFemmes, emoji: "👩" },
  ];

  return (
    <div className="relative">
      <JoinIconButton
        label={t.form.lookingFor}
        caption={t.join.controlLooking}
        emoji="👨👩"
        active={Boolean(value)}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={onToggle}
      />
      <JoinMenu open={open} align="right">
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
