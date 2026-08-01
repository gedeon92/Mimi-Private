import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";

const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const ProductsList = lazy(() => import("./pages/products/ProductsList"));
const ProductForm = lazy(() => import("./pages/products/ProductForm"));
const Categories = lazy(() => import("./pages/categories/Categories"));
const OrdersList = lazy(() => import("./pages/orders/OrdersList"));
const OrderDetail = lazy(() => import("./pages/orders/OrderDetail"));
const CustomersList = lazy(() => import("./pages/customers/CustomersList"));
const CustomerDetail = lazy(() => import("./pages/customers/CustomerDetail"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <p className="text-[0.62rem] uppercase tracking-[0.3em] text-muted-foreground">
      Chargement…
    </p>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminAuthProvider>
      <Toaster position="top-center" />
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/connexion" element={<Login />} />
            <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
            <Route path="/reinitialiser-mot-de-passe" element={<ResetPassword />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/produits" element={<ProtectedRoute><ProductsList /></ProtectedRoute>} />
            <Route path="/produits/nouveau" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
            <Route path="/produits/:id" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
            <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
            <Route path="/commandes" element={<ProtectedRoute><OrdersList /></ProtectedRoute>} />
            <Route path="/commandes/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
            <Route path="/clients" element={<ProtectedRoute><CustomersList /></ProtectedRoute>} />
            <Route path="/clients/:id" element={<ProtectedRoute><CustomerDetail /></ProtectedRoute>} />
            <Route path="/profil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AdminAuthProvider>
  </QueryClientProvider>
);

export default App;
