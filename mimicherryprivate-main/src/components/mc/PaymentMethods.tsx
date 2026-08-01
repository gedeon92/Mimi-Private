/**
 * Logos des moyens de paiement — interface visuelle uniquement.
 * Les paiements en ligne ne sont pas encore connectés.
 * Esthétique sobre : pastilles claires, bordure discrète.
 */
const methods = [
  {
    name: "Visa",
    node: (
      <span className="font-serif text-[0.95rem] italic tracking-wide text-[#1a1f71]">
        VISA
      </span>
    ),
  },
  {
    name: "Mastercard",
    node: (
      <span className="relative flex items-center">
        <span className="h-4 w-4 rounded-full bg-[#eb001b]" />
        <span className="-ml-1.5 h-4 w-4 rounded-full bg-[#f79e1b]/90 mix-blend-multiply" />
      </span>
    ),
  },
  {
    name: "Orange Money",
    node: (
      <span className="flex items-center gap-1.5">
        <span className="h-3.5 w-3.5 rounded-sm bg-[#ff7900]" />
        <span className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-foreground">
          Orange Money
        </span>
      </span>
    ),
  },
  {
    name: "Wave",
    node: (
      <span className="flex items-center gap-1.5">
        <span className="h-3.5 w-3.5 rounded-full bg-[#1dc8ff]" />
        <span className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-foreground">
          Wave
        </span>
      </span>
    ),
  },
];

export const PaymentMethods = () => (
  <div className="flex flex-wrap items-center gap-3">
    {methods.map((m) => (
      <span
        key={m.name}
        aria-label={m.name}
        className="flex h-9 items-center justify-center rounded-md border border-border bg-background px-3"
      >
        {m.node}
      </span>
    ))}
  </div>
);
