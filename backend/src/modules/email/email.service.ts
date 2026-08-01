import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BrevoClient, type EmailAttachment } from "./brevo.client";
import { renderWelcomeEmail } from "./templates/welcome.template";
import { renderResetPasswordEmail } from "./templates/reset-password.template";
import { renderAdminResetPasswordEmail } from "./templates/admin-reset-password.template";
import { renderAccountSecurityEmail } from "./templates/account-security.template";
import { renderAdminSecurityEmail } from "./templates/admin-security.template";
import { renderOrderConfirmationEmail, type OrderConfirmationEmailOptions } from "./templates/order-confirmation.template";
import { renderAdminNewOrderEmail, type AdminNewOrderEmailOptions } from "./templates/admin-new-order.template";
import type { Env } from "../../config/env.validation";

interface Recipient {
  email: string;
  name?: string;
}

/**
 * Point d'entrée UNIQUE pour tous les e-mails transactionnels de l'application
 * (client ET administrateur). Aucun contrôleur ni service métier ne doit
 * appeler Brevo directement — tout passe par ici, ce qui centralise le
 * contenu, le format et la gestion d'erreurs (un envoi qui échoue est
 * journalisé mais ne fait jamais planter l'appelant : voir `safeSend`).
 *
 * 7 e-mails au total, un par cas d'usage réellement nécessaire :
 * bienvenue, confirmation de commande, notification admin de commande,
 * sécurité compte client, sécurité compte admin, reset mot de passe client,
 * reset mot de passe admin. Aucun bouton marketing nulle part.
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly brevo: BrevoClient,
    private readonly config: ConfigService<Env, true>,
  ) {}

  private async safeSend(
    label: string,
    to: Recipient[],
    subject: string,
    html: string,
    attachments?: EmailAttachment[],
  ): Promise<void> {
    try {
      const sent = await this.brevo.send({ to, subject, html, attachments });
      if (sent) {
        this.logger.log(`E-mail "${label}" envoyé à ${to.map((r) => r.email).join(", ")}.`);
      }
    } catch (error) {
      this.logger.error(
        `Échec de l'envoi de l'e-mail "${label}" à ${to.map((r) => r.email).join(", ")} : ${(error as Error).message}`,
      );
    }
  }

  /** Client — inscription réussie. Aucun bouton. */
  async sendWelcomeEmail(to: Recipient, firstName: string): Promise<void> {
    const { subject, html } = renderWelcomeEmail({ firstName });
    await this.safeSend("Bienvenue", [to], subject, html);
  }

  /** Client — demande de réinitialisation de mot de passe (lien fonctionnel, pas marketing). */
  async sendPasswordResetEmail(to: Recipient, resetUrl: string, expiresInMinutes: number): Promise<void> {
    const { subject, html } = renderResetPasswordEmail({ resetUrl, expiresInMinutes });
    await this.safeSend("Réinitialisation mot de passe", [to], subject, html);
  }

  /** Administrateur — demande de réinitialisation de mot de passe. */
  async sendAdminPasswordResetEmail(to: Recipient, resetUrl: string, expiresInMinutes: number): Promise<void> {
    const { subject, html } = renderAdminResetPasswordEmail({ resetUrl, expiresInMinutes });
    await this.safeSend("Réinitialisation mot de passe admin", [to], subject, html);
  }

  /** Client — e-mail ou mot de passe modifié. Un seul template, le message d'action varie. */
  async sendAccountSecurityEmail(to: Recipient, firstName: string, actionMessage: string): Promise<void> {
    const { subject, html } = renderAccountSecurityEmail({ firstName, actionMessage });
    await this.safeSend("Sécurité du compte", [to], subject, html);
  }

  /** Administrateur — e-mail ou mot de passe modifié. */
  async sendAdminSecurityEmail(to: Recipient, firstName: string, actionMessage: string): Promise<void> {
    const { subject, html } = renderAdminSecurityEmail({ firstName, actionMessage });
    await this.safeSend("Sécurité du compte admin", [to], subject, html);
  }

  /** Client — confirmation de commande, reçu PDF joint si fourni. Aucun bouton. */
  async sendOrderConfirmationEmail(
    to: Recipient,
    data: OrderConfirmationEmailOptions,
    receiptPdf?: Buffer,
  ): Promise<void> {
    const { subject, html } = renderOrderConfirmationEmail(data);
    const attachments: EmailAttachment[] | undefined = receiptPdf
      ? [{ name: `recu-${data.orderRef}.pdf`, content: receiptPdf.toString("base64") }]
      : undefined;
    await this.safeSend("Confirmation de commande", [to], subject, html, attachments);
  }

  /** Administrateur — notification de nouvelle commande, envoyée à ADMIN_EMAIL. */
  async sendAdminNewOrderEmail(data: AdminNewOrderEmailOptions): Promise<void> {
    const adminEmail = this.config.get("ADMIN_EMAIL", { infer: true });
    if (!adminEmail) {
      this.logger.warn("ADMIN_EMAIL non configuré — notification admin de nouvelle commande ignorée.");
      return;
    }
    const { subject, html } = renderAdminNewOrderEmail(data);
    await this.safeSend("Notification admin — nouvelle commande", [{ email: adminEmail }], subject, html);
  }
}
