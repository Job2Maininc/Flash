"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GenderPicker } from "@/components/join/GenderPicker";
import { JoinNameField } from "@/components/join/JoinNameField";
import { JoinStage } from "@/components/join/JoinStage";
import { LookingForPicker } from "@/components/join/LookingForPicker";
import { ScopePicker } from "@/components/join/ScopePicker";
import { Spinner } from "@/components/Spinner";
import { useI18n } from "@/components/LocaleProvider";
import { useOnlineCount } from "@/hooks/useOnlineCount";
import { GUEST_ERROR, type GuestErrorCode } from "@/lib/guest-errors";
import type { GlobalMode, LookingFor, MeetScope, Sex } from "@/lib/types";

type Panel = "gender" | "scope" | "looking" | null;

export function JoinVideoChat() {
  const router = useRouter();
  const { t } = useI18n();
  const onlineCount = useOnlineCount();
  const rootRef = useRef<HTMLFormElement>(null);
  const [nickname, setNickname] = useState("");
  const [sex, setSex] = useState<Sex | "">("");
  const [lookingFor, setLookingFor] = useState<LookingFor | "">("");
  const [meetScope, setMeetScope] = useState<MeetScope>("random");
  const [globalMode, setGlobalMode] = useState<GlobalMode | null>(null);
  const [openPanel, setOpenPanel] = useState<Panel>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpenPanel(null);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function translateError(code: string | undefined, fallback: string): string {
    if (code && code in GUEST_ERROR) {
      return t.errors[code as GuestErrorCode];
    }
    return fallback;
  }

  function toggle(panel: Exclude<Panel, null>) {
    setOpenPanel((current) => (current === panel ? null : panel));
  }

  function selectScope(next: MeetScope) {
    setMeetScope(next);
    if (next === "global") {
      setGlobalMode((current) => current ?? "all");
      return;
    }
    setGlobalMode(null);
    setOpenPanel(null);
  }

  function selectGlobalMode(mode: GlobalMode) {
    setMeetScope("global");
    setGlobalMode(mode);
    setOpenPanel(null);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname,
          sex,
          lookingFor,
          meetScope,
          globalMode: meetScope === "global" ? globalMode : null,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(translateError(data.error, t.form.continueError));
      }
      router.push("/browse");
    } catch (err) {
      setError(err instanceof Error ? err.message : t.form.genericError);
      setLoading(false);
    }
  }

  const ready =
    nickname.trim().length >= 2 &&
    Boolean(sex) &&
    Boolean(lookingFor) &&
    (meetScope !== "global" || Boolean(globalMode));

  return (
    <form
      ref={rootRef}
      onSubmit={onSubmit}
      className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-5 pb-10 pt-4"
    >
      <JoinStage onlineCount={onlineCount} />

      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <GenderPicker
            value={sex}
            open={openPanel === "gender"}
            onToggle={() => toggle("gender")}
            onChange={(next) => {
              setSex(next);
              setOpenPanel(null);
            }}
          />
          <div className="hidden min-w-0 flex-1 sm:block">
            <JoinNameField value={nickname} onChange={setNickname} />
          </div>
          <ScopePicker
            scope={meetScope}
            globalMode={globalMode}
            open={openPanel === "scope"}
            onToggle={() => toggle("scope")}
            onScope={selectScope}
            onGlobalMode={selectGlobalMode}
          />
          <div className="ml-auto">
            <LookingForPicker
              value={lookingFor}
              open={openPanel === "looking"}
              onToggle={() => toggle("looking")}
              onChange={(next) => {
                setLookingFor(next);
                setOpenPanel(null);
              }}
            />
          </div>
        </div>
        <div className="sm:hidden">
          <JoinNameField value={nickname} onChange={setNickname} />
        </div>
      </div>

      {error ? (
        <p className="text-sm text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading || !ready}
        className="flash-btn flash-btn-accent w-full rounded-2xl px-6 py-4 text-lg tracking-wide disabled:opacity-50"
      >
        {loading ? (
          <>
            <Spinner size="sm" />
            {t.join.starting}
          </>
        ) : (
          <>
            <span aria-hidden className="text-xl">
              📷
            </span>
            {t.join.startChat}
          </>
        )}
      </button>
      <p className="text-center text-xs leading-relaxed text-white/40">
        {t.form.legal}
      </p>
    </form>
  );
}
