"use client";

import {
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type Item = {
  id: string;
  question: string;
  answer: string;
};

type Props = {
  items: Item[];
  className?: string;
};

export function Accordion({ items, className }: Props) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className={cn("divide-y divide-[var(--ink-700)]", className)}>
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <AccordionRow
            key={item.id}
            item={item}
            open={open}
            onToggle={() => setOpenId(open ? null : item.id)}
          />
        );
      })}
    </div>
  );
}

function AccordionRow({
  item,
  open,
  onToggle,
}: {
  item: Item;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = `${item.id}-panel`;
  const buttonId = `${item.id}-button`;

  return (
    <div className="py-1">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 py-5 text-left font-[family-name:var(--font-camera-display)] text-xl font-semibold tracking-tight text-[var(--cam-paper)] sm:text-[1.35rem]"
        >
          {item.question}
          <span
            aria-hidden
            className={cn(
              "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--ink-600)] text-[var(--faint)] transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)]",
              open && "rotate-180",
            )}
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
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={cn(
          "grid transition-[grid-template-rows] duration-[var(--dur-base)] ease-[var(--ease-out)]",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <p className="cam-body pb-5 text-[var(--muted)] text-pretty">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

type RevealProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

/** Scroll-once reveal without Framer Motion. */
export function ScrollReveal({ className, children, ...props }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "-12% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-[var(--dur-base)] ease-[var(--ease-out)]",
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
