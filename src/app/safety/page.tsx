import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { AmbientOrbs } from "@/components/AmbientOrbs";
import { stockImages } from "@/lib/stock-images";

export const metadata = {
  title: "Sécurité — Flash",
  description:
    "Règles de sécurité Flash : 18+, consentement, respect en vidéo, et bonnes pratiques caméra.",
};

const tips = [
  {
    title: "18+ uniquement",
    body: "Flash est réservé aux adultes. Si tu as un doute sur l’âge d’un partenaire, quitte l’appel.",
  },
  {
    title: "Consentement d’abord",
    body: "La vidéo n’est pas un droit. Respecte un non, un silence, un malaise — swipe left et passe à autre chose.",
  },
  {
    title: "Pas de harcèlement",
    body: "Insultes, menaces, exhibition non consentie : hors jeu. Les comptes abusifs peuvent être bloqués.",
  },
  {
    title: "Protège ton cadre",
    body: "Évite d’afficher adresse, documents, ou infos bancaires. Tu contrôles ce que montre ta caméra.",
  },
  {
    title: "Fais confiance à ton instinct",
    body: "Un comportement bizarre ? Coupe. Tu n’as rien à justifier. Le prochain flash attend.",
  },
];

export default function SafetyPage() {
  return (
    <div className="relative min-h-dvh bg-[var(--paper)] text-[var(--ink)]">
      <AmbientOrbs variant="warm" className="opacity-50" />
      <SiteHeader />
      <main className="relative z-10 mx-auto max-w-3xl px-5 pb-20 pt-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--ink-faint)]">
          Sécurité
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-tight sm:text-5xl">
          Des rencontres sexy, pas toxiques.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-[var(--ink-muted)]">
          Le dating vidéo demande du respect mutuel. Voici le cadre Flash —
          clair, non négociable, et pensé pour que tu restes en contrôle.
        </p>

        <div className="relative mt-10 aspect-[16/10] overflow-hidden">
          <Image
            src={stockImages.safety.src}
            alt={stockImages.safety.alt}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>

        <ul className="mt-12 space-y-8">
          {tips.map((tip) => (
            <li key={tip.title}>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
                {tip.title}
              </h2>
              <p className="mt-2 text-base leading-relaxed text-[var(--ink-muted)]">
                {tip.body}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-12 text-sm leading-relaxed text-[var(--ink-faint)]">
          En cas d’urgence hors ligne, contacte les services locaux. Flash
          facilite la rencontre ; ta sécurité reste entre tes mains.
        </p>

        <Link
          href="/#entrer"
          className="flash-btn flash-btn-primary mt-10 inline-flex px-6 py-3.5"
        >
          J’ai compris, je commence
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
