import { useQuery } from "@tanstack/react-query";
import { Package, PackageX, ShoppingBag, Wallet, Users, TrendingUp } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Badge } from "@/components/ui/Badge";
import { getDashboardStats } from "@/api/dashboard";

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

const StatCard = ({
  icon: Icon,
  label,
  value,
  tone = "default",
}: {
  icon: typeof Package;
  label: string;
  value: string | number;
  tone?: "default" | "warning";
}) => (
  <div className="rounded-3xl border border-border bg-offwhite/50 p-6 transition-shadow duration-300 hover:shadow-card">
    <div className="flex items-center justify-between">
      <Icon className={`h-5 w-5 ${tone === "warning" ? "text-destructive" : "text-foreground"}`} strokeWidth={1.5} />
    </div>
    <p className="mt-4 font-serif text-3xl text-foreground">{value}</p>
    <p className="mt-1 text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
  </div>
);

const Dashboard = () => {
  const { data, isLoading } = useQuery({ queryKey: ["admin-dashboard"], queryFn: getDashboardStats });

  return (
    <AdminLayout>
      <p className="eyebrow-accent mb-2">Vue d'ensemble</p>
      <h1 className="font-serif text-4xl text-foreground">Tableau de bord</h1>

      {isLoading || !data ? (
        <p className="mt-10 text-sm text-muted-foreground">Chargement…</p>
      ) : (
        <>
          <div className="mt-8 grid animate-fade-in grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-6">
            <StatCard icon={Package} label="Produits" value={data.totalProducts} />
            <StatCard icon={Package} label="Produits actifs" value={data.activeProducts} />
            <StatCard icon={PackageX} label="Ruptures de stock" value={data.outOfStockProducts} tone="warning" />
            <StatCard icon={ShoppingBag} label="Commandes" value={data.totalOrders} />
            <StatCard icon={Wallet} label="Chiffre d'affaires" value={`${formatFcfa(data.revenue)} FCFA`} />
            <StatCard icon={Users} label="Clients inscrits" value={data.totalCustomers} />
          </div>

          <div className="mt-10 grid animate-fade-in gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-3xl border border-border bg-offwhite/50 p-7">
              <h2 className="font-serif text-xl text-foreground">Commandes récentes</h2>
              <div className="mt-5 space-y-3">
                {data.recentOrders.length === 0 && (
                  <p className="text-sm text-muted-foreground">Aucune commande pour le moment.</p>
                )}
                {data.recentOrders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between border-b border-border pb-3 text-sm last:border-0">
                    <div>
                      <p className="text-foreground">{o.customerName}</p>
                      <p className="text-[0.66rem] text-muted-foreground">
                        {new Date(o.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-foreground">{formatFcfa(o.total)} FCFA</span>
                      <Badge tone={statusTone[o.status] ?? "default"}>{statusLabels[o.status] ?? o.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-offwhite/50 p-7">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-foreground" strokeWidth={1.6} />
                <h2 className="font-serif text-xl text-foreground">Meilleures ventes</h2>
              </div>
              <div className="mt-5 space-y-3">
                {data.topProducts.length === 0 && (
                  <p className="text-sm text-muted-foreground">Pas encore de vente.</p>
                )}
                {data.topProducts.map((p, i) => (
                  <div key={p.name} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">
                      {i + 1}. {p.name}
                    </span>
                    <span className="text-muted-foreground">{p.quantitySold} vendu(s)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default Dashboard;
