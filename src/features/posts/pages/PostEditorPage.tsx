import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PostsApi } from "@/features/posts/api";
import { PostCategoriesApi } from "@/features/posts/api";
import { useToast } from "@/hooks/use-toast";
import type { PostRequest } from "@/features/posts/types";

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
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import { ContentPreview } from "@/components/shared/ContentPreview";
import { ArrowLeft, Loader2, Eye, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

export const PostEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!id;

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

  // Fetch post data if editing
  const { data: postData, isLoading: isLoadingPost } = useQuery({
    queryKey: ["post", id],
    queryFn: () => PostsApi.getById(Number(id)),
    enabled: isEditMode,
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["post-categories"],
    queryFn: () => PostCategoriesApi.getAll(),
  });

  const categoryOptions = categoriesData?.result || [];

  // Populate form when editing
  useEffect(() => {
    if (postData?.result && isEditMode) {
      const post = postData.result;
      form.reset({
        title: post.title,
        shortDescription: post.shortDescription || "",
        thumbnailUrl: post.thumbnailUrl || "",
        content: post.content,
        published: post.published,
        categoryId: Number.parseInt(post.categoryName || "0"),
      });
    }
  }, [postData, isEditMode, form]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: PostRequest) => PostsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Thành công",
        description: "Bài viết đã được tạo thành công!",
      });
      navigate("/admin");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error?.message || "Không thể tạo bài viết",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: PostRequest }) =>
      PostsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      toast({
        title: "Thành công",
        description: "Bài viết đã được cập nhật thành công!",
      });
      navigate("/admin");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error?.message || "Không thể cập nhật bài viết",
      });
    },
  });

  const onSubmit = async (data: PostFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: Number(id),
          data: data as PostRequest,
        });
      } else {
        await createMutation.mutateAsync(data as PostRequest);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/admin");
  };

  if (isEditMode && isLoadingPost) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
              <div>
                <h1 className="text-2xl font-bold">
                  {isEditMode ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {isEditMode
                    ? "Cập nhật thông tin bài viết của bạn"
                    : "Viết và xuất bản bài viết mới cho blog"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => form.setValue("published", false)}
                disabled={isSubmitting}
              >
                Lưu nháp
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditMode ? "Cập nhật" : "Xuất bản"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6">
              {/* Thumbnail Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Ảnh đại diện</CardTitle>
                  <CardDescription>
                    Ảnh hiển thị trong danh sách bài viết
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                        {field.value && (
                          <div className="mt-4">
                            <img
                              src={field.value}
                              alt="Preview"
                              className="w-full max-w-sm rounded-lg border"
                              onError={(e) => {
                                e.currentTarget.src = "";
                                e.currentTarget.alt = "Invalid image URL";
                              }}
                            />
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Settings Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt</CardTitle>
                  <CardDescription>
                    Cấu hình xuất bản và phân loại
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="published"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Xuất bản
                            </FormLabel>
                            <FormDescription>
                              Bài viết sẽ hiển thị công khai
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

                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Danh mục *</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(Number.parseInt(value))
                            }
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
                  </CardContent>
                </Card>

              {/* Main Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Nội dung bài viết</CardTitle>
                  <CardDescription>
                    Nhập thông tin chi tiết về bài viết
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tiêu đề *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập tiêu đề bài viết..."
                              {...field}
                            />
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
                              placeholder="Mô tả ngắn gọn về bài viết (hiển thị trong danh sách)..."
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
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nội dung bài viết *</FormLabel>
                          <Tabs defaultValue="editor" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="editor">Soạn thảo</TabsTrigger>
                              <TabsTrigger value="preview">
                                <Eye className="h-4 w-4 mr-2" />
                                Xem trước
                              </TabsTrigger>
                            </TabsList>
                            <TabsContent value="editor" className="mt-4">
                              <FormControl>
                                <RichTextEditor
                                  value={field.value}
                                  onChange={field.onChange}
                                  placeholder="Viết nội dung bài viết tại đây... Hỗ trợ Markdown, ảnh và video"
                                />
                              </FormControl>
                            </TabsContent>
                            <TabsContent value="preview" className="mt-4">
                              <Card>
                                <CardContent className="pt-6">
                                  {field.value ? (
                                    <ContentPreview content={field.value} />
                                  ) : (
                                    <p className="text-muted-foreground text-center py-8">
                                      Chưa có nội dung để xem trước
                                    </p>
                                  )}
                                </CardContent>
                              </Card>
                            </TabsContent>
                          </Tabs>
                          <FormMessage />
                          <FormDescription>
                            Hỗ trợ Markdown và HTML. Bạn có thể chèn ảnh, video
                            YouTube/Vimeo vào bài viết.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PostEditorPage;
