import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Grid, List, SlidersHorizontal, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { CategoriesApi } from "@/features/categories/api/categories";
import { BrandsApi } from "@/features/brands/api/brands";
import type { ProductSearchRequest } from "@/features/products/types";
import { Badge } from "@/components/ui/badge";

interface ProductFiltersProps {
  onSearch: (params: ProductSearchRequest) => void;
  onSort: (sort: string) => void;
}

export const ProductFilters = ({ onSearch, onSort }: ProductFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch categories and brands from API
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: CategoriesApi.getAll,
  });

  const { data: brandsData } = useQuery({
    queryKey: ["brands"],
    queryFn: BrandsApi.getAll,
  });

  const categories = categoriesData?.result?.map(c => c.name) || [];
  const brands = brandsData?.result?.map(b => b.name) || [];

  // Apply filters whenever search params change (using debounced search query)
  useEffect(() => {
    const searchParams: ProductSearchRequest = {};
    
    if (debouncedSearchQuery.trim()) {
      searchParams.keyword = debouncedSearchQuery.trim();
    }
    
    if (selectedCategories.length > 0) {
      // Backend expects single category, use first selected
      searchParams.category = selectedCategories[0];
    }
    
    if (selectedBrands.length > 0) {
      // Backend expects single brand, use first selected
      searchParams.brand = selectedBrands[0];
    }
    
    if (priceRange[0] > 0) {
      searchParams.minPrice = priceRange[0];
    }
    
    if (priceRange[1] < 50000000) {
      searchParams.maxPrice = priceRange[1];
    }
    
    if (inStockOnly) {
      searchParams.inStock = true;
    }
    
    onSearch(searchParams);
  }, [debouncedSearchQuery, selectedCategories, selectedBrands, priceRange, inStockOnly, onSearch]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setPriceRange([0, 50000000]);
    setSelectedCategories([]);
    setSelectedBrands([]);
    setInStockOnly(false);
  };

  const hasActiveFilters = debouncedSearchQuery || selectedCategories.length > 0 || 
    selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 50000000 || inStockOnly;

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
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Sort & Filter Controls */}
          <div className="flex items-center gap-4">
            {/* Sort */}
            <Select defaultValue="featured" onValueChange={onSort}>
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
                  selectedCategories={selectedCategories}
                  selectedBrands={selectedBrands}
                  onCategoryToggle={handleCategoryToggle}
                  onBrandToggle={handleBrandToggle}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  inStockOnly={inStockOnly}
                  setInStockOnly={setInStockOnly}
                  formatPrice={formatPrice}
                />
              </SheetContent>
            </Sheet>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="hidden lg:flex"
              >
                <X className="h-4 w-4 mr-2" />
                Xóa bộ lọc
              </Button>
            )}

            {/* Desktop Filter Toggle */}
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden lg:flex"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Bộ Lọc
              {hasActiveFilters && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {(selectedCategories.length + selectedBrands.length + (inStockOnly ? 1 : 0))}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedCategories.map(cat => (
              <Badge key={cat} variant="secondary" className="gap-1">
                {cat}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleCategoryToggle(cat)}
                />
              </Badge>
            ))}
            {selectedBrands.map(brand => (
              <Badge key={brand} variant="secondary" className="gap-1">
                {brand}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleBrandToggle(brand)}
                />
              </Badge>
            ))}
            {inStockOnly && (
              <Badge variant="secondary" className="gap-1">
                Còn hàng
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setInStockOnly(false)}
                />
              </Badge>
            )}
          </div>
        )}

        {/* Desktop Filters */}
        {showFilters && (
          <div className="hidden lg:block mt-6 pt-6 border-t border-border/50">
            <FilterContent 
              categories={categories}
              brands={brands}
              selectedCategories={selectedCategories}
              selectedBrands={selectedBrands}
              onCategoryToggle={handleCategoryToggle}
              onBrandToggle={handleBrandToggle}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              formatPrice={formatPrice}
              isHorizontal
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface FilterContentProps {
  categories: string[];
  brands: string[];
  selectedCategories: string[];
  selectedBrands: string[];
  onCategoryToggle: (category: string) => void;
  onBrandToggle: (brand: string) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  inStockOnly: boolean;
  setInStockOnly: (value: boolean) => void;
  formatPrice: (price: number) => string;
  isHorizontal?: boolean;
}

const FilterContent = ({ 
  categories, 
  brands, 
  selectedCategories,
  selectedBrands,
  onCategoryToggle,
  onBrandToggle,
  priceRange, 
  setPriceRange, 
  inStockOnly,
  setInStockOnly,
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
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox 
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => onCategoryToggle(category)}
              />
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
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox 
                id={brand}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => onBrandToggle(brand)}
              />
              <label 
                htmlFor={brand} 
                className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {brand}
              </label>
            </div>
          ))}
        </div>
        
        {/* In Stock Filter */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="in-stock"
              checked={inStockOnly}
              onCheckedChange={setInStockOnly}
            />
            <label 
              htmlFor="in-stock" 
              className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Chỉ hiển thị sản phẩm còn hàng
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};