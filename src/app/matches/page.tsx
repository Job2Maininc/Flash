import Link from "next/link";
import { redirect } from "next/navigation";
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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#ffe08a55_0%,_transparent_40%)]"
      />
      <header className="relative z-10 flex items-center justify-between px-5 pt-6">
        <Link
          href="/browse"
          className="text-sm text-[var(--ink-muted)] underline-offset-4 hover:underline"
        >
          ← Retour
        </Link>
        <p className="font-[family-name:var(--font-display)] text-2xl">Flash</p>
      </header>
      <main className="relative z-10 mx-auto w-full max-w-lg px-5 py-10">
        <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight">
          Matches
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          Connecté en tant que {guest.nickname}
        </p>
        <div className="mt-8">
          <MatchesList initialMatches={matches} />
        </div>
      </main>
    </div>
  );
}
