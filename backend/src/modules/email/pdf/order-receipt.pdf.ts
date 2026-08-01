import PDFDocument from "pdfkit";

const COLORS = {
  ink: "#161310",
  gold: "#B08D57",
  burgundy: "#6E2A36",
  muted: "#6B6560",
  border: "#D8D2C6",
};

export interface ReceiptLine {
  productName: string;
  colorName: string;
  quantity: number;
  formattedUnitPrice: string;
  formattedLineTotal: string;
}

export interface OrderReceiptData {
  orderRef: string;
  orderDate: string;
  orderTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingLine1: string;
  shippingLine2?: string | null;
  shippingCity: string;
  shippingCountry: string;
  items: ReceiptLine[];
  subtotalFormatted: string;
  shippingCostFormatted: string;
  totalFormatted: string;
  paymentMethodLabel: string;
}

const PAGE_MARGIN = 50;
const COL_X = { product: PAGE_MARGIN, qty: 330, unit: 385, total: 470 };

/** Génère un reçu de commande professionnel en PDF (Buffer prêt à joindre à un e-mail). */
export function generateOrderReceiptPdf(data: OrderReceiptData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: PAGE_MARGIN });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // --- En-tête ---
    doc
      .fillColor(COLORS.ink)
      .font("Helvetica-Bold")
      .fontSize(20)
      .text("MIMI CHERRY PRIVATE", PAGE_MARGIN, PAGE_MARGIN, { characterSpacing: 2 });
    doc
      .fillColor(COLORS.gold)
      .font("Helvetica")
      .fontSize(9)
      .text("MAROQUINERIE SCULPTURALE — DAKAR", PAGE_MARGIN, PAGE_MARGIN + 24, { characterSpacing: 1 });

    doc
      .fillColor(COLORS.ink)
      .font("Helvetica-Bold")
      .fontSize(13)
      .text("REÇU DE COMMANDE", 0, PAGE_MARGIN, { align: "right" });
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(COLORS.muted)
      .text(`N° ${data.orderRef}`, { align: "right" })
      .text(`${data.orderDate} à ${data.orderTime}`, { align: "right" });

    doc.moveTo(PAGE_MARGIN, 110).lineTo(545, 110).strokeColor(COLORS.border).lineWidth(1).stroke();

    // --- Informations client / livraison ---
    const infoY = 130;
    doc.font("Helvetica-Bold").fontSize(9).fillColor(COLORS.muted).text("CLIENT", PAGE_MARGIN, infoY, { characterSpacing: 1 });
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(COLORS.ink)
      .text(data.customerName, PAGE_MARGIN, infoY + 14)
      .text(data.customerEmail, PAGE_MARGIN, infoY + 28)
      .text(data.customerPhone, PAGE_MARGIN, infoY + 42);

    doc.font("Helvetica-Bold").fontSize(9).fillColor(COLORS.muted).text("LIVRAISON", 310, infoY, { characterSpacing: 1 });
    const addressText = [data.shippingLine1, data.shippingLine2, `${data.shippingCity}, ${data.shippingCountry}`]
      .filter(Boolean)
      .join("\n");
    doc.font("Helvetica").fontSize(10).fillColor(COLORS.ink).text(addressText, 310, infoY + 14, { width: 235 });

    // --- Tableau des articles ---
    let y = 210;
    doc.moveTo(PAGE_MARGIN, y).lineTo(545, y).strokeColor(COLORS.border).stroke();
    y += 10;

    doc.font("Helvetica-Bold").fontSize(9).fillColor(COLORS.muted);
    doc.text("PRODUIT", COL_X.product, y, { characterSpacing: 0.5 });
    doc.text("QTÉ", COL_X.qty, y);
    doc.text("PRIX UNIT.", COL_X.unit, y);
    doc.text("TOTAL", COL_X.total, y);
    y += 16;
    doc.moveTo(PAGE_MARGIN, y).lineTo(545, y).strokeColor(COLORS.border).stroke();
    y += 10;

    doc.font("Helvetica").fontSize(10).fillColor(COLORS.ink);
    for (const item of data.items) {
      doc.font("Helvetica-Bold").fontSize(10).text(item.productName, COL_X.product, y, { width: 250 });
      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(COLORS.muted)
        .text(`Teinte ${item.colorName}`, COL_X.product, y + 13, { width: 250 });

      doc.font("Helvetica").fontSize(10).fillColor(COLORS.ink);
      doc.text(String(item.quantity), COL_X.qty, y);
      doc.text(`${item.formattedUnitPrice} F`, COL_X.unit, y);
      doc.font("Helvetica-Bold").text(`${item.formattedLineTotal} F`, COL_X.total, y);

      y += 34;
    }

    doc.moveTo(PAGE_MARGIN, y).lineTo(545, y).strokeColor(COLORS.border).stroke();
    y += 14;

    // --- Totaux --- (valeurs alignées à droite dans une zone large pour ne jamais retourner à la ligne)
    const totalsX = 300;
    const totalsValueOpts = { width: 245, align: "right" as const };
    doc.font("Helvetica").fontSize(10).fillColor(COLORS.muted).text("Paiement", totalsX, y);
    doc.fillColor(COLORS.ink).text(data.paymentMethodLabel, totalsX, y, totalsValueOpts);
    y += 16;

    doc.fillColor(COLORS.muted).text("Sous-total", totalsX, y);
    doc.fillColor(COLORS.ink).text(`${data.subtotalFormatted} FCFA`, totalsX, y, totalsValueOpts);
    y += 16;

    doc.fillColor(COLORS.muted).text("Livraison", totalsX, y);
    doc.fillColor(COLORS.ink).text(data.shippingCostFormatted, totalsX, y, totalsValueOpts);
    y += 20;

    doc.moveTo(totalsX, y).lineTo(545, y).strokeColor(COLORS.border).stroke();
    y += 10;

    doc.font("Helvetica-Bold").fontSize(13).fillColor(COLORS.ink).text("TOTAL", totalsX, y);
    doc.text(`${data.totalFormatted} FCFA`, totalsX, y, totalsValueOpts);

    // --- Pied de page ---
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor(COLORS.muted)
      .text(
        "Ce reçu confirme l'enregistrement de votre commande. Notre équipe vous contactera pour finaliser le paiement et la livraison.",
        PAGE_MARGIN,
        750,
        { width: 495, align: "center" },
      )
      .text("Mimi Cherry Private — contact@mimicherryprivate.com", PAGE_MARGIN, 765, { width: 495, align: "center" });

    doc.end();
  });
}
