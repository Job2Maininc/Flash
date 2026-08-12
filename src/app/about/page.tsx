import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { AmbientOrbs } from "@/components/AmbientOrbs";
import { stockImages } from "@/lib/stock-images";

export const metadata = {
  title: "À propos — Flash",
  description:
    "Flash est un site de rencontres en vidéo live : matching par préférences, swipe, et matches rappelables.",
};

export default function AboutPage() {
  return (
    <div className="relative min-h-dvh bg-[var(--paper)] text-[var(--ink)]">
      <AmbientOrbs variant="warm" className="opacity-50" />
      <SiteHeader />
      <main className="relative z-10 mx-auto max-w-3xl px-5 pb-20 pt-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--ink-faint)]">
          À propos
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-tight sm:text-5xl">
          Flash, c’est du dating. Vraiment.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-[var(--ink-muted)]">
          On a construit Flash pour les gens fatigués des profils photoshoppés
          et des conversations qui meurent dans le vide. Ici, tu te montres en
          vidéo, tu swipes, tu matches — et tu peux rappeler ceux qui t’ont
          fait tilt.
        </p>

        <div className="relative mt-10 aspect-[16/10] overflow-hidden">
          <Image
            src={stockImages.chemistry.src}
            alt={stockImages.chemistry.alt}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>

        <div className="mt-12 space-y-8 text-base leading-relaxed text-[var(--ink-muted)]">
          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              Notre promesse
            </h2>
            <p>
              Moins de fiction, plus de présence. Flash filtre les rencontres
              selon ton sexe et qui tu cherches, pour que chaque appel démarre
              sur une base honnête.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              Pour qui
            </h2>
            <p>
              Hommes, femmes, personnes non-binaires — hétéros, queer, curieux
              ·ses — dès 18 ans. Si tu cherches une connexion humaine avant un
              CV amoureux, tu es au bon endroit.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              Ce qu’on n’est pas
            </h2>
            <p>
              Pas un catalogue de photos. Pas un réseau social. Pas un jeu de
              likes anonymes sans suite. Flash, c’est un rendez-vous vidéo qui
              peut devenir un match durable.
            </p>
          </section>
        </div>

        <Link
          href="/#entrer"
          className="flash-btn flash-btn-primary mt-12 inline-flex px-6 py-3.5"
        >
          Rejoindre Flash
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
