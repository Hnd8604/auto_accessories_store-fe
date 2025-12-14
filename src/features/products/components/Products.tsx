import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye, Heart, Star, Loader2 } from "lucide-react";
import { ProductsApi, ProductImagesApi } from "@/features/products/api";
import { CategoriesApi } from "@/features/categories/api/categories";
import type { ProductResponse, ProductSearchRequest } from "@/features/products/types";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/cart-context";

interface ProductsProps {
  limit?: number;
  searchParams?: ProductSearchRequest;
  sortBy?: string;
  showHeader?: boolean;
}

export const Products = ({ limit, searchParams = {}, sortBy = "featured", showHeader = true }: ProductsProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [productsWithImages, setProductsWithImages] = useState<ProductResponse[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Tất Cả");

  // Fetch categories for tabs
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: CategoriesApi.getAll,
  });

  const categories = ["Tất Cả", ...(categoriesData?.result?.map(c => c.name) || [])];

  // Determine if we need to use search API or regular getAll
  const hasSearchParams = searchParams && (
    searchParams.keyword || 
    searchParams.category || 
    searchParams.brand || 
    searchParams.minPrice !== undefined || 
    searchParams.maxPrice !== undefined || 
    searchParams.inStock
  );

  // Merge category filter with searchParams
  const mergedSearchParams = {
    ...searchParams,
    ...(selectedCategory !== "Tất Cả" && { category: selectedCategory }),
  };

  const hasEffectiveSearchParams = mergedSearchParams && (
    mergedSearchParams.keyword || 
    mergedSearchParams.category || 
    mergedSearchParams.brand || 
    mergedSearchParams.minPrice !== undefined || 
    mergedSearchParams.maxPrice !== undefined || 
    mergedSearchParams.inStock
  );

  // Fetch products - use search if params exist
  const { data: productsData, isLoading: productsLoading, isFetching } = useQuery({
    queryKey: ["products", mergedSearchParams, selectedCategory, { page: 0, size: limit || 100 }],
    queryFn: () => {
      if (hasEffectiveSearchParams) {
        return ProductsApi.search(mergedSearchParams, { page: 0, size: limit || 100 });
      }
      return ProductsApi.getAll({ page: 0, size: limit || 100 });
    },
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Cache for 10 minutes
    keepPreviousData: true, // Keep previous data while fetching new data
  });

  let products = productsData?.result?.content || [];

  // Apply client-side sorting
  if (sortBy && products.length > 0) {
    products = [...products].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.unitPrice - b.unitPrice;
        case "price-high":
          return b.unitPrice - a.unitPrice;
        case "newest":
          return b.id - a.id;
        case "rating":
          // If you have rating field, sort by it
          return 0;
        default:
          return 0;
      }
    });
  }

  // Apply limit if specified
  const filteredProducts = limit ? products.slice(0, limit) : products;

  // Fetch images ONLY for filtered/displayed products
  useEffect(() => {
    let isCancelled = false;

    if (filteredProducts.length > 0) {
      // Don't set loading immediately to avoid flicker
      const loadingTimer = setTimeout(() => {
        if (!isCancelled) setLoadingImages(true);
      }, 100);

      Promise.all(
        filteredProducts.map(async (product) => {
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
          if (!isCancelled) {
            clearTimeout(loadingTimer);
            setProductsWithImages(productsWithImgs);
            setLoadingImages(false);
          }
        })
        .catch(error => {
          if (!isCancelled) {
            clearTimeout(loadingTimer);
            console.error('Failed to fetch product images:', error);
            setProductsWithImages(filteredProducts);
            setLoadingImages(false);
          }
        });

      return () => {
        isCancelled = true;
        clearTimeout(loadingTimer);
      };
    } else {
      setProductsWithImages([]);
      setLoadingImages(false);
    }
  }, [filteredProducts.length, filteredProducts.map(p => p.id).join(',')]);

  const displayProducts = productsWithImages.length > 0 ? productsWithImages : filteredProducts;

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

  // Skeleton loader component
  const ProductSkeleton = () => (
    <Card className="overflow-hidden animate-pulse">
      <div className="aspect-square bg-muted" />
      <CardContent className="p-4 space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="h-8 bg-muted rounded w-full mt-4" />
      </CardContent>
    </Card>
  );

  // Only show skeleton on initial load when there's no data at all
  const isInitialLoading = productsLoading && !productsData;

  if (isInitialLoading) {
    return (
      <section className="py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: limit || 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-muted/20">
      <div className="container mx-auto px-4">
        {showHeader && (
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Sản Phẩm Nội Thất Ô Tô
            </h2>
            {/* <p className="text-lg text-muted-foreground">
              Khám phá bộ sưu tập phụ kiện và nội thất ô tô cao cấp từ các thương hiệu hàng đầu
            </p> */}

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="transition-all duration-300"
                  disabled={isFetching && !productsLoading}
                >
                  {category}
                </Button>
              ))}
            </div>
            
            {/* Loading indicator when refetching */}
            {isFetching && !productsLoading && (
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 relative">
          {/* Overlay loading indicator when switching categories */}
          {isFetching && displayProducts.length > 0 && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {displayProducts.length === 0 && !isFetching ? (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-muted-foreground">Không có sản phẩm nào</p>
            </div>
          ) : (
            displayProducts.map((product) => (
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

                  {/* Action Buttons */}
                  <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-0.5">
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="bg-background/90 hover:bg-background h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewProduct(product.slug);
                      }}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>

                </div>

                <CardHeader className="p-3 pb-2">
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
                    <ShoppingCart className="h-3 w-3 mr-0.5" />
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