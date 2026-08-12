import Image from "next/image";
import Link from "next/link";
import { GuestForm } from "@/components/GuestForm";
import { FeatureChips } from "@/components/FeatureChips";
import { MarketingSection } from "@/components/MarketingSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { AmbientOrbs } from "@/components/AmbientOrbs";
import { clearGuestCookie } from "@/lib/guest";
import { stockImages } from "@/lib/stock-images";

const steps = [
  {
    title: "Dis qui tu es",
    body: "Pseudo, sexe, et qui tu cherches. On filtre pour des rencontres qui ont du sens.",
  },
  {
    title: "Parle en live",
    body: "Appel vidéo immédiat. La chimie, ça se voit — pas sur une bio de 2019.",
  },
  {
    title: "Swipe & rappelle",
    body: "Droite pour matcher, gauche pour le suivant. Un match ? Tu le rappelles quand tu veux.",
  },
];

const testimonials = [
  {
    quote:
      "Enfin un dating où on arrête de scroller des photos. En deux flashes j’avais une vraie conversation.",
    name: "Camille",
    detail: "Paris · cherche hommes",
  },
  {
    quote:
      "Le filtre ‘je cherche’ change tout. Moins de galères, plus de gens alignés avec ce que je veux.",
    name: "Noah",
    detail: "Lyon · cherche femmes",
  },
  {
    quote:
      "Match + rappel vidéo = le combo. On a reprend un café virtuel le lendemain sans perdre le fil.",
    name: "Inès",
    detail: "Bordeaux · cherche tout le monde",
  },
];

export default async function HomePage() {
  try {
    await clearGuestCookie();
  } catch {
    // Ignore cookie errors so the landing form still renders.
  }

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[var(--paper)] text-[var(--ink)]">
      <AmbientOrbs variant="warm" className="opacity-70" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.1] flash-grain"
      />

      <SiteHeader />

      <section className="relative mt-4 min-h-[min(88dvh,920px)] overflow-hidden">
        <Image
          src={stockImages.hero.src}
          alt={stockImages.hero.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[var(--paper)] via-[var(--paper)]/55 to-black/25"
        />
        <div className="relative z-10 flex min-h-[min(88dvh,920px)] flex-col justify-end px-5 pb-14 pt-28 sm:pb-20">
          <div className="mx-auto w-full max-w-5xl flash-fade-in">
            <p className="font-[family-name:var(--font-display)] text-6xl tracking-tight text-[var(--ink)] sm:text-7xl md:text-8xl">
              Flash
            </p>
            <h1 className="mt-4 max-w-xl font-[family-name:var(--font-display)] text-3xl leading-tight tracking-tight text-[var(--ink)] sm:text-4xl">
              Le dating en vidéo live, pas en galerie de portraits.
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--ink-muted)] sm:text-lg">
              Rencontres consenties, matching selon ton sexe et qui tu
              cherches, swipe pour le spark — ou le suivant.
            </p>
            <FeatureChips />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/#entrer"
                className="flash-btn flash-btn-primary px-6 py-3.5 text-base"
              >
                Commencer gratuitement
              </Link>
              <Link
                href="/about"
                className="flash-btn rounded-full border border-[var(--ink)]/15 bg-white/55 px-6 py-3.5 text-base text-[var(--ink)] backdrop-blur-sm hover:bg-white/80"
              >
                Pourquoi Flash
              </Link>
            </div>
          </div>
        </div>
      </section>

      <MarketingSection
        id="comment-ca-marche"
        eyebrow="Comment ça marche"
        title="Trois gestes. Une vraie rencontre."
        lead="Flash mélange l’énergie d’un appel spontané et la précision d’un dating moderne."
        image={stockImages.videoDate}
      >
        <ol className="mt-8 space-y-5">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink-faint)]">
                0{index + 1}
              </span>
              <div>
                <p className="font-medium text-[var(--ink)]">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--ink-muted)]">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </MarketingSection>

      <MarketingSection
        eyebrow="Pourquoi Flash"
        title="Moins de swipe de photos. Plus de présence."
        lead="On te vend du vrai : des visages qui bougent, des voix qui hésitent, des rires qui ne se retouchent pas."
        image={stockImages.chemistry}
        reverse
      >
        <ul className="mt-8 space-y-3 text-sm leading-relaxed text-[var(--ink-muted)]">
          <li>
            Matching intelligent selon ton sexe et qui tu cherches — pour
            éviter les malentendus.
          </li>
          <li>
            Appel vidéo permanent : tu ne « likes » pas un profil, tu sens
            une chimie.
          </li>
          <li>
            Matches rappelables : garde le fil avec les personnes qui t’ont
            fait tilt.
          </li>
          <li>
            Approche inclusive : hommes, femmes, personnes non-binaires —
            tout le monde a sa place.
          </li>
        </ul>
      </MarketingSection>

      <section className="relative px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--ink-faint)]">
            Ils ont flashé
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-tight sm:text-4xl">
            Des rencontres qui commencent vraiment.
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {testimonials.map((item) => (
              <blockquote key={item.name} className="space-y-4">
                <p className="text-base leading-relaxed text-[var(--ink-muted)]">
                  “{item.quote}”
                </p>
                <footer>
                  <p className="font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
                    {item.name}
                  </p>
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink-faint)]">
                    {item.detail}
                  </p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section
        id="entrer"
        className="relative border-t border-[var(--ink)]/10 px-5 py-16 sm:py-20"
      >
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--ink-faint)]">
              Entrer sur Flash
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-tight sm:text-4xl">
              Prêt·e pour ton prochain flash ?
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--ink-muted)]">
              Gratuit pour commencer. Caméra + micro requis. Respect,
              consentement, et zéro ghosting forcé : swipe et on avance.
            </p>
            <div className="relative mt-8 hidden aspect-[5/4] overflow-hidden lg:block">
              <Image
                src={stockImages.community.src}
                alt={stockImages.community.alt}
                fill
                sizes="40vw"
                className="object-cover"
              />
            </div>
          </div>
          <GuestForm />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
