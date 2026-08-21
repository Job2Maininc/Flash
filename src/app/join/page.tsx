import type { Metadata } from "next";
import { CameraHeader } from "@/components/marketing/CameraHeader";
import { JoinVideoChat } from "@/components/join/JoinVideoChat";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
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
    <div className="relative min-h-dvh overflow-x-hidden bg-[var(--ink-900)] text-[var(--cam-paper)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255,67,38,0.18), transparent 55%)",
        }}
      />
      <NoiseOverlay className="opacity-[0.04]" />
      <CameraHeader />
      <main id="main" className="relative z-10 pt-20">
        <JoinVideoChat />
      </main>
    </div>
  );
}
