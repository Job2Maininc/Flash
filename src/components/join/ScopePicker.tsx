"use client";

import type { GlobalMode, MeetScope } from "@/lib/types";
import { JoinIconButton } from "@/components/join/JoinIconButton";
import { JoinMenu, JoinMenuItem } from "@/components/join/JoinMenu";
import { useI18n } from "@/components/LocaleProvider";

type Props = {
  scope: MeetScope;
  globalMode: GlobalMode | null;
  open: boolean;
  onToggle: () => void;
  onScope: (scope: MeetScope) => void;
  onGlobalMode: (mode: GlobalMode) => void;
};

export function ScopePicker({
  scope,
  globalMode,
  open,
  onToggle,
  onScope,
  onGlobalMode,
}: Props) {
  const { t } = useI18n();

  return (
    <div className="relative">
      <JoinIconButton
        label={t.join.scopeLabel}
        active
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={onToggle}
      >
        {scope === "local" ? "📍" : "🌍"}
      </JoinIconButton>
      <JoinMenu open={open}>
        <JoinMenuItem
          active={scope === "local"}
          onClick={() => onScope("local")}
        >
          <span>📍</span>
          {t.join.scopeLocal}
        </JoinMenuItem>
        <JoinMenuItem
          active={scope === "global"}
          onClick={() => onScope("global")}
        >
          <span>🌍</span>
          {t.join.scopeGlobal}
        </JoinMenuItem>
        {scope === "global" ? (
          <div className="ml-2 mt-1 space-y-0.5 border-l border-white/15 pl-2">
            <JoinMenuItem
              active={globalMode === "all"}
              onClick={() => onGlobalMode("all")}
            >
              {t.join.scopeAllCountries}
            </JoinMenuItem>
            <JoinMenuItem
              active={globalMode === "random"}
              onClick={() => onGlobalMode("random")}
            >
              {t.join.scopeGlobalRandom}
            </JoinMenuItem>
          </div>
        ) : null}
        <JoinMenuItem
          active={scope === "random"}
          onClick={() => onScope("random")}
        >
          <span>🎲</span>
          {t.join.scopeRandom}
        </JoinMenuItem>
      </JoinMenu>
    </div>
  );
}
