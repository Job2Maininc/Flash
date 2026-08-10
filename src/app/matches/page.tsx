import Link from "next/link";
import { redirect } from "next/navigation";
import { FlashBrand } from "@/components/FlashBrand";
import { MatchesList } from "@/components/MatchesList";
import { getGuestFromCookie } from "@/lib/guest";
import { listMatches } from "@/lib/matching";

export default async function MatchesPage() {
  let guest = null;
  try {
    guest = await getGuestFromCookie();
  } catch {
    guest = null;
  }

  if (!guest) {
    redirect("/");
  }

  let matches: Awaited<ReturnType<typeof listMatches>> = [];
  try {
    matches = await listMatches(guest.id);
  } catch {
    matches = [];
  }

  return (
    <div className="relative min-h-dvh bg-[var(--paper)] text-[var(--ink)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#ffe08a55_0%,_transparent_42%),radial-gradient(ellipse_at_0%_100%,_#ffb4a233_0%,_transparent_45%)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 flash-grain" />

      <header className="relative z-10 flex items-center justify-between px-5 safe-top">
        <Link
          href="/browse"
          className="flash-btn rounded-full border border-[var(--ink)]/10 bg-white/40 px-3.5 py-1.5 text-sm text-[var(--ink-muted)] backdrop-blur-sm hover:bg-white/70 hover:text-[var(--ink)]"
        >
          ← Appel
        </Link>
        <FlashBrand glow="strong" wordmarkClassName="text-[var(--ink)]" />
      </header>

      <main className="relative z-10 mx-auto w-full max-w-lg px-5 pb-12 pt-8">
        <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight">
          Matches
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          Connecté en tant que{" "}
          <span className="font-medium text-[var(--ink)]">{guest.nickname}</span>
        </p>
        <div className="mt-8">
          <MatchesList initialMatches={matches} />
        </div>
      </main>
    </div>
  );
}
