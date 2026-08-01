import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Input } from "@/components/ui/Field";
import { getAdminCustomers } from "@/api/customers";

const formatFcfa = (n: number) => n.toLocaleString("fr-FR").replace(/[  ,]/g, " ");

const CustomersList = () => {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["admin-customers", search],
    queryFn: () => getAdminCustomers(search, 1, 50),
  });

  return (
    <AdminLayout>
      <p className="eyebrow-accent mb-2">Communauté</p>
      <h1 className="font-serif text-4xl text-foreground">Clients</h1>

      <div className="relative mt-6 w-full sm:w-72">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
        <Input
          placeholder="Rechercher un client…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <p className="mt-10 text-sm text-muted-foreground">Chargement…</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-3xl border border-border">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-offwhite/60 text-left text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Nom</th>
                <th className="px-6 py-4">E-mail</th>
                <th className="px-6 py-4">Inscrit le</th>
                <th className="px-6 py-4">Commandes</th>
                <th className="px-6 py-4">Total dépensé</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data?.items.map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-offwhite/60">
                  <td className="px-6 py-4">
                    <Link to={`/clients/${c.id}`} className="link-underline font-medium text-foreground">
                      {c.firstName} {c.lastName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{c.email}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(c.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{c.orderCount}</td>
                  <td className="px-6 py-4 font-semibold text-foreground">{formatFcfa(c.totalSpent)} FCFA</td>
                </tr>
              ))}
              {data?.items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                    Aucun client trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {data && (
            <p className="border-t border-border px-6 py-3 text-[0.66rem] uppercase tracking-[0.16em] text-muted-foreground">
              {data.total} client(s) au total
            </p>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default CustomersList;
