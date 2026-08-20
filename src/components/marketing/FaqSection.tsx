"use client";

import { Accordion, ScrollReveal } from "@/components/ui/Accordion";
import { Section } from "@/components/ui/Section";

type Item = {
  id: string;
  question: string;
  answer: string;
};

type Props = {
  eyebrow: string;
  title: string;
  items: Item[];
};

export function FaqSection({ eyebrow, title, items }: Props) {
  return (
    <Section narrow>
      <ScrollReveal>
        <p className="cam-eyebrow text-[var(--faint)]">{eyebrow}</p>
        <h2 className="cam-h2 mt-3">{title}</h2>
        <div className="mt-8">
          <Accordion items={items} />
        </div>
      </ScrollReveal>
    </Section>
  );
}
