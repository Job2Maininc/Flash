"use client";

import { useEffect, useRef } from "react";
import { ScrollReveal } from "@/components/ui/Accordion";
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

/**
 * Native details/summary FAQ — hash `/#faq-camera` opens and scrolls to that item.
 */
export function FaqSection({ eyebrow, title, items }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function openFromHash() {
      const id = window.location.hash.replace(/^#/, "");
      if (!id) return;
      const el = document.getElementById(id);
      if (!(el instanceof HTMLDetailsElement)) return;
      el.open = true;
      // Let layout settle after open before scrolling.
      requestAnimationFrame(() => {
        el.scrollIntoView({ block: "start", behavior: "smooth" });
      });
    }

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return (
    <Section id="faq" narrow seam>
      <ScrollReveal>
        <p className="cam-eyebrow">{eyebrow}</p>
        <h2 className="cam-h2 mt-3">{title}</h2>
        <div ref={rootRef} className="mt-8 divide-y divide-[var(--ink-700)]">
          {items.map((item) => (
            <details
              key={item.id}
              id={item.id}
              className="group py-1 open:pb-1"
            >
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-[family-name:var(--font-camera-display)] text-[1.125rem] font-semibold tracking-tight text-[var(--cam-paper)] sm:text-[1.35rem] [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  aria-hidden
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--ink-600)] text-[var(--faint)] transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)] group-open:rotate-180"
                >
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M4 6l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </summary>
              <p className="cam-body pb-5 text-[var(--muted)] text-pretty">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </ScrollReveal>
    </Section>
  );
}
