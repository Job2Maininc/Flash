import type { LookingFor, Sex } from "@/lib/types";

export const HERO_PREFS_KEY = "flash:prefs";

/** URL / sessionStorage gender tokens */
export type PrefGender = "man" | "woman" | "nonbinary";
/** URL / sessionStorage seeking tokens */
export type PrefSeeking = "men" | "women" | "everyone";

export type HeroPrefs = {
  g?: PrefGender;
  seeking?: PrefSeeking;
};

export function sexToPrefGender(sex: Sex): PrefGender {
  if (sex === "homme") return "man";
  if (sex === "femme") return "woman";
  return "nonbinary";
}

export function lookingToPrefSeeking(looking: LookingFor): PrefSeeking {
  if (looking === "hommes") return "men";
  if (looking === "femmes") return "women";
  return "everyone";
}

export function prefGenderToSex(g: string | null | undefined): Sex | null {
  if (g === "man" || g === "homme") return "homme";
  if (g === "woman" || g === "femme") return "femme";
  if (g === "nonbinary" || g === "non_binaire" || g === "non-binary") {
    return "non_binaire";
  }
  return null;
}

export function prefSeekingToLooking(
  seeking: string | null | undefined,
): LookingFor | null {
  if (seeking === "men" || seeking === "hommes") return "hommes";
  if (seeking === "women" || seeking === "femmes") return "femmes";
  if (seeking === "everyone" || seeking === "tous" || seeking === "all") {
    return "tous";
  }
  return null;
}

export function readHeroPrefs(): HeroPrefs {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(HERO_PREFS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as HeroPrefs;
    return {
      g: prefGenderToSex(parsed.g ?? null)
        ? (parsed.g as PrefGender)
        : undefined,
      seeking: prefSeekingToLooking(parsed.seeking ?? null)
        ? (parsed.seeking as PrefSeeking)
        : undefined,
    };
  } catch {
    return {};
  }
}

export function writeHeroPrefs(prefs: HeroPrefs): void {
  if (typeof window === "undefined") return;
  try {
    const next: HeroPrefs = { ...readHeroPrefs(), ...prefs };
    sessionStorage.setItem(HERO_PREFS_KEY, JSON.stringify(next));
  } catch {
    // private mode / quota — ignore
  }
}

export function buildJoinHref(prefs: {
  sex: Sex | "";
  lookingFor: LookingFor | "";
}): string {
  const params = new URLSearchParams();
  if (prefs.sex) params.set("g", sexToPrefGender(prefs.sex));
  if (prefs.lookingFor) {
    params.set("seeking", lookingToPrefSeeking(prefs.lookingFor));
  }
  const q = params.toString();
  return q ? `/join?${q}` : "/join";
}
