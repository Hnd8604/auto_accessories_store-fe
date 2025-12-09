import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ProductsApi } from "@/features/products/api/products";
import { ProductImagesApi } from "@/features/products/api/productImages";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Loader2,
  Images,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProductImageManagement } from "@/features/products/components/ProductImageManagement";
import type { ProductRequest, ProductResponse } from "../types";

const productSchema = z.object({
  name: z.string().min(1, { message: "Tên sản phẩm không được để trống." }),
  description: z.string().optional(),
  unitPrice: z.number().min(0, { message: "Giá phải lớn hơn hoặc bằng 0." }),
  categoryId: z.number().min(1, { message: "Vui lòng chọn danh mục." }),
  brandId: z.number().min(1, { message: "Vui lòng chọn thương hiệu." }),
  stockQuantity: z
    .number()
    .min(0, { message: "Số lượng tồn kho phải lớn hơn hoặc bằng 0." })
    .optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductManagementProps {
  categoryOptions?: Array<{ id: number; name: string }>;
  brandOptions?: Array<{ id: number; name: string }>;
}

export const ProductManagement = ({
  categoryOptions = [],
  brandOptions = [],
}: ProductManagementProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isImageManagementOpen, setIsImageManagementOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(
    null
  );
  const [viewingProduct, setViewingProduct] = useState<ProductResponse | null>(
    null
  );
  const [managingImagesProduct, setManagingImagesProduct] =
    useState<ProductResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form setup
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      unitPrice: 0,
      categoryId: 0,
      brandId: 0,
      stockQuantity: 0,
    },
  });

  // Query: Get products with pagination
  const {
    data: productsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", currentPage, pageSize],
    queryFn: () => ProductsApi.getAll({ page: currentPage, size: pageSize }),
  });

  // Query: Get product images for products (to show primary images)
  const { data: productImagesMap } = useQuery({
    queryKey: ["productImagesMap", productsData?.result?.content],
    queryFn: async () => {
      const products = productsData?.result?.content || [];
      const imagesMap: Record<number, string> = {};

      await Promise.all(
        products.map(async (product) => {
          try {
            const response = await ProductImagesApi.getByProductId(product.id);
            const primaryImage = response.result?.find((img) => img.isPrimary);
            if (primaryImage) {
              imagesMap[product.id] = primaryImage.imageUrl;
            }
          } catch (error) {
            // Ignore errors for individual products
          }
        })
      );

      return imagesMap;
    },
    enabled: !!productsData?.result?.content?.length,
  });

  // Mutation: Create product
  const createMutation = useMutation({
    mutationFn: ProductsApi.create,
    onSuccess: () => {
      toast({
        title: "Thành công!",
        description: "Sản phẩm đã được tạo thành công.",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsCreateDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Lỗi tạo sản phẩm",
        description: error.message || "Đã có lỗi xảy ra khi tạo sản phẩm.",
      });
    },
  });

  // Mutation: Update product
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductRequest }) =>
      ProductsApi.update(id, data),
    onSuccess: () => {
      toast({
        title: "Thành công!",
        description: "Sản phẩm đã được cập nhật thành công.",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Lỗi cập nhật sản phẩm",
        description: error.message || "Đã có lỗi xảy ra khi cập nhật sản phẩm.",
      });
    },
  });

  // Mutation: Delete product
  const deleteMutation = useMutation({
    mutationFn: ProductsApi.delete,
    onSuccess: () => {
      toast({
        title: "Thành công!",
        description: "Sản phẩm đã được xóa thành công.",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Lỗi xóa sản phẩm",
        description: error.message || "Đã có lỗi xảy ra khi xóa sản phẩm.",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: ProductFormData) => {
    const productRequest: ProductRequest = {
      name: data.name,
      description: data.description || "",
      unitPrice: data.unitPrice,
      categoryId: data.categoryId,
      brandId: data.brandId,
      stockQuantity: data.stockQuantity || 0,
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: productRequest });
    } else {
      createMutation.mutate(productRequest);
    }
  };

  // Handle edit button click
  const handleEdit = (product: ProductResponse) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      description: product.description || "",
      unitPrice: product.unitPrice,
      categoryId:
        categoryOptions.find((c) => c.name === product.categoryName)?.id || 0,
      brandId: brandOptions.find((b) => b.name === product.brandName)?.id || 0,
      stockQuantity: product.stockQuantity || 0,
    });
    setIsEditDialogOpen(true);
  };

  // Handle delete button click
  const handleDelete = (productId: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      deleteMutation.mutate(productId);
    }
  };

  // Handle view detail button click
  const handleViewDetail = (product: ProductResponse) => {
    setViewingProduct(product);
    setIsDetailDialogOpen(true);
  };

  // Handle manage images button click
  const handleManageImages = (product: ProductResponse) => {
    setManagingImagesProduct(product);
    setIsImageManagementOpen(true);
  };

  // Get products from response
  const products = productsData?.result?.content || [];
  const totalPages = productsData?.result?.totalPages || 0;

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Lỗi tải dữ liệu: {(error as Error).message}</p>
            <Button
              variant="outline"
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ["products"] })
              }
              className="mt-2"
            >
              Thử lại
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý sản phẩm</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách sản phẩm</CardTitle>
          <CardDescription>
            Quản lý sản phẩm dịch vụ nội thất ô tô ({products.length} sản phẩm)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Đang tải...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hình ảnh</TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Thương hiệu</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Tồn kho</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={
                            productImagesMap?.[product.id] || "/placeholder.svg"
                          }
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {product.id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {product.categoryName || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {product.brandName || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.unitPrice.toLocaleString()} VND
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          product.stockQuantity === 0 ? "text-red-600" : ""
                        }
                      >
                        {product.stockQuantity || 0}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewDetail(product)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleManageImages(product)}
                          >
                            <Images className="h-4 w-4 mr-2" />
                            Quản lý hình ảnh
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(product)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {products.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-muted-foreground">
                Trang {currentPage + 1} / {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages - 1}
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
                  }
                >
                  Tiếp
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Product Dialog */}
      <Dialog
        open={isCreateDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setIsEditDialogOpen(false);
            setEditingProduct(null);
            form.reset();
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? "Cập nhật thông tin sản phẩm"
                : "Tạo sản phẩm mới cho hệ thống"}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Tên sản phẩm</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên sản phẩm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục</FormLabel>
                      <Select
                        value={field.value?.toString() || ""}
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoryOptions.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brandId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thương hiệu</FormLabel>
                      <Select
                        value={field.value?.toString() || ""}
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn thương hiệu" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {brandOptions.map((brand) => (
                            <SelectItem
                              key={brand.id}
                              value={brand.id.toString()}
                            >
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unitPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá (VND)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? 0 : parseInt(value));
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stockQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tồn kho</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? 0 : parseInt(value));
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mô tả chi tiết sản phẩm..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setIsEditDialogOpen(false);
                    setEditingProduct(null);
                    form.reset();
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingProduct ? "Cập nhật" : "Tạo sản phẩm"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Product Detail Dialog */}
      <Dialog
        open={isDetailDialogOpen}
        onOpenChange={(open) => {
          setIsDetailDialogOpen(open);
          if (!open) setViewingProduct(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết sản phẩm</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về sản phẩm
            </DialogDescription>
          </DialogHeader>

          {viewingProduct && (
            <div className="space-y-6">
              {/* Product Image */}
              <div className="flex justify-center">
                <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <img
                    src={
                      productImagesMap?.[viewingProduct.id] ||
                      "/placeholder.svg"
                    }
                    alt={viewingProduct.name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                </div>
              </div>

              {/* Product Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Tên sản phẩm
                    </label>
                    <p className="text-lg font-semibold">
                      {viewingProduct.name}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Giá
                    </label>
                    <p className="text-lg font-semibold text-green-600">
                      {viewingProduct.unitPrice?.toLocaleString("vi-VN")} VNĐ
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Danh mục
                    </label>
                    <p className="text-base">
                      {viewingProduct.categoryName || "Chưa có danh mục"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Thương hiệu
                    </label>
                    <p className="text-base">
                      {viewingProduct.brandName || "Chưa có thương hiệu"}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Số lượng tồn kho
                    </label>
                    <p className="text-base">
                      <Badge
                        variant={
                          (viewingProduct.stockQuantity || 0) > 10
                            ? "default"
                            : (viewingProduct.stockQuantity || 0) > 0
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {viewingProduct.stockQuantity || 0}
                      </Badge>
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      ID sản phẩm
                    </label>
                    <p className="text-base text-gray-600">
                      #{viewingProduct.id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Description */}
              {viewingProduct.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Mô tả sản phẩm
                  </label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                    <p className="text-base text-gray-700 whitespace-pre-wrap">
                      {viewingProduct.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDetailDialogOpen(false);
                    setViewingProduct(null);
                  }}
                >
                  Đóng
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDetailDialogOpen(false);
                    handleManageImages(viewingProduct);
                  }}
                >
                  <Images className="w-4 h-4 mr-2" />
                  Quản lý hình ảnh
                </Button>
                <Button
                  onClick={() => {
                    setIsDetailDialogOpen(false);
                    handleEdit(viewingProduct);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Product Image Management */}
      {managingImagesProduct && (
        <ProductImageManagement
          productId={managingImagesProduct.id}
          productName={managingImagesProduct.name}
          isOpen={isImageManagementOpen}
          onOpenChange={(open) => {
            setIsImageManagementOpen(open);
            if (!open) {
              setManagingImagesProduct(null);
              // Refetch product images to update the table
              queryClient.invalidateQueries({ queryKey: ["productImagesMap"] });
            }
          }}
        />
      )}
    </div>
  );
};

export default ProductManagement;
