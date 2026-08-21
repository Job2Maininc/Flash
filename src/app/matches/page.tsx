import Link from "next/link";
import { FlashBrand } from "@/components/FlashBrand";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MatchesList } from "@/components/MatchesList";
import { Button } from "@/components/ui/Button";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { getGuestFromCookie } from "@/lib/guest";
import { listMatches } from "@/lib/matching";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n";

export default async function MatchesPage() {
  const t = getDictionary(await getLocale());
  let guest = null;
  try {
    guest = await getGuestFromCookie();
  } catch {
    guest = null;
  }

  let matches: Awaited<ReturnType<typeof listMatches>> = [];
  if (guest) {
    try {
      matches = await listMatches(guest.id);
    } catch {
      matches = [];
    }
  }

  return (
    <div className="relative min-h-dvh bg-[var(--ink-900)] text-[var(--cam-paper)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 80% 0%, rgba(255,67,38,0.16), transparent 55%)",
        }}
      />
      <NoiseOverlay className="opacity-[0.04]" />

      <header className="relative z-10 flex items-center justify-between px-5 safe-top">
        <Link
          href={guest ? "/browse" : "/"}
          className="rounded-[var(--radius-pill)] border border-[var(--ink-600)] bg-[var(--ink-800)]/70 px-3.5 py-1.5 text-sm text-[var(--cam-paper)]/70 backdrop-blur-sm transition-colors hover:bg-[var(--ink-700)] hover:text-[var(--cam-paper)]"
        >
          {guest ? t.nav.backToCall : t.nav.howItWorks}
        </Link>
        <FlashBrand
          href="/"
          glow="strong"
          wordmarkClassName="text-[var(--cam-paper)]"
        />
        <LanguageSwitcher variant="dark" />
      </header>

      <main id="main" className="relative z-10 mx-auto w-full max-w-lg px-5 pb-12 pt-8">
        <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight">
          {t.matches.title}
          {matches.length > 0 ? (
            <span className="ml-2 align-middle font-[family-name:var(--font-mono)] text-lg font-normal tabular-nums text-[var(--cam-paper)]/45">
              ({matches.length})
            </span>
          ) : null}
        </h1>

        {guest ? (
          <>
            <p className="mt-2 text-sm text-[var(--cam-paper)]/55">
              {t.matches.subtitlePrefix}{" "}
              <span className="font-medium text-[var(--cam-paper)]">
                {guest.nickname}
              </span>
            </p>
            <div className="mt-8">
              <MatchesList initialMatches={matches} />
            </div>
          </>
        ) : (
          <div className="mt-8 space-y-6">
            <p className="cam-body text-[var(--muted)]">{t.matches.emptyBody}</p>
            <p className="text-[13px] font-medium text-[var(--muted)]">
              {t.matches.loginPrompt}
            </p>
            <Link href="/join" className="inline-flex">
              <Button size="lg">{t.nav.login}</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
