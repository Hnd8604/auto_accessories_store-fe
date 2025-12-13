import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductFilters } from "@/features/products/components/ProductFilters";
import { Products } from "@/features/products/components/Products";
import type { ProductSearchRequest } from "@/features/products/types";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useState<ProductSearchRequest>({});
  const [sortBy, setSortBy] = useState<string>("featured");

  const handleSearch = (params: ProductSearchRequest) => {
    setSearchParams(params);
  };

  const handleSort = (sort: string) => {
    setSortBy(sort);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <ProductFilters 
          onSearch={handleSearch}
          onSort={handleSort}
        />
        <Products 
          searchParams={searchParams}
          sortBy={sortBy}
        />
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPage;