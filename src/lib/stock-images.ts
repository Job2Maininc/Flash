import type { Dictionary } from "@/lib/i18n";

/** Local processed mood images — never present as named users. */
const sources = {
  chemistry: "/images/about/conversation.webp",
  community: "/images/about/conversation.webp",
} as const;

export function localizedStockImages(t: Dictionary) {
  return {
    chemistry: { src: sources.chemistry, alt: t.images.chemistry },
    community: { src: sources.community, alt: t.images.community },
  };
}
