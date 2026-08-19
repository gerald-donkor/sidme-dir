/** Presentation helpers. Components render; they do not format. */

import type { Address, UserRole } from "@/lib/users/types";

export function initials(firstName: string, lastName: string): string {
  return `${firstName.at(0) ?? ""}${lastName.at(0) ?? ""}`.toUpperCase();
}

/** "Phoenix, MS" — the two parts a person actually scans for. */
export function shortLocation(address: Address): string {
  return [address.city, address.stateCode].filter(Boolean).join(", ");
}

export function fullAddress(address: Address): string {
  return `${address.street}, ${address.city}, ${address.stateCode} ${address.postalCode}, ${address.country}`;
}

/**
 * The API returns dates as "1996-5-30" — unpadded, so `new Date` parsing is
 * implementation-defined. Split it rather than trusting the parser.
 */
export function formatBirthDate(birthDate: string): string {
  const [year, month, day] = birthDate.split("-").map(Number);
  if (!year || !month || !day) return birthDate;
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatHeight(cm: number): string {
  return `${cm.toFixed(0)} cm`;
}

export function formatWeight(kg: number): string {
  return `${kg.toFixed(0)} kg`;
}

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  moderator: "Moderator",
  user: "Member",
};

export function roleLabel(role: UserRole): string {
  return ROLE_LABELS[role] ?? role;
}
