"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { JoinField, JoinFieldIcon } from "@/components/join/JoinField";
import { JoinStage } from "@/components/join/JoinStage";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/components/LocaleProvider";
import { COUNTRIES } from "@/lib/countries";
import { GUEST_ERROR, type GuestErrorCode } from "@/lib/guest-errors";
import {
  prefGenderToSex,
  prefSeekingToLooking,
  readHeroPrefs,
  writeHeroPrefs,
  sexToPrefGender,
  lookingToPrefSeeking,
} from "@/lib/hero-prefs";
import type { LookingFor, MeetScope, Sex } from "@/lib/types";
import { cn } from "@/lib/cn";

const selectClass =
  "min-w-0 flex-1 appearance-none bg-transparent py-3 text-base text-[var(--cam-paper)] focus:outline-none";

function JoinVideoChatForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, locale } = useI18n();
  const [nickname, setNickname] = useState("");
  const [sex, setSex] = useState<Sex | "">("");
  const [lookingFor, setLookingFor] = useState<LookingFor | "">("");
  const [meetScope, setMeetScope] = useState<MeetScope>("random");
  const [preferredCountry, setPreferredCountry] = useState("");
  const [showCountryList, setShowCountryList] = useState(false);
  const [prefsFromHero, setPrefsFromHero] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fromQueryG = prefGenderToSex(searchParams.get("g"));
    const fromQueryS = prefSeekingToLooking(searchParams.get("seeking"));
    const stored = readHeroPrefs();
    const fromStoreG = prefGenderToSex(stored.g);
    const fromStoreS = prefSeekingToLooking(stored.seeking);

    const nextSex = fromQueryG ?? fromStoreG;
    const nextLooking = fromQueryS ?? fromStoreS;

    if (nextSex) setSex(nextSex);
    if (nextLooking) setLookingFor(nextLooking);
    if (nextSex || nextLooking) {
      setPrefsFromHero(true);
      writeHeroPrefs({
        ...(nextSex ? { g: sexToPrefGender(nextSex) } : {}),
        ...(nextLooking ? { seeking: lookingToPrefSeeking(nextLooking) } : {}),
      });
    }
  }, [searchParams]);

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
          ageConfirmed,
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
    if (!ageConfirmed) return t.join.missingAge;
    return null;
  })();

  const ready = missingHint === null;

  function pickAnywhere() {
    setMeetScope("random");
    setPreferredCountry("");
    setShowCountryList(false);
  }

  function pickNearby() {
    setMeetScope("local");
    setPreferredCountry("");
    setShowCountryList(false);
  }

  function pickCountry(code: string) {
    setMeetScope("global");
    setPreferredCountry(code);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex w-full max-w-lg flex-col gap-5 px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-4"
    >
      <JoinStage />

      {prefsFromHero ? (
        <div className="flex items-start justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--ink-600)] bg-[var(--ink-800)] px-3.5 py-3">
          <p className="text-sm leading-relaxed text-[var(--cam-paper)]">
            {t.join.prefsImported}
          </p>
          <button
            type="button"
            className="shrink-0 text-sm font-medium text-[var(--key-400)] underline-offset-4 hover:underline"
            onClick={() => setPrefsFromHero(false)}
          >
            {t.join.prefsChange}
          </button>
        </div>
      ) : null}

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
            onChange={(e) => {
              setSex(e.target.value as Sex | "");
              setPrefsFromHero(false);
            }}
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
            onChange={(e) => {
              setLookingFor(e.target.value as LookingFor | "");
              setPrefsFromHero(false);
            }}
            aria-label={t.form.lookingFor}
            className={selectClass}
          >
            <option value="">{t.join.selectLooking}</option>
            <option value="hommes">{t.form.lookingHommes}</option>
            <option value="femmes">{t.form.lookingFemmes}</option>
            <option value="tous">{t.form.lookingTous}</option>
          </select>
        </JoinField>

        <div className="space-y-3">
          <p className="text-[13px] font-medium text-[var(--muted)]">
            {t.join.controlCountry}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={pickAnywhere}
              className={cn(
                "min-h-[4.5rem] rounded-[var(--radius-lg)] border px-3 py-3 text-left transition",
                meetScope === "random" && !preferredCountry
                  ? "border-[var(--cam-paper)] bg-[var(--cam-paper)] text-[var(--ink-900)]"
                  : "border-[var(--ink-600)] bg-[var(--ink-800)] text-[var(--cam-paper)]",
              )}
            >
              <span className="block text-sm font-medium">
                {t.join.scopeAnywhere}
              </span>
              <span
                className={cn(
                  "mt-1 block text-xs leading-snug",
                  meetScope === "random" && !preferredCountry
                    ? "text-[var(--ink-700)]"
                    : "text-[var(--muted)]",
                )}
              >
                {t.join.scopeAnywhereHint}
              </span>
            </button>
            <button
              type="button"
              onClick={pickNearby}
              className={cn(
                "min-h-[4.5rem] rounded-[var(--radius-lg)] border px-3 py-3 text-left transition",
                meetScope === "local"
                  ? "border-[var(--cam-paper)] bg-[var(--cam-paper)] text-[var(--ink-900)]"
                  : "border-[var(--ink-600)] bg-[var(--ink-800)] text-[var(--cam-paper)]",
              )}
            >
              <span className="block text-sm font-medium">
                {t.join.scopeNearby}
              </span>
              <span
                className={cn(
                  "mt-1 block text-xs leading-snug",
                  meetScope === "local"
                    ? "text-[var(--ink-700)]"
                    : "text-[var(--muted)]",
                )}
              >
                {t.join.scopeNearbyHint}
              </span>
            </button>
          </div>

          {!showCountryList ? (
            <button
              type="button"
              onClick={() => setShowCountryList(true)}
              className="text-sm font-medium text-[var(--key-400)] underline-offset-4 hover:underline"
            >
              {t.join.scopePickCountry}
            </button>
          ) : (
            <JoinField
              label={t.join.scopeAllCountries}
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
                value={preferredCountry}
                onChange={(e) => pickCountry(e.target.value)}
                aria-label={t.join.scopeAllCountries}
                className={selectClass}
              >
                <option value="">{t.join.selectCountry}</option>
                {sortedCountries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {locale === "de" ? country.de : country.en}
                  </option>
                ))}
              </select>
            </JoinField>
          )}
        </div>
      </div>

      {error ? (
        <p className="text-sm text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}

      <p className="text-center text-xs leading-relaxed text-[var(--muted)] text-pretty">
        {t.join.safetyReminder}
      </p>

      <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-[var(--ink-600)] bg-[var(--ink-800)] px-3.5 py-3">
        <input
          type="checkbox"
          checked={ageConfirmed}
          onChange={(e) => setAgeConfirmed(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-[var(--key-500)]"
          required
        />
        <span className="text-sm leading-relaxed text-[var(--cam-paper)]">
          {t.form.ageConfirm}
        </span>
      </label>

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

export function JoinVideoChat() {
  return (
    <Suspense fallback={null}>
      <JoinVideoChatForm />
    </Suspense>
  );
}
