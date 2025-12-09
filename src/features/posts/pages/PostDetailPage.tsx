import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { PostsApi } from "@/features/posts/api";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Calendar, Eye, User } from "lucide-react";

export const PostDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => PostsApi.getBySlug(slug!),
    enabled: !!slug,
  });

  const post = data?.result;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Không tìm thấy bài viết</h1>
            <Button onClick={() => navigate("/blog")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại blog
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <article className="container mx-auto px-4 py-12 max-w-4xl">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/blog")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại blog
          </Button>

          {post.thumbnailUrl && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={post.thumbnailUrl}
                alt={post.title}
                className="w-full h-[400px] object-cover"
              />
            </div>
          )}

          <div className="mb-6">
            {post.categoryName && (
              <Badge className="mb-4">{post.categoryName}</Badge>
            )}
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {post.authorName && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{post.authorName}</span>
                </div>
              )}
              {post.createdAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{post.viewCount || 0} lượt xem</span>
              </div>
            </div>
          </div>

          {post.shortDescription && (
            <div className="mb-8 p-4 bg-muted rounded-lg">
              <p className="text-lg text-muted-foreground italic">
                {post.shortDescription}
              </p>
            </div>
          )}

          <div
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
      <Footer />
    </div>
  );
};
