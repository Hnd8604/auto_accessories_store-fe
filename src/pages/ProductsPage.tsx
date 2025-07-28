import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductFilters } from "@/components/ProductFilters";
import { Products } from "@/components/Products";

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tất Cả");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <ProductFilters />
        <Products 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPage;