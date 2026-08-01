import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Badge } from "@/components/ui/Badge";
import { getAdminCustomer } from "@/api/customers";

const formatFcfa = (n: number) => n.toLocaleString("fr-FR").replace(/[  ,]/g, " ");

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  PAID: "Payée",
  PROCESSING: "En préparation",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELED: "Annulée",
};

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: customer, isLoading } = useQuery({
    queryKey: ["admin-customer", id],
    queryFn: () => getAdminCustomer(id!),
    enabled: Boolean(id),
  });

  if (isLoading || !customer) {
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
        onClick={() => navigate("/clients")}
        className="link-underline mb-6 inline-flex items-center gap-1 text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground"
      >
        <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.6} />
        Retour aux clients
      </button>

      <p className="eyebrow-accent mb-2">Client</p>
      <h1 className="font-serif text-4xl text-foreground">
        {customer.firstName} {customer.lastName}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{customer.email} · {customer.phone || "Pas de téléphone"}</p>
      <p className="mt-1 text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground">
        Inscrit le {new Date(customer.createdAt).toLocaleDateString("fr-FR")}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3">
        <div className="rounded-3xl border border-border bg-offwhite/50 p-6">
          <p className="font-serif text-3xl text-foreground">{customer.orderCount}</p>
          <p className="mt-1 text-[0.66rem] uppercase tracking-[0.16em] text-muted-foreground">Commandes</p>
        </div>
        <div className="rounded-3xl border border-border bg-offwhite/50 p-6">
          <p className="font-serif text-3xl text-foreground">{formatFcfa(customer.totalSpent)}</p>
          <p className="mt-1 text-[0.66rem] uppercase tracking-[0.16em] text-muted-foreground">FCFA dépensés</p>
        </div>
        <div className="rounded-3xl border border-border bg-offwhite/50 p-6">
          <p className="font-serif text-3xl text-foreground">{customer.addresses.length}</p>
          <p className="mt-1 text-[0.66rem] uppercase tracking-[0.16em] text-muted-foreground">Adresse(s)</p>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-border bg-offwhite/50 p-7">
        <h2 className="font-serif text-xl text-foreground">Historique des commandes</h2>
        {customer.orders.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">Aucune commande pour ce client.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {customer.orders.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <Link to={`/commandes/${o.id}`} className="link-underline text-foreground">
                  {o.id.slice(0, 8).toUpperCase()}
                </Link>
                <span className="text-muted-foreground">{new Date(o.createdAt).toLocaleDateString("fr-FR")}</span>
                <Badge>{statusLabels[o.status] ?? o.status}</Badge>
                <span className="font-semibold text-foreground">{formatFcfa(o.total)} FCFA</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminLayout>
  );
};

export default CustomerDetail;
