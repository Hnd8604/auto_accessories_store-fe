import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PostsApi } from "@/features/posts/api";
import { useToast } from "@/hooks/use-toast";
import type { PostResponse, PostRequest } from "@/features/posts/types";

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
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreHorizontal, Edit, Trash2, Loader2, Eye } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

// Validation schema
const postSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc"),
  shortDescription: z.string().optional(),
  thumbnailUrl: z.string().url("URL không hợp lệ").optional().or(z.literal("")),
  content: z.string().min(1, "Nội dung là bắt buộc"),
  published: z.boolean(),
  categoryId: z.number({
    required_error: "Danh mục là bắt buộc",
  }),
});

type PostFormData = z.infer<typeof postSchema>;

interface PostManagementProps {
  className?: string;
  categoryOptions: Array<{ id: number; name: string }>;
}

export const PostManagement: React.FC<PostManagementProps> = ({
  className,
  categoryOptions,
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<PostResponse | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form setup
  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      thumbnailUrl: "",
      content: "",
      published: false,
      categoryId: undefined,
    },
  });

  // Query: Get all posts
  const {
    data: postsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () => PostsApi.getAll(),
  });

  // Mutation: Create post
  const createMutation = useMutation({
    mutationFn: PostsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Thành công",
        description: "Bài viết đã được tạo thành công",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.message || "Không thể tạo bài viết",
      });
    },
  });

  // Mutation: Update post
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: PostRequest }) =>
      PostsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setIsEditDialogOpen(false);
      setEditingPost(null);
      form.reset();
      toast({
        title: "Thành công",
        description: "Bài viết đã được cập nhật",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.message || "Không thể cập nhật bài viết",
      });
    },
  });

  // Mutation: Delete post
  const deleteMutation = useMutation({
    mutationFn: PostsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Thành công",
        description: "Bài viết đã được xóa",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.message || "Không thể xóa bài viết",
      });
    },
  });

  // Handlers
  const handleCreate = () => {
    form.reset();
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (post: PostResponse) => {
    setEditingPost(post);
    form.reset({
      title: post.title,
      shortDescription: post.shortDescription || "",
      thumbnailUrl: post.thumbnailUrl || "",
      content: post.content,
      published: post.published,
      categoryId: parseInt(post.categoryName || "0"), // Will need category ID mapping
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setPostToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (postToDelete) {
      deleteMutation.mutate(postToDelete);
      setDeleteConfirmOpen(false);
      setPostToDelete(null);
    }
  };

  const onSubmit = (data: PostFormData) => {
    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const posts = postsData?.result?.content || [];

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <p className="text-destructive">
            Lỗi khi tải bài viết: {(error as Error).message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý bài viết</h2>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo bài viết
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách bài viết</CardTitle>
          <CardDescription>Quản lý tất cả bài viết blog</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Chưa có bài viết nào
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-center">Lượt xem</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-mono text-sm">
                      {post.id}
                    </TableCell>
                    <TableCell className="font-medium max-w-md truncate">
                      {post.title}
                    </TableCell>
                    <TableCell>{post.categoryName || "-"}</TableCell>
                    <TableCell>
                      {post.published ? (
                        <Badge variant="default">Đã xuất bản</Badge>
                      ) : (
                        <Badge variant="secondary">Bản nháp</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {post.viewCount ?? 0}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(post)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(post.id)}
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
            setEditingPost(null);
            form.reset();
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
            </DialogTitle>
            <DialogDescription>
              {editingPost
                ? "Cập nhật thông tin bài viết"
                : "Thêm bài viết mới cho blog"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tiêu đề bài viết" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả ngắn</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập mô tả ngắn..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL ảnh đại diện</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        {...field}
                      />
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
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
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
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nội dung</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập nội dung bài viết..."
                        className="min-h-[300px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Xuất bản</FormLabel>
                      <FormDescription>
                        Bài viết sẽ hiển thị công khai trên website
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setIsEditDialogOpen(false);
                    setEditingPost(null);
                    form.reset();
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingPost ? "Cập nhật" : "Tạo mới"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={confirmDelete}
        title="Xác nhận xóa bài viết"
        description="Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  );
};
