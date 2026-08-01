import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/AdminLayout";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Field";
import { getAdminOrder, updateOrderStatus, type OrderStatus } from "@/api/orders";
import { ApiError } from "@/lib/api";

const formatFcfa = (n: number) => n.toLocaleString("fr-FR").replace(/[  ,]/g, " ");

const statusTone: Record<string, "default" | "success" | "warning" | "destructive"> = {
  PENDING: "warning",
  PAID: "success",
  PROCESSING: "default",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELED: "destructive",
};

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "En attente",
  PAID: "Payée",
  PROCESSING: "En préparation",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELED: "Annulée",
};

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ["admin-order", id],
    queryFn: () => getAdminOrder(id!),
    enabled: Boolean(id),
  });

  const statusMutation = useMutation({
    mutationFn: (status: OrderStatus) => updateOrderStatus(id!, status),
    onSuccess: () => {
      toast("Statut mis à jour");
      queryClient.invalidateQueries({ queryKey: ["admin-order", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (err) => toast("Erreur", { description: err instanceof ApiError ? err.message : undefined }),
  });

  if (isLoading || !order) {
    return (
      <AdminLayout>
        <p className="text-sm text-muted-foreground">Chargement…</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <button
        type="button"
        onClick={() => navigate("/commandes")}
        className="link-underline mb-6 inline-flex items-center gap-1 text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground"
      >
        <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.6} />
        Retour aux commandes
      </button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow-accent mb-2">Commande</p>
          <h1 className="font-serif text-4xl text-foreground">{order.id.slice(0, 8).toUpperCase()}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge tone={statusTone[order.status]}>{statusLabels[order.status]}</Badge>
          <Select
            value={order.status}
            onChange={(e) => statusMutation.mutate(e.target.value as OrderStatus)}
            className="w-52"
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border border-border bg-offwhite/50 p-7">
          <h2 className="font-serif text-xl text-foreground">Articles</h2>
          <ul className="mt-5 divide-y divide-border">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-foreground">{item.productName}</p>
                  <p className="text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground">
                    Teinte {item.colorName} · Qté {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-foreground">
                  {formatFcfa(item.unitPrice * item.quantity)} FCFA
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">Total</span>
            <span className="font-serif text-xl text-foreground">{formatFcfa(order.total)} FCFA</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-offwhite/50 p-7">
            <h2 className="font-serif text-xl text-foreground">Client</h2>
            <p className="mt-3 text-sm text-foreground">
              {order.user.firstName} {order.user.lastName}
            </p>
            <Link to={`/clients/${order.user.id}`} className="link-underline mt-1 block text-sm text-muted-foreground">
              {order.user.email}
            </Link>
          </div>

          <div className="rounded-3xl border border-border bg-offwhite/50 p-7">
            <h2 className="font-serif text-xl text-foreground">Livraison</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {order.shippingFirstName} {order.shippingLastName}
              <br />
              {order.shippingLine1}
              {order.shippingLine2 ? <>, {order.shippingLine2}</> : null}
              <br />
              {order.shippingCity}, {order.shippingCountry}
              <br />
              {order.shippingPhone}
            </p>
            {order.notes && (
              <p className="mt-3 rounded-lg bg-background p-3 text-sm text-muted-foreground">{order.notes}</p>
            )}
          </div>

          {order.payment && (
            <div className="rounded-3xl border border-border bg-offwhite/50 p-7">
              <h2 className="font-serif text-xl text-foreground">Paiement</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                {order.payment.provider} — {order.payment.status}
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderDetail;
