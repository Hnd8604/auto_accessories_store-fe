import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight, Tag } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: number;
  tags: string[];
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "5 Lý Do Nên Bọc Ghế Da Cho Xe Ô Tô",
    excerpt: "Khám phá những lợi ích tuyệt vời khi bọc ghế da cho xe của bạn và tại sao đây là khoản đầu tư đáng giá.",
    content: "Bọc ghế da không chỉ mang lại vẻ đẹp sang trọng mà còn có nhiều lợi ích khác...",
    author: "Nguyễn Văn A",
    date: "2024-01-15",
    category: "Hướng Dẫn",
    image: "/api/placeholder/600/400",
    readTime: 5,
    tags: ["ghế da", "nội thất", "hướng dẫn"]
  },
  {
    id: 2,
    title: "Xu Hướng Nội Thất Ô Tô 2024",
    excerpt: "Cập nhật những xu hướng thiết kế nội thất ô tô mới nhất trong năm 2024 từ các thương hiệu hàng đầu.",
    content: "Năm 2024 đánh dấu sự bùng nổ của công nghệ trong thiết kế nội thất ô tô...",
    author: "Trần Thị B",
    date: "2024-01-10",
    category: "Xu Hướng",
    image: "/api/placeholder/600/400",
    readTime: 7,
    tags: ["xu hướng", "2024", "thiết kế"]
  },
  {
    id: 3,
    title: "Cách Chăm Sóc Nội Thất Da Ô Tô",
    excerpt: "Hướng dẫn chi tiết cách bảo dưỡng và chăm sóc nội thất da ô tô để luôn như mới.",
    content: "Nội thất da cần được chăm sóc đúng cách để duy trì độ bền và vẻ đẹp...",
    author: "Lê Văn C",
    date: "2024-01-05",
    category: "Bảo Dưỡng",
    image: "/api/placeholder/600/400",
    readTime: 6,
    tags: ["bảo dưỡng", "da", "chăm sóc"]
  },
  {
    id: 4,
    title: "So Sánh Carbon Fiber Thật Và Giả",
    excerpt: "Phân biệt carbon fiber thật và giả để đưa ra lựa chọn đúng đắn cho xe của bạn.",
    content: "Carbon fiber đã trở thành xu hướng phổ biến trong độ xe...",
    author: "Phạm Văn D",
    date: "2024-01-01",
    category: "Kiến Thức",
    image: "/api/placeholder/600/400",
    readTime: 8,
    tags: ["carbon fiber", "so sánh", "kiến thức"]
  }
];

const categories = ["Tất Cả", "Hướng Dẫn", "Xu Hướng", "Bảo Dưỡng", "Kiến Thức", "Tin Tức"];

export const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tất Cả");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const filteredPosts = selectedCategory === "Tất Cả" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (selectedPost) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedPost(null)}
              className="mb-8"
            >
              ← Quay lại Blog
            </Button>
            
            <article className="bg-card rounded-lg overflow-hidden shadow-card">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-96 object-cover"
              />
              
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Badge variant="secondary">{selectedPost.category}</Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(selectedPost.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{selectedPost.author}</span>
                  </div>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  {selectedPost.title}
                </h1>
                
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  <p className="text-xl mb-6">{selectedPost.excerpt}</p>
                  <p>{selectedPost.content}</p>
                </div>
                
                <div className="flex gap-2 mt-8">
                  {selectedPost.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Blog & 
            <span className="bg-gradient-accent bg-clip-text text-transparent"> Tin Tức</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Cập nhật những thông tin mới nhất về xu hướng nội thất ô tô, 
            hướng dẫn bảo dưỡng và kiến thức chuyên môn từ đội ngũ chuyên gia.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4">
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

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Card 
              key={post.id} 
              className="group bg-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-card hover:-translate-y-2 cursor-pointer overflow-hidden"
              onClick={() => setSelectedPost(post)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <Badge 
                  variant="secondary" 
                  className="absolute top-4 left-4 bg-primary/20 text-primary border-primary/30 backdrop-blur-sm"
                >
                  {post.category}
                </Badge>
              </div>

              <CardHeader className="pb-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                </div>
                <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{post.readTime} phút đọc</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="luxury" size="xl">
            Xem Tất Cả Bài Viết
          </Button>
        </div>
      </div>
    </section>
  );
};