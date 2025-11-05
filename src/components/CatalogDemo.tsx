import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CatalogManagement } from "./CatalogManagement";
import { Toaster } from "@/components/ui/toaster";

// Create a query client
const queryClient = new QueryClient();

// Demo component để test
export const CatalogDemo = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">
          Demo Quản lý Danh mục & Thương hiệu
        </h1>
        <CatalogManagement />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
};

export default CatalogDemo;
