"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { JoinField, JoinFieldIcon } from "@/components/join/JoinField";
import { JoinStage } from "@/components/join/JoinStage";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/components/LocaleProvider";
import { useOnlineCount } from "@/hooks/useOnlineCount";
import { COUNTRIES } from "@/lib/countries";
import { GUEST_ERROR, type GuestErrorCode } from "@/lib/guest-errors";
import type { LookingFor, MeetScope, Sex } from "@/lib/types";
import { cn } from "@/lib/cn";

const selectClass =
  "min-w-0 flex-1 appearance-none bg-transparent py-3 text-base text-[var(--cam-paper)] focus:outline-none";

export function JoinVideoChat() {
  const router = useRouter();
  const { t, locale } = useI18n();
  const onlineCount = useOnlineCount();
  const [nickname, setNickname] = useState("");
  const [sex, setSex] = useState<Sex | "">("");
  const [lookingFor, setLookingFor] = useState<LookingFor | "">("");
  const [meetScope, setMeetScope] = useState<MeetScope>("random");
  const [preferredCountry, setPreferredCountry] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sortedCountries = useMemo(() => {
    const key = locale === "de" ? "de" : "en";
    return [...COUNTRIES].sort((a, b) =>
      a[key].localeCompare(b[key], locale, { sensitivity: "base" }),
    );
  }, [locale]);

  function translateError(code: string | undefined, fallback: string): string {
    if (code && code in GUEST_ERROR) {
      return t.errors[code as GuestErrorCode];
    }
    return fallback;
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
          preferredCountry:
            meetScope === "global" ? preferredCountry || null : null,
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

  const missingHint = (() => {
    if (nickname.trim().length < 2) return t.join.missingName;
    if (!sex) return t.join.missingGender;
    if (!lookingFor) return t.join.missingLooking;
    if (meetScope === "global" && !preferredCountry) {
      return t.join.missingCountry;
    }
    return null;
  })();

  const ready = missingHint === null;

  const locationValue =
    meetScope === "global" && preferredCountry
      ? `country:${preferredCountry}`
      : meetScope;

  function onLocationChange(value: string) {
    if (value === "local" || value === "random") {
      setMeetScope(value);
      setPreferredCountry("");
      return;
    }
    if (value.startsWith("country:")) {
      setMeetScope("global");
      setPreferredCountry(value.slice("country:".length));
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex w-full max-w-lg flex-col gap-6 px-5 pb-10 pt-4"
    >
      <JoinStage onlineCount={onlineCount} />

      <div className="flex flex-col gap-4">
        <JoinField
          label={t.join.controlName}
          icon={
            <JoinFieldIcon>
              <path
                d="M4 20v-1.5A3.5 3.5 0 017.5 15h3A3.5 3.5 0 0114 18.5V20"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle
                cx="9"
                cy="8"
                r="3"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M16 11h5M18.5 8.5v5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </JoinFieldIcon>
          }
        >
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={24}
            autoComplete="nickname"
            placeholder={t.form.placeholder}
            aria-label={t.form.nickname}
            className={cn(selectClass, "placeholder:text-[var(--faint)]")}
          />
        </JoinField>

        <JoinField
          label={t.join.controlGender}
          icon={
            <JoinFieldIcon>
              <circle
                cx="12"
                cy="8"
                r="3"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M5 20v-1a5 5 0 0110 0v1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </JoinFieldIcon>
          }
        >
          <select
            value={sex}
            onChange={(e) => setSex(e.target.value as Sex | "")}
            aria-label={t.form.iAm}
            className={selectClass}
          >
            <option value="">{t.join.selectGender}</option>
            <option value="homme">{t.form.sexHomme}</option>
            <option value="femme">{t.form.sexFemme}</option>
            <option value="non_binaire">{t.form.sexNonBinaire}</option>
          </select>
        </JoinField>

        <JoinField
          label={t.join.controlLooking}
          icon={
            <JoinFieldIcon>
              <circle
                cx="9"
                cy="9"
                r="3"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle
                cx="16"
                cy="10"
                r="2.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M3 19v-.5A4.5 4.5 0 017.5 14h1A4.5 4.5 0 0113 18.5V19M14 19v-.5a3.5 3.5 0 013.5-3.5h.5A3.5 3.5 0 0121 18.5V19"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </JoinFieldIcon>
          }
        >
          <select
            value={lookingFor}
            onChange={(e) =>
              setLookingFor(e.target.value as LookingFor | "")
            }
            aria-label={t.form.lookingFor}
            className={selectClass}
          >
            <option value="">{t.join.selectLooking}</option>
            <option value="hommes">{t.form.lookingHommes}</option>
            <option value="femmes">{t.form.lookingFemmes}</option>
            <option value="tous">{t.form.lookingTous}</option>
          </select>
        </JoinField>

        <JoinField
          label={t.join.controlCountry}
          icon={
            <JoinFieldIcon>
              <circle
                cx="12"
                cy="12"
                r="8"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M4 12h16M12 4c2.5 2.8 2.5 13.2 0 16M12 4c-2.5 2.8-2.5 13.2 0 16"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </JoinFieldIcon>
          }
        >
          <select
            value={locationValue}
            onChange={(e) => onLocationChange(e.target.value)}
            aria-label={t.join.scopeLabel}
            className={selectClass}
          >
            <option value="random">{t.join.scopeRandom}</option>
            <option value="local">{t.join.scopeLocal}</option>
            <optgroup label={t.join.scopeAllCountries}>
              {sortedCountries.map((country) => (
                <option key={country.code} value={`country:${country.code}`}>
                  {locale === "de" ? country.de : country.en}
                </option>
              ))}
            </optgroup>
          </select>
        </JoinField>
      </div>

      {error ? (
        <p className="text-sm text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}

      <p className="text-center text-xs leading-relaxed text-[var(--muted)] text-pretty">
        {t.join.safetyReminder}
      </p>

      <div className="flex flex-col gap-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          disabled={loading || !ready}
          className="w-full rounded-[var(--radius-pill)] tracking-wide"
        >
          {loading ? t.join.starting : t.join.startChat}
        </Button>
        {!ready && missingHint ? (
          <p className="text-center text-xs text-[var(--faint)]">
            {missingHint}
          </p>
        ) : null}
      </div>

      <p className="text-center text-[11px] leading-relaxed text-[var(--faint)]">
        {t.form.legal}
      </p>
    </form>
  );
}
