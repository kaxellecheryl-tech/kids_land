import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formate un prix en F CFA (XOF).
 * 12500 → "12 500 F"
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(amount) + " F";
}

/**
 * Génère un slug URL-safe.
 * "Robe Liberty à fleurs" → "robe-liberty-a-fleurs"
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // retire les accents
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Génère un numéro de commande lisible.
 * Format: KL-YYYY-XXXXX
 */
export function generateOrderNumber(sequence: number): string {
  const year = new Date().getFullYear();
  return `KL-${year}-${String(sequence).padStart(5, "0")}`;
}

/**
 * Convertit un âge en mois en label lisible.
 * 24 → "2 ans", 6 → "6 mois"
 */
export function formatAge(months: number): string {
  if (months < 12) return `${months} mois`;
  const years = Math.floor(months / 12);
  return years === 1 ? "1 an" : `${years} ans`;
}

/**
 * Calcule le prix minimum effectif parmi tous les variants.
 * Un variant sans priceOverride utilise le basePrice.
 * Retourne undefined si tous les variants ont le même prix que basePrice.
 */
export function computeMinPrice(
  basePrice: number,
  variants: { priceOverride: number | null }[]
): number | undefined {
  if (variants.length === 0) return undefined;
  const prices = variants.map((v) => v.priceOverride ?? basePrice);
  const min = Math.min(...prices);
  return min < basePrice ? min : undefined;
}
