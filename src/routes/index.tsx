import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";

// Pages
import Index from "@/pages/Index";
import BlogPage from "@/pages/BlogPage";
import AdminPage from "@/pages/AdminPage";
import NotFound from "@/pages/NotFound";

// Feature Pages
import AuthPage from "@/features/auth/pages/AuthPage";
import ProductsPage from "@/features/products/pages/ProductsPage";
import OrderPage from "@/features/orders/pages/OrderPage";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/order" element={<OrderPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAuth requireAdmin>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
