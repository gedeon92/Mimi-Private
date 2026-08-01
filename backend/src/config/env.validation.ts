import { z } from "zod";

/** Valide les variables d'environnement au démarrage — échoue vite et clairement plutôt qu'en pleine requête. */
export const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL est requis"),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().min(1, "CORS_ORIGIN est requis"),
  JWT_ACCESS_SECRET: z.string().min(16, "JWT_ACCESS_SECRET doit faire au moins 16 caractères"),
  JWT_REFRESH_SECRET: z.string().min(16, "JWT_REFRESH_SECRET doit faire au moins 16 caractères"),
  JWT_ACCESS_TTL: z.string().default("15m"),
  JWT_REFRESH_TTL: z.string().default("30d"),

  CLIENT_APP_URL: z.string().default("http://localhost:8080"),
  ADMIN_APP_URL: z.string().default("http://localhost:8081"),

  // Optionnels : tant que BREVO_API_KEY est vide, EmailService journalise et
  // n'envoie rien — l'application démarre et fonctionne normalement sans clé.
  BREVO_API_KEY: z.string().optional().default(""),
  MAIL_FROM: z.string().email().default("no-reply@mimicherryprivate.com"),
  MAIL_FROM_NAME: z.string().default("Mimi Cherry Private"),
  ADMIN_EMAIL: z.union([z.string().email(), z.literal("")]).optional().default(""),

  // Optionnels : tant qu'ils sont vides, l'upload d'images échoue avec un
  // message clair plutôt que d'empêcher l'application entière de démarrer.
  CLOUDINARY_CLOUD_NAME: z.string().optional().default(""),
  CLOUDINARY_API_KEY: z.string().optional().default(""),
  CLOUDINARY_API_SECRET: z.string().optional().default(""),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const parsed = envSchema.safeParse(config);
  if (!parsed.success) {
    throw new Error(`Variables d'environnement invalides:\n${parsed.error.toString()}`);
  }
  return parsed.data;
}
