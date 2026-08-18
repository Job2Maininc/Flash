import { areGuestsGeoCompatible } from "./geo";
import type { Guest, LookingFor, Sex } from "./types";

export const SEX_OPTIONS: { value: Sex; label: string }[] = [
  { value: "homme", label: "Homme" },
  { value: "femme", label: "Femme" },
  { value: "non_binaire", label: "Non-binaire" },
];

export const LOOKING_FOR_OPTIONS: { value: LookingFor; label: string }[] = [
  { value: "hommes", label: "Hommes" },
  { value: "femmes", label: "Femmes" },
  { value: "tous", label: "Tout le monde" },
];

export function isSex(value: unknown): value is Sex {
  return value === "homme" || value === "femme" || value === "non_binaire";
}

export function isLookingFor(value: unknown): value is LookingFor {
  return value === "hommes" || value === "femmes" || value === "tous";
}

/** Whether `sex` is accepted by a `lookingFor` preference. */
export function sexMatchesLookingFor(sex: Sex, lookingFor: LookingFor): boolean {
  if (lookingFor === "tous") return true;
  if (lookingFor === "hommes") return sex === "homme";
  if (lookingFor === "femmes") return sex === "femme";
  return false;
}

/** Reciprocal sex / looking-for compatibility for video pairing. */
export function areGuestsCompatible(a: Guest, b: Guest): boolean {
  if (!a.sex || !a.lookingFor || !b.sex || !b.lookingFor) {
    return false;
  }
  return (
    sexMatchesLookingFor(b.sex, a.lookingFor) &&
    sexMatchesLookingFor(a.sex, b.lookingFor) &&
    areGuestsGeoCompatible(a, b)
  );
}
