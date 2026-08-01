import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProductsList from "./pages/products/ProductsList";
import ProductForm from "./pages/products/ProductForm";
import Categories from "./pages/categories/Categories";
import OrdersList from "./pages/orders/OrdersList";
import OrderDetail from "./pages/orders/OrderDetail";
import CustomersList from "./pages/customers/CustomersList";
import CustomerDetail from "./pages/customers/CustomerDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminAuthProvider>
      <Toaster position="top-center" />
      <BrowserRouter>
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
      </BrowserRouter>
    </AdminAuthProvider>
  </QueryClientProvider>
);

export default App;
