import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Env } from "../../config/env.validation";

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

export interface EmailAttachment {
  /** Nom de fichier tel qu'il apparaîtra en pièce jointe (ex. "recu-commande.pdf"). */
  name: string;
  /** Contenu encodé en base64. */
  content: string;
}

export interface SendEmailInput {
  to: { email: string; name?: string }[];
  subject: string;
  html: string;
  attachments?: EmailAttachment[];
}

/**
 * Fine couche autour de l'API REST transactionnelle de Brevo — volontairement
 * sans SDK tiers : un seul point d'appel HTTP, facile à tester et à remplacer.
 * Ne connaît rien du contenu métier des e-mails (voir EmailService pour ça).
 */
@Injectable()
export class BrevoClient {
  private readonly logger = new Logger(BrevoClient.name);

  constructor(private readonly config: ConfigService<Env, true>) {}

  isConfigured(): boolean {
    return this.config.get("BREVO_API_KEY", { infer: true }).length > 0;
  }

  /** @returns `true` si l'e-mail a réellement été transmis à Brevo, `false` s'il a été ignoré (clé absente). */
  async send(input: SendEmailInput): Promise<boolean> {
    const apiKey = this.config.get("BREVO_API_KEY", { infer: true });

    if (!apiKey) {
      this.logger.warn(
        `BREVO_API_KEY absente — e-mail non envoyé (sujet: "${input.subject}", destinataire(s): ${input.to.map((t) => t.email).join(", ")}).`,
      );
      return false;
    }

    const response = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: {
          email: this.config.get("MAIL_FROM", { infer: true }),
          name: this.config.get("MAIL_FROM_NAME", { infer: true }),
        },
        to: input.to,
        subject: input.subject,
        htmlContent: input.html,
        ...(input.attachments?.length ? { attachment: input.attachments } : {}),
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`Échec de l'envoi Brevo (${response.status}): ${body}`);
    }

    return true;
  }
}
