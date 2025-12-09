import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye, Heart, Star, Loader2 } from "lucide-react";
import { ProductsApi, ProductImagesApi } from "@/features/products/api";
import type { ProductResponse } from "@/features/products/types";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/cart-context";

interface ProductsProps {
  limit?: number;
}

export const Products = ({ limit = 6 }: ProductsProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất Cả");
  const [productsWithImages, setProductsWithImages] = useState<ProductResponse[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);

  // Fetch products
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["products", { page: 0, size: 20 }],
    queryFn: () => ProductsApi.getAll({ page: 0, size: 20 }),
  });

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: ProductsApi.getAllCategories,
  });

  const products = productsData?.result?.content || [];
  const categories = ["Tất Cả", ...(categoriesData?.result?.map(c => c.name) || [])];

  // Fetch images for each product
  useEffect(() => {
    if (products.length > 0) {
      setLoadingImages(true);
      Promise.all(
        products.map(async (product) => {
          try {
            const response = await ProductImagesApi.getByProductId(product.id);
            const images = response?.result || [];
            const primaryImage = images.find(img => img.isPrimary);
            return {
              ...product,
              images,
              primaryImageUrl: primaryImage?.imageUrl,
            };
          } catch (error) {
            console.error(`Failed to fetch images for product ${product.id}:`, error);
            return product;
          }
        })
      )
        .then(productsWithImgs => {
          setProductsWithImages(productsWithImgs);
          setLoadingImages(false);
        })
        .catch(error => {
          console.error('Failed to fetch product images:', error);
          setProductsWithImages(products);
          setLoadingImages(false);
        });
    }
  }, [products]);

  const displayProducts = productsWithImages.length > 0 ? productsWithImages : products;

  const filteredProducts = selectedCategory === "Tất Cả" 
    ? displayProducts.slice(0, limit)
    : displayProducts.filter(product => product.categoryName === selectedCategory).slice(0, limit);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddToCart = async (product: ProductResponse, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleViewProduct = (slug: string) => {
    navigate(`/products/${slug}`);
  };

  if (productsLoading || categoriesLoading || loadingImages) {
    return (
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Sản Phẩm 
            <span className="bg-gradient-accent bg-clip-text text-transparent"> Nổi Bật</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
            Khám phá bộ sưu tập sản phẩm nội thất ô tô cao cấp với chất lượng tốt nhất 
            và giá cả cạnh tranh nhất thị trường.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="transition-all duration-300"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-muted-foreground">Không có sản phẩm nào</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="group bg-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden cursor-pointer"
                onClick={() => handleViewProduct(product.slug)}
              >
                <div className="relative">
                  <div className="aspect-square w-full overflow-hidden bg-muted">
                  <img
                    src={product.primaryImageUrl || product.images?.find(img => img.isPrimary)?.imageUrl || "https://placehold.co/600x600?text=No+Image"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://placehold.co/600x600?text=No+Image";
                    }}
                  />
                </div>
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.stockQuantity > 0 ? (
                      <Badge variant="secondary" className="bg-green-500/90 text-white text-xs">
                        Còn hàng
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">
                        Hết hàng
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-1">
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="bg-background/90 hover:bg-background h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewProduct(product.slug);
                      }}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>

                </div>

                <CardHeader className="p-3 pb-2">-2">
                  <div className="flex items-center gap-1 mb-1.5">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {product.categoryName}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {product.brandName}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground line-clamp-1 mt-1">
                    {product.description || "Sản phẩm chất lượng cao"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-3 pt-0 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(product.unitPrice)}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Còn: {product.stockQuantity}
                    </span>
                  </div>
                  <Button 
                    onClick={(e) => handleAddToCart(product, e)}
                    className="w-full h-8 text-xs"
                    disabled={product.stockQuantity === 0}
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Thêm Vào Giỏ
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="text-center mt-8">
          <Button 
            variant="luxury" 
            size="lg"
            onClick={() => navigate("/products")}
          >
            Xem Tất Cả Sản Phẩm
          </Button>
        </div>
      </div>
    </section>
  );
};