import type { Dictionary } from "@/lib/i18n";

const sources = {
  hero: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=2000&q=80",
  videoDate:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  chemistry:
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=80",
  safety:
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80",
  community:
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
} as const;

export function localizedStockImages(t: Dictionary) {
  return {
    hero: { src: sources.hero, alt: t.images.hero },
    videoDate: { src: sources.videoDate, alt: t.images.videoDate },
    chemistry: { src: sources.chemistry, alt: t.images.chemistry },
    safety: { src: sources.safety, alt: t.images.safety },
    community: { src: sources.community, alt: t.images.community },
  };
}

export const stockImages = {
  hero: { src: sources.hero, alt: "Couple smiling face to face in soft light" },
  videoDate: {
    src: sources.videoDate,
    alt: "Person on a video call on a laptop",
  },
  chemistry: {
    src: sources.chemistry,
    alt: "Smiling portrait, date-night mood",
  },
  safety: {
    src: sources.safety,
    alt: "Confident person looking at the camera",
  },
  community: {
    src: sources.community,
    alt: "Close friends hanging out outdoors",
  },
} as const;
