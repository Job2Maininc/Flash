import { ScrollReveal } from "@/components/ui/Accordion";
import { Section } from "@/components/ui/Section";

type Bullet = {
  title: string;
  body: string;
};

type Props = {
  eyebrow: string;
  title: string;
  lead: string;
  bullets: Bullet[];
};

export function TrustSafety({ eyebrow, title, lead, bullets }: Props) {
  return (
    <Section alt seam>
      <ScrollReveal>
        <p className="cam-eyebrow">{eyebrow}</p>
        <h2 className="cam-h2 mt-3 max-w-[18ch]">{title}</h2>
        <p className="cam-body mt-4 max-w-[52ch] text-[var(--muted)] text-pretty">
          {lead}
        </p>
        <ul className="mt-10 max-w-2xl space-y-6">
          {bullets.map((bullet) => (
            <li key={bullet.title} className="border-t border-[var(--ink-600)] pt-5">
              <h3 className="font-[family-name:var(--font-camera-display)] text-lg font-semibold text-[var(--cam-paper)]">
                {bullet.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)] text-pretty">
                {bullet.body}
              </p>
            </li>
          ))}
        </ul>
      </ScrollReveal>
    </Section>
  );
}
