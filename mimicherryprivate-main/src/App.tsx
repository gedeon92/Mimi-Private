import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/mc/ProtectedRoute";
import Index from "./pages/Index.tsx";
import Collection from "./pages/Collection.tsx";
import Product from "./pages/Product.tsx";
import Cart from "./pages/Cart.tsx";
import Checkout from "./pages/Checkout.tsx";
import Login from "./pages/auth/Login.tsx";
import Register from "./pages/auth/Register.tsx";
import ForgotPassword from "./pages/auth/ForgotPassword.tsx";
import ResetPassword from "./pages/auth/ResetPassword.tsx";
import Account from "./pages/account/Account.tsx";
import Orders from "./pages/account/Orders.tsx";
import Addresses from "./pages/account/Addresses.tsx";
import Favorites from "./pages/account/Favorites.tsx";
import NotreHistoire from "./pages/NotreHistoire.tsx";
import SavoirFaire from "./pages/SavoirFaire.tsx";
import Livraison from "./pages/Livraison.tsx";
import Retours from "./pages/Retours.tsx";
import Entretien from "./pages/Entretien.tsx";
import FAQ from "./pages/FAQ.tsx";
import Contact from "./pages/Contact.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <BrowserRouter>
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
          </BrowserRouter>
        </FavoritesProvider>
      </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
