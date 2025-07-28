import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye, Heart, Star } from "lucide-react";
import dashboardImage from "@/assets/dashboard.jpg";
import seatsImage from "@/assets/seats.jpg";
import steeringWheelImage from "@/assets/steering-wheel.jpg";
import heroImage from "@/assets/hero-interior.jpg";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  isHot?: boolean;
  isNew?: boolean;
  description: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Bọc Ghế Da Nappa Premium",
    category: "Ghế Da",
    price: 15000000,
    originalPrice: 18000000,
    image: seatsImage,
    rating: 4.9,
    reviews: 45,
    isHot: true,
    description: "Da Nappa cao cấp imported từ Châu Âu, đường chỉ may tinh xảo"
  },
  {
    id: 2,
    name: "Ốp Taplo Carbon Fiber 3D",
    category: "Carbon Fiber",
    price: 8500000,
    originalPrice: 10000000,
    image: dashboardImage,
    rating: 4.8,
    reviews: 32,
    isNew: true,
    description: "Carbon fiber thật 100%, thiết kế 3D độc quyền"
  },
  {
    id: 3,
    name: "Vô Lăng Thể Thao Racing",
    category: "Vô Lăng",
    price: 12000000,
    image: steeringWheelImage,
    rating: 4.7,
    reviews: 28,
    description: "Da Alcantara premium với carbon fiber accent"
  },
  {
    id: 4,
    name: "Đèn LED Ambient 64 Màu",
    category: "LED Nội Thất",
    price: 5500000,
    originalPrice: 7000000,
    image: heroImage,
    rating: 4.9,
    reviews: 67,
    isHot: true,
    description: "Hệ thống LED RGB 64 màu, điều khiển qua app"
  },
  {
    id: 5,
    name: "Nệm Da Cao Cấp Mercedes",
    category: "Ghế Da",
    price: 25000000,
    image: seatsImage,
    rating: 5.0,
    reviews: 15,
    description: "Nệm ghế da cao cấp cho Mercedes, massage và sưởi ấm"
  },
  {
    id: 6,
    name: "Ốp Cửa Carbon Fiber",
    category: "Carbon Fiber",
    price: 6000000,
    originalPrice: 8000000,
    image: dashboardImage,
    rating: 4.6,
    reviews: 23,
    isNew: true,
    description: "Ốp trang trí cửa xe bằng carbon fiber cao cấp"
  }
];

const categories = [
  "Tất Cả",
  "Ghế Da", 
  "Carbon Fiber",
  "Vô Lăng",
  "LED Nội Thất",
  "Màn Hình",
  "Phụ Kiện"
];

interface ProductsProps {
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export const Products = ({ selectedCategory = "Tất Cả", onCategoryChange }: ProductsProps) => {
  const filteredProducts = selectedCategory === "Tất Cả" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddToCart = (product: Product) => {
    // Add to cart logic here
    console.log('Added to cart:', product.name);
  };

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Sản Phẩm 
            <span className="bg-gradient-accent bg-clip-text text-transparent"> Nổi Bật</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Khám phá bộ sưu tập sản phẩm nội thất ô tô cao cấp với chất lượng tốt nhất 
            và giá cả cạnh tranh nhất thị trường.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => onCategoryChange?.(category)}
                className="transition-all duration-300"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group bg-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-luxury hover:-translate-y-2 overflow-hidden">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isHot && (
                    <Badge variant="destructive" className="bg-primary/90 text-primary-foreground">
                      HOT
                    </Badge>
                  )}
                  {product.isNew && (
                    <Badge variant="secondary" className="bg-accent/90 text-accent-foreground">
                      MỚI
                    </Badge>
                  )}
                  {product.originalPrice && (
                    <Badge variant="outline" className="bg-background/90 text-primary border-primary/50">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
                  <Button variant="secondary" size="icon" className="bg-background/90 hover:bg-background">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="icon" className="bg-background/90 hover:bg-background">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quick Add to Cart */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    variant="luxury" 
                    className="w-full"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Thêm Vào Giỏ
                  </Button>
                </div>
              </div>

              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-xs text-muted-foreground">({product.reviews})</span>
                  </div>
                </div>
                <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors">
                  {product.name}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {product.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="luxury" size="xl">
            Xem Tất Cả Sản Phẩm
          </Button>
        </div>
      </div>
    </section>
  );
};