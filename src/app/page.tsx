import Link from "next/link";
import { GuestForm } from "@/components/GuestForm";
import { FlashBrand } from "@/components/FlashBrand";
import { FlashLogo } from "@/components/FlashLogo";
import { AmbientOrbs } from "@/components/AmbientOrbs";
import { FeatureChips } from "@/components/FeatureChips";
import { clearGuestCookie } from "@/lib/guest";

export default async function HomePage() {
  // Always start fresh: no auto-login from a previous session cookie.
  try {
    await clearGuestCookie();
  } catch {
    // Ignore cookie errors so the landing form still renders.
  }

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,_#ffe08a_0%,_transparent_45%),radial-gradient(ellipse_at_100%_80%,_#ffb4a2_0%,_transparent_40%),linear-gradient(160deg,_#f3ebe0_0%,_#e8dcc8_100%)]"
      />
      <AmbientOrbs variant="warm" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12] flash-grain"
      />

      <header className="relative z-10 flex items-center justify-between px-5 safe-top">
        <FlashBrand
          wordmarkClassName="text-3xl text-[var(--ink)]"
          glow="strong"
        />
        <Link
          href="/matches"
          className="flash-btn rounded-full border border-[var(--ink)]/10 bg-white/35 px-3.5 py-1.5 text-sm text-[var(--ink-muted)] backdrop-blur-sm hover:bg-white/60 hover:text-[var(--ink)]"
        >
          Matches
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 flex-col justify-end gap-8 px-5 pb-12 pt-16 sm:justify-center sm:pb-24 safe-bottom">
        <div className="max-w-md flash-fade-in">
          <div className="flex items-center gap-4">
            <FlashLogo size={72} glow="strong" />
            <h1 className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-[var(--ink)] sm:text-6xl">
              Flash
            </h1>
          </div>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-[var(--ink-muted)]">
            Appel vidéo en continu. Swipe pour le suivant — droite pour matcher
            et rappeler plus tard.
          </p>
          <FeatureChips />
        </div>
        <GuestForm />
      </main>
    </div>
  );
}
