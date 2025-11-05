import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CategoriesApi } from "@/api/endpoints/categories";
import { useToast } from "@/hooks/use-toast";
import type { CategoryResponse, CategoryRequest } from "@/api/types";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Plus, MoreHorizontal, Eye, Edit, Trash2, Loader2 } from "lucide-react";

// Validation schema
const categorySchema = z.object({
  name: z.string().min(1, "Tên danh mục là bắt buộc"),
  description: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryManagementProps {
  className?: string;
}

export const CategoryManagement: React.FC<CategoryManagementProps> = ({
  className,
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryResponse | null>(null);
  const [viewingCategory, setViewingCategory] =
    useState<CategoryResponse | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form setup
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Query: Get all categories
  const {
    data: categoriesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: CategoriesApi.getAll,
  });

  // Mutation: Create category
  const createMutation = useMutation({
    mutationFn: CategoriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Thành công",
        description: "Danh mục đã được tạo thành công",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra khi tạo danh mục",
        variant: "destructive",
      });
    },
  });

  // Mutation: Update category
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryRequest }) =>
      CategoriesApi.update(parseInt(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsEditDialogOpen(false);
      setEditingCategory(null);
      form.reset();
      toast({
        title: "Thành công",
        description: "Danh mục đã được cập nhật thành công",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra khi cập nhật danh mục",
        variant: "destructive",
      });
    },
  });

  // Mutation: Delete category
  const deleteMutation = useMutation({
    mutationFn: CategoriesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Thành công",
        description: "Danh mục đã được xóa thành công",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra khi xóa danh mục",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: CategoryFormData) => {
    const categoryRequest: CategoryRequest = {
      name: data.name,
      description: data.description || undefined,
    };

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: categoryRequest });
    } else {
      createMutation.mutate(categoryRequest);
    }
  };

  // Handle edit button click
  const handleEdit = (category: CategoryResponse) => {
    setEditingCategory(category);
    form.reset({
      name: category.name,
      description: category.description || "",
    });
    setIsEditDialogOpen(true);
  };

  // Handle delete button click
  const handleDelete = (categoryId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      deleteMutation.mutate(parseInt(categoryId));
    }
  };

  // Handle view detail button click
  const handleViewDetail = (category: CategoryResponse) => {
    setViewingCategory(category);
    setIsDetailDialogOpen(true);
  };

  // Get categories from response
  const categories = categoriesData?.result || [];

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Có lỗi xảy ra khi tải danh sách danh mục
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Quản lý Danh mục</CardTitle>
              <CardDescription>
                Quản lý danh mục sản phẩm trong hệ thống
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm danh mục
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tên danh mục</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-mono text-sm">
                      {category.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {category.description || "Không có mô tả"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewDetail(category)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEdit(category)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(category.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog
        open={isCreateDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setIsEditDialogOpen(false);
            setEditingCategory(null);
            form.reset();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Cập nhật thông tin danh mục"
                : "Nhập thông tin để tạo danh mục mới"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên danh mục *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên danh mục..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả chi tiết danh mục..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setIsEditDialogOpen(false);
                    setEditingCategory(null);
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
                  {editingCategory ? "Cập nhật" : "Tạo danh mục"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Category Detail Dialog */}
      <Dialog
        open={isDetailDialogOpen}
        onOpenChange={(open) => {
          setIsDetailDialogOpen(open);
          if (!open) setViewingCategory(null);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Chi tiết danh mục</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về danh mục
            </DialogDescription>
          </DialogHeader>

          {viewingCategory && (
            <div className="space-y-6">
              {/* Category Information */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    ID danh mục
                  </label>
                  <p className="text-base text-gray-600 font-mono">
                    #{viewingCategory.id}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Tên danh mục
                  </label>
                  <p className="text-lg font-semibold">
                    {viewingCategory.name}
                  </p>
                </div>

                {viewingCategory.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Mô tả
                    </label>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                      <p className="text-base text-gray-700 whitespace-pre-wrap">
                        {viewingCategory.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDetailDialogOpen(false);
                    setViewingCategory(null);
                  }}
                >
                  Đóng
                </Button>
                <Button
                  onClick={() => {
                    setIsDetailDialogOpen(false);
                    handleEdit(viewingCategory);
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
    </div>
  );
};
