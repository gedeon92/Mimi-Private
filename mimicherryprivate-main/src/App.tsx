import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/mc/ProtectedRoute";
import { Skeleton } from "@/components/mc/Skeleton";
// La page d'accueil reste en import statique (premier écran vu par la
// majorité des visiteurs — évite un flash de chargement sur l'entrée la
// plus fréquente). Toutes les autres routes sont chargées à la demande.
import Index from "./pages/Index.tsx";

const Collection = lazy(() => import("./pages/Collection.tsx"));
const Product = lazy(() => import("./pages/Product.tsx"));
const Cart = lazy(() => import("./pages/Cart.tsx"));
const Checkout = lazy(() => import("./pages/Checkout.tsx"));
const Login = lazy(() => import("./pages/auth/Login.tsx"));
const Register = lazy(() => import("./pages/auth/Register.tsx"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword.tsx"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword.tsx"));
const Account = lazy(() => import("./pages/account/Account.tsx"));
const Orders = lazy(() => import("./pages/account/Orders.tsx"));
const Addresses = lazy(() => import("./pages/account/Addresses.tsx"));
const Favorites = lazy(() => import("./pages/account/Favorites.tsx"));
const NotreHistoire = lazy(() => import("./pages/NotreHistoire.tsx"));
const SavoirFaire = lazy(() => import("./pages/SavoirFaire.tsx"));
const Livraison = lazy(() => import("./pages/Livraison.tsx"));
const Retours = lazy(() => import("./pages/Retours.tsx"));
const Entretien = lazy(() => import("./pages/Entretien.tsx"));
const FAQ = lazy(() => import("./pages/FAQ.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

// Par défaut, React Query recharge les données à chaque retour sur l'onglet
// avec staleTime: 0 — sur un site éditorial peu volatile, ça se traduit par
// des re-fetch visibles et des re-render inutiles à chaque navigation. Les
// mutations invalident déjà explicitement leurs requêtes (cf. contexts et
// pages admin), donc ce réglage plus permissif ne fait perdre aucune fraîcheur
// réellement nécessaire.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

/** Affiché brièvement pendant le chargement du code d'une route — les chunks
 * étant petits (quelques Ko), ceci n'est visible qu'une fraction de seconde
 * dans la plupart des cas ; un skeleton discret évite le flash de texte. */
const RouteFallback = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background">
    <Skeleton className="h-3 w-32" />
    <Skeleton className="h-3 w-20" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <BrowserRouter>
          <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/produit/:id" element={<Product />} />
            <Route path="/panier" element={<Cart />} />
            <Route
              path="/commande"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />

            {/* Espace client */}
            <Route path="/connexion" element={<Login />} />
            <Route path="/creer-compte" element={<Register />} />
            <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
            <Route path="/reinitialiser-mot-de-passe" element={<ResetPassword />} />
            <Route
              path="/compte"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route
              path="/compte/commandes"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/compte/adresses"
              element={
                <ProtectedRoute>
                  <Addresses />
                </ProtectedRoute>
              }
            />
            <Route path="/compte/favoris" element={<Favorites />} />

            {/* Pages éditoriales */}
            <Route path="/notre-histoire" element={<NotreHistoire />} />
            <Route path="/savoir-faire" element={<SavoirFaire />} />
            <Route path="/livraison" element={<Livraison />} />
            <Route path="/retours" element={<Retours />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/entretien-du-cuir" element={<Entretien />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
          </BrowserRouter>
        </FavoritesProvider>
      </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
