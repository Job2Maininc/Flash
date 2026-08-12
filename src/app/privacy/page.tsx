import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { AmbientOrbs } from "@/components/AmbientOrbs";

export const metadata = {
  title: "Confidentialité — Flash",
  description:
    "Comment Flash traite ton pseudo, tes préférences, et les données d’appel vidéo.",
};

export default function PrivacyPage() {
  return (
    <div className="relative min-h-dvh bg-[var(--paper)] text-[var(--ink)]">
      <AmbientOrbs variant="warm" className="opacity-50" />
      <SiteHeader />
      <main className="relative z-10 mx-auto max-w-3xl px-5 pb-20 pt-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--ink-faint)]">
          Confidentialité
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-tight sm:text-5xl">
          Transparent sur ce qu’on garde.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-[var(--ink-muted)]">
          Flash fonctionne en mode invité : pas de compte email obligatoire.
          Voici, en clair, ce qui circule pour que le dating vidéo marche.
        </p>

        <div className="mt-12 space-y-10 text-base leading-relaxed text-[var(--ink-muted)]">
          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              Ce que tu nous donnes
            </h2>
            <p>
              Pseudo, sexe, et qui tu cherches. Ces infos servent au matching
              et à afficher ton identité pendant l’appel. Elles sont liées à un
              cookie de session signé sur ton appareil.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              Vidéo & audio
            </h2>
            <p>
              Les flux caméra/micro transitent via notre partenaire LiveKit pour
              l’appel en temps réel. Flash ne stocke pas tes enregistrements
              d’appel.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              Matches & file
            </h2>
            <p>
              La file d’attente, les sessions, et la liste de matches sont
              stockées temporairement (Redis) pour faire tourner le produit.
              Les matches restent disponibles pour le rappel vidéo.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              Tes leviers
            </h2>
            <p>
              Tu peux quitter un appel à tout moment, changer de pseudo en
              repartant de la page d’accueil, et limiter ce que montre ta
              caméra. Pour toute demande liée à tes données, contacte
              l’équipe Flash via le canal indiqué sur le déploiement.
            </p>
          </section>
        </div>

        <Link
          href="/safety"
          className="mt-12 inline-flex text-sm font-medium text-[var(--ink)] underline-offset-4 hover:underline"
        >
          Voir aussi nos règles de sécurité →
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
