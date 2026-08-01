import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Badge } from "@/components/ui/Badge";
import { Input, Select } from "@/components/ui/Field";
import { getAdminOrders, type OrderStatus } from "@/api/orders";

const formatFcfa = (n: number) => n.toLocaleString("fr-FR").replace(/[  ,]/g, " ");

const statusTone: Record<string, "default" | "success" | "warning" | "destructive"> = {
  PENDING: "warning",
  PAID: "success",
  PROCESSING: "default",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELED: "destructive",
};

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  PAID: "Payée",
  PROCESSING: "En préparation",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELED: "Annulée",
};

const OrdersList = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "">("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders", search, status],
    queryFn: () => getAdminOrders({ search: search || undefined, status: (status || undefined) as OrderStatus | undefined, limit: 50 }),
  });

  return (
    <AdminLayout>
      <p className="eyebrow-accent mb-2">Ventes</p>
      <h1 className="font-serif text-4xl text-foreground">Commandes</h1>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative w-64">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
          <Input
            placeholder="Rechercher un client…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus | "")} className="w-52">
          <option value="">Tous les statuts</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
      </div>

      {isLoading ? (
        <p className="mt-10 text-sm text-muted-foreground">Chargement…</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-3xl border border-border">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-offwhite/60 text-left text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Référence</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data?.items.map((o) => (
                <tr key={o.id}>
                  <td className="px-6 py-4">
                    <Link to={`/commandes/${o.id}`} className="link-underline font-medium text-foreground">
                      {o.id.slice(0, 8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-foreground">
                    {o.user.firstName} {o.user.lastName}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(o.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4 font-semibold text-foreground">{formatFcfa(o.total)} FCFA</td>
                  <td className="px-6 py-4">
                    <Badge tone={statusTone[o.status] ?? "default"}>{statusLabels[o.status] ?? o.status}</Badge>
                  </td>
                </tr>
              ))}
              {data?.items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                    Aucune commande.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default OrdersList;
