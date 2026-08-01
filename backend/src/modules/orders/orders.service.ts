import { BadRequestException, Injectable, NotFoundException, Logger } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { EmailService } from "../email/email.service";
import { PaymentsService } from "../payments/payments.service";
import { generateOrderReceiptPdf, type ReceiptLine } from "../email/pdf/order-receipt.pdf";
import { getPaymentMethodLabel } from "../email/templates/payment-labels";
import type { EmailOrderLine } from "../email/templates/components";
import type { CreateOrderDto } from "./dto/create-order.dto";

const ORDER_INCLUDE = {
  items: true,
  payment: true,
};

/** Formatte un montant FCFA avec séparateur d'espace (identique au front). */
function formatFcfa(amount: number): string {
  return amount.toLocaleString("fr-FR").replace(/ |,/g, " ");
}

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly paymentsService: PaymentsService,
  ) {}

  findAll(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: ORDER_INCLUDE,
    });
  }

  async findOne(userId: string, id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: ORDER_INCLUDE,
    });
    if (!order) throw new NotFoundException("Commande introuvable.");
    return order;
  }

  async create(userId: string, dto: CreateOrderDto) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        variant: {
          include: { product: true, images: { orderBy: { position: "asc" }, take: 1 } },
        },
      },
    });

    if (cartItems.length === 0) {
      throw new BadRequestException("Votre panier est vide.");
    }

    const insufficient = cartItems.filter((item) => item.quantity > item.variant.stock);
    if (insufficient.length > 0) {
      throw new BadRequestException(
        `Stock insuffisant pour : ${insufficient.map((i) => `${i.variant.product.name} (${i.variant.colorName})`).join(", ")}.`,
      );
    }

    if (dto.addressId) {
      const address = await this.prisma.address.findFirst({
        where: { id: dto.addressId, userId },
      });
      if (!address) throw new NotFoundException("Adresse introuvable.");
    }

    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.variant.product.price * item.quantity,
      0,
    );
    const shippingCost = 0;
    const total = subtotal + shippingCost;

    // Point d'extension paiement : aujourd'hui "manual" (aucun prestataire
    // réel branché), demain un vrai fournisseur (Wave, Orange Money, carte) —
    // sans changer le reste de cette méthode.
    const payment = await this.paymentsService.createPayment({
      amount: total,
      customerEmail: dto.shippingEmail,
      customerName: `${dto.shippingFirstName} ${dto.shippingLastName}`,
    });

    const order = await this.prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId,
          addressId: dto.addressId,
          subtotal,
          shippingCost,
          total,
          shippingFirstName: dto.shippingFirstName,
          shippingLastName: dto.shippingLastName,
          shippingEmail: dto.shippingEmail,
          shippingPhone: dto.shippingPhone,
          shippingLine1: dto.shippingLine1,
          shippingLine2: dto.shippingLine2,
          shippingCity: dto.shippingCity,
          shippingCountry: dto.shippingCountry,
          notes: dto.notes,
          items: {
            create: cartItems.map((item) => ({
              variantId: item.variant.id,
              productName: `${item.variant.product.line} ${item.variant.product.name}`,
              colorName: item.variant.colorName,
              image: item.variant.images[0]?.url ?? "",
              unitPrice: item.variant.product.price,
              quantity: item.quantity,
            })),
          },
          payment: {
            create: {
              provider: this.paymentsService.providerName,
              status: payment.status,
              transactionRef: payment.providerRef,
              amount: total,
            },
          },
        },
        include: ORDER_INCLUDE,
      });

      for (const item of cartItems) {
        await tx.productVariant.update({
          where: { id: item.variant.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({ where: { userId } });

      return created;
    });

    await this.sendOrderEmails(order, userId);

    return order;
  }

  /** E-mails de confirmation (client, avec reçu PDF) et de notification (admin). Best-effort. */
  private async sendOrderEmails(
    order: Awaited<ReturnType<OrdersService["create"]>>,
    userId: string,
  ): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) return;

      const createdAt = order.createdAt;
      const orderDate = createdAt.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
      const orderTime = createdAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
      const orderRef = order.id.slice(0, 8).toUpperCase();
      const paymentMethodLabel = getPaymentMethodLabel(order.payment?.provider ?? this.paymentsService.providerName);

      const emailItems: EmailOrderLine[] = order.items.map((item) => ({
        productName: item.productName,
        colorName: item.colorName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        formattedUnitPrice: formatFcfa(item.unitPrice),
        formattedLineTotal: formatFcfa(item.unitPrice * item.quantity),
      }));

      const receiptItems: ReceiptLine[] = order.items.map((item) => ({
        productName: item.productName,
        colorName: item.colorName,
        quantity: item.quantity,
        formattedUnitPrice: formatFcfa(item.unitPrice),
        formattedLineTotal: formatFcfa(item.unitPrice * item.quantity),
      }));

      const receiptPdf = await generateOrderReceiptPdf({
        orderRef,
        orderDate,
        orderTime,
        customerName: `${order.shippingFirstName} ${order.shippingLastName}`,
        customerEmail: order.shippingEmail,
        customerPhone: order.shippingPhone,
        shippingLine1: order.shippingLine1,
        shippingLine2: order.shippingLine2,
        shippingCity: order.shippingCity,
        shippingCountry: order.shippingCountry,
        items: receiptItems,
        subtotalFormatted: formatFcfa(order.subtotal),
        shippingCostFormatted: order.shippingCost === 0 ? "Offerte" : `${formatFcfa(order.shippingCost)} FCFA`,
        totalFormatted: formatFcfa(order.total),
        paymentMethodLabel,
      });

      await this.emailService.sendOrderConfirmationEmail(
        { email: user.email, name: `${user.firstName} ${user.lastName}` },
        {
          firstName: user.firstName,
          orderRef,
          orderDate,
          orderTime,
          items: emailItems,
          subtotalFormatted: formatFcfa(order.subtotal),
          shippingCostFormatted: order.shippingCost === 0 ? "Offerte" : `${formatFcfa(order.shippingCost)} FCFA`,
          totalFormatted: formatFcfa(order.total),
          shippingFirstName: order.shippingFirstName,
          shippingLastName: order.shippingLastName,
          shippingLine1: order.shippingLine1,
          shippingLine2: order.shippingLine2,
          shippingCity: order.shippingCity,
          shippingCountry: order.shippingCountry,
          shippingPhone: order.shippingPhone,
          paymentMethodLabel,
          hasReceiptAttachment: true,
        },
        receiptPdf,
      );

      // Envoyée juste après l'e-mail client, comme demandé.
      await this.emailService.sendAdminNewOrderEmail({
        orderRef,
        orderDate,
        orderTime,
        customerName: `${order.shippingFirstName} ${order.shippingLastName}`,
        customerEmail: order.shippingEmail,
        customerPhone: order.shippingPhone,
        items: emailItems,
        totalFormatted: formatFcfa(order.total),
        paymentMethodLabel,
      });
    } catch (error) {
      // Ne doit jamais faire échouer la commande déjà enregistrée en base.
      this.logger.error(`Échec de la préparation des e-mails de commande ${order.id} : ${(error as Error).message}`);
    }
  }
}
