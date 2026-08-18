import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { JoinVideoChat } from "@/components/join/JoinVideoChat";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return {
    title: t.join.metaTitle,
    description: t.join.metaDescription,
  };
}

export default function JoinPage() {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[var(--surface-dark)] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#3a2c18_0%,_transparent_42%)] opacity-70"
      />
      <SiteHeader variant="dark" />
      <main className="relative z-10">
        <JoinVideoChat />
      </main>
    </div>
  );
}
