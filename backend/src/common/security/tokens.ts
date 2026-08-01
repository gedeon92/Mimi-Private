import { createHash, randomBytes } from "crypto";

/** Jeton opaque haute-entropie (refresh token, reset password token). */
export function generateOpaqueToken(): string {
  return randomBytes(48).toString("hex");
}

/**
 * Hash à sens unique pour stocker un jeton opaque en base.
 * SHA-256 suffit ici (contrairement aux mots de passe) : l'entropie du
 * jeton généré rend une attaque par force brute non praticable.
 */
export function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

/** Parse une durée type "15m", "30d", "45s" en millisecondes. */
export function parseDurationMs(value: string): number {
  const match = /^(\d+)\s*(ms|s|m|h|d)$/.exec(value.trim());
  if (!match) {
    throw new Error(`Format de durée invalide: "${value}" (attendu ex: "15m", "30d")`);
  }
  const amount = Number(match[1]);
  const unit = match[2];
  const unitMs: Record<string, number> = {
    ms: 1,
    s: 1_000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
  };
  return amount * unitMs[unit];
}
