import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";

// Pages
import Index from "@/pages/Index";
import BlogPage from "@/pages/BlogPage";
import AdminPage from "@/pages/AdminPage";
import CartPage from "@/pages/CartPage";
import NotFound from "@/pages/NotFound";

// Feature Pages
import AuthPage from "@/features/auth/pages/AuthPage";
import ProductsPage from "@/features/products/pages/ProductsPage";
import OrderPage from "@/features/orders/pages/OrderPage";
import PostDetailPage from "@/features/posts/pages/PostDetailPage";
import PostEditorPage from "@/features/posts/pages/PostEditorPage";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/order" element={<OrderPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<PostDetailPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAuth requireAdmin>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/posts/new"
        element={
          <ProtectedRoute requireAuth requireAdmin>
            <PostEditorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/posts/edit/:id"
        element={
          <ProtectedRoute requireAuth requireAdmin>
            <PostEditorPage />
          </ProtectedRoute>
        }
      />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
