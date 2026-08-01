import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AccountLayout, AccountEmpty } from "@/components/mc/AccountLayout";
import { getOrders, type Order } from "@/api/orders";
import { formatFcfa } from "@/context/CartContext";
import { resolveProductImage } from "@/data/productAssets";

const statusLabels: Record<Order["status"], string> = {
  PENDING: "En attente",
  PAID: "Payée",
  PROCESSING: "En préparation",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELED: "Annulée",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

const Orders = () => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  if (isLoading) {
    return (
      <AccountLayout title="Mes commandes" intro="Suivez vos commandes en cours et consultez votre historique d'achats.">
        <p className="text-sm text-muted-foreground">Chargement…</p>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout title="Mes commandes" intro="Suivez vos commandes en cours et consultez votre historique d'achats.">
      {!orders || orders.length === 0 ? (
        <AccountEmpty
          title="Aucune commande pour le moment"
          body="Vos commandes apparaîtront ici dès votre première acquisition."
          cta={
            <Link
              to="/collection"
              className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-8 text-[0.7rem] uppercase tracking-[0.22em] text-background transition-all duration-500 hover:bg-foreground/90"
            >
              Découvrir la collection
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="rounded-3xl border border-border bg-offwhite/50 p-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[0.62rem] uppercase tracking-[0.3em] text-muted-foreground">
                    Commande du {formatDate(order.createdAt)}
                  </p>
                  <p className="mt-1 font-serif text-lg text-foreground">
                    Réf. {order.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
                <span className="inline-flex h-fit items-center rounded-full bg-foreground/10 px-3 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-foreground">
                  {statusLabels[order.status]}
                </span>
              </div>

              <div className="rule-fade my-5" />

              <ul className="space-y-4">
                {order.items.map((item) => (
                  <li key={item.id} className="flex gap-4">
                    <div className="w-14 shrink-0 overflow-hidden rounded-md bg-background">
                      <img
                        src={resolveProductImage(item.image)}
                        alt={`${item.productName} — ${item.colorName}`}
                        className="aspect-[4/5] w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <p className="font-serif text-sm text-foreground">{item.productName}</p>
                      <p className="mt-0.5 text-[0.66rem] tracking-wide text-muted-foreground">
                        Teinte {item.colorName} · Qté {item.quantity}
                      </p>
                    </div>
                    <p className="self-center text-sm font-semibold tracking-tight text-foreground">
                      {formatFcfa(item.unitPrice * item.quantity)}{" "}
                      <span className="text-xs font-normal text-muted-foreground">FCFA</span>
                    </p>
                  </li>
                ))}
              </ul>

              <div className="rule-fade my-5" />

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Livraison : {order.shippingLine1}, {order.shippingCity}
                </span>
                <span className="font-semibold tracking-tight text-foreground">
                  Total : {formatFcfa(order.total)} FCFA
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </AccountLayout>
  );
};

export default Orders;
