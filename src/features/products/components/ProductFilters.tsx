import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

export const ProductFilters = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categories = [
    "Ghế Da",
    "Carbon Fiber", 
    "Vô Lăng",
    "LED Nội Thất",
    "Màn Hình",
    "Phụ Kiện"
  ];

  const brands = [
    "Mercedes-Benz",
    "BMW",
    "Audi", 
    "Lexus",
    "Porsche",
    "Range Rover"
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="bg-card border-b border-border/50 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sort & Filter Controls */}
          <div className="flex items-center gap-4">
            {/* Sort */}
            <Select defaultValue="featured">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Nổi bật</SelectItem>
                <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                <SelectItem value="rating">Đánh giá cao</SelectItem>
                <SelectItem value="newest">Mới nhất</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex border border-border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Filter Toggle */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Bộ Lọc
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Bộ Lọc Sản Phẩm</SheetTitle>
                </SheetHeader>
                <FilterContent 
                  categories={categories}
                  brands={brands}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  formatPrice={formatPrice}
                />
              </SheetContent>
            </Sheet>

            {/* Desktop Filter Toggle */}
            <Button variant="outline" size="sm" className="hidden lg:flex">
              <Filter className="h-4 w-4 mr-2" />
              Bộ Lọc
            </Button>
          </div>
        </div>

        {/* Desktop Filters */}
        <div className="hidden lg:block mt-6 pt-6 border-t border-border/50">
          <FilterContent 
            categories={categories}
            brands={brands}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            formatPrice={formatPrice}
            isHorizontal
          />
        </div>
      </div>
    </div>
  );
};

interface FilterContentProps {
  categories: string[];
  brands: string[];
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  formatPrice: (price: number) => string;
  isHorizontal?: boolean;
}

const FilterContent = ({ 
  categories, 
  brands, 
  priceRange, 
  setPriceRange, 
  formatPrice, 
  isHorizontal = false 
}: FilterContentProps) => {
  const containerClass = isHorizontal 
    ? "grid grid-cols-1 md:grid-cols-3 gap-8" 
    : "space-y-8";

  return (
    <div className={containerClass}>
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-foreground mb-4">Danh Mục</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox id={category} />
              <label 
                htmlFor={category} 
                className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-foreground mb-4">Khoảng Giá</h3>
        <div className="space-y-2">
          {[
            { label: "Dưới 5 triệu", min: 0, max: 5000000 },
            { label: "5 - 10 triệu", min: 5000000, max: 10000000 },
            { label: "10 - 20 triệu", min: 10000000, max: 20000000 },
            { label: "20 - 30 triệu", min: 20000000, max: 30000000 },
            { label: "30 - 50 triệu", min: 30000000, max: 50000000 },
            { label: "Trên 50 triệu", min: 50000000, max: 100000000 }
          ].map((range) => (
            <div key={range.label} className="flex items-center space-x-2">
              <Checkbox 
                id={range.label}
                checked={priceRange[0] === range.min && priceRange[1] === range.max}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setPriceRange([range.min, range.max]);
                  }
                }}
              />
              <label 
                htmlFor={range.label} 
                className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {range.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-semibold text-foreground mb-4">Thương Hiệu Xe</h3>
        <div className="space-y-3">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox id={brand} />
              <label 
                htmlFor={brand} 
                className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};