import Link from "next/link";
import { GuestForm } from "@/components/GuestForm";
import { getGuestFromCookie } from "@/lib/guest";
import { redirect } from "next/navigation";

export default async function HomePage() {
  let guest = null;
  try {
    guest = await getGuestFromCookie();
  } catch {
    guest = null;
  }

  if (guest) {
    redirect("/browse");
  }

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,_#ffe08a_0%,_transparent_45%),radial-gradient(ellipse_at_100%_80%,_#ffb4a2_0%,_transparent_40%),linear-gradient(160deg,_#f3ebe0_0%,_#e8dcc8_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:repeating-linear-gradient(-12deg,transparent,transparent_12px,#1a1410_12px,#1a1410_13px)]"
      />

      <header className="relative z-10 flex items-center justify-between px-5 pt-6">
        <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)]">
          Flash
        </p>
        <Link
          href="/matches"
          className="text-sm text-[var(--ink-muted)] underline-offset-4 hover:underline"
        >
          Matches
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 flex-col justify-end gap-8 px-5 pb-12 pt-16 sm:justify-center sm:pb-24">
        <div className="max-w-md">
          <h1 className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-[var(--ink)] sm:text-6xl">
            Flash
          </h1>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-[var(--ink-muted)]">
            Appel vidéo en continu. Swipe pour le suivant — droite pour matcher
            et rappeler plus tard.
          </p>
        </div>
        <GuestForm />
      </main>
    </div>
  );
}
