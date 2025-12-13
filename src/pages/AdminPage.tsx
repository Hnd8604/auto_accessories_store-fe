import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { AuthService } from "@/features/auth/api/auth";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ShoppingCart,
  FileText,
  Users,
  BarChart3,
  LogOut,
  Car,
  Eye,
} from "lucide-react";
import ProductManagement from "@/features/products/components/ProductManagement";
import { CategoryManagement } from "@/features/categories/components/CategoryManagement";
import { BrandManagement } from "@/features/brands/components/BrandManagement";
import { UserManagement } from "@/features/users/components/UserManagement";
import { PostManagement, PostCategoryManagement } from "@/features/posts/components";
import { OrderManagement } from "@/features/orders/components";
import { CategoriesApi } from "@/features/categories/api/categories";
import { BrandsApi } from "@/features/brands/api/brands";
import { PostCategoriesApi } from "@/features/posts/api";
import { useToast } from "@/hooks/use-toast";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();

  const handleViewWebsite = () => {
    navigate("/");
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      logout();
      // Invalidate sessionCart to refetch after logout
      queryClient.invalidateQueries({ queryKey: ["sessionCart"] });
      navigate("/");
      toast({
        title: "Đăng xuất thành công",
        description: "Bạn đã đăng xuất khỏi tài khoản admin.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Still logout locally even if API call fails
      logout();
      queryClient.invalidateQueries({ queryKey: ["sessionCart"] });
      navigate("/");
    }
  };

  const getUserDisplayName = () => {
    if (user?.fullName) {
      return user.fullName;
    }
    return user?.username || "Admin";
  };

  // Fetch categories and brands for ProductManagement
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: CategoriesApi.getAll,
  });

  const { data: brandsData } = useQuery({
    queryKey: ["brands"],
    queryFn: BrandsApi.getAll,
  });

  const { data: postCategoriesData } = useQuery({
    queryKey: ["postCategories"],
    queryFn: PostCategoriesApi.getAll,
  });

  const categoryOptions =
    categoriesData?.result?.map((cat) => ({
      id: Number.parseInt(cat.id),
      name: cat.name,
    })) || [];

  const brandOptions =
    brandsData?.result?.map((brand) => ({
      id: brand.id,
      name: brand.name,
    })) || [];

  const postCategoryOptions =
    postCategoriesData?.result?.map((cat) => ({
      id: cat.id,
      name: cat.name,
    })) || [];

  // Mock data for other sections
  const orders = [
    {
      id: "ORD001",
      customer: "Nguyễn Văn A",
      phone: "0901234567",
      service: "Bọc ghế da",
      car: "Toyota Camry 2022",
      status: "pending",
      date: "2024-01-15",
      total: "15,000,000 VND",
    },
    {
      id: "ORD002",
      customer: "Trần Thị B",
      phone: "0912345678",
      service: "Độ nội thất",
      car: "Honda CR-V 2023",
      status: "processing",
      date: "2024-01-14",
      total: "25,000,000 VND",
    },
    {
      id: "ORD003",
      customer: "Lê Văn C",
      phone: "0923456789",
      service: "Thay thảm sàn",
      car: "Mazda 3 2021",
      status: "completed",
      date: "2024-01-13",
      total: "8,000,000 VND",
    },
  ];

  const posts = [
    {
      id: "POST001",
      title: "Xu hướng nội thất ô tô 2024",
      author: "Admin",
      status: "published",
      date: "2024-01-15",
      views: 1250,
    },
    {
      id: "POST002",
      title: "Hướng dẫn bảo dưỡng ghế da ô tô",
      author: "Admin",
      status: "draft",
      date: "2024-01-14",
      views: 0,
    },
    {
      id: "POST003",
      title: "Lựa chọn chất liệu bọc ghế phù hợp",
      author: "Admin",
      status: "published",
      date: "2024-01-12",
      views: 980,
    },
  ];

  // Analytics data
  const revenueData = [
    { month: "T1", revenue: 85000000, orders: 12 },
    { month: "T2", revenue: 92000000, orders: 15 },
    { month: "T3", revenue: 78000000, orders: 10 },
    { month: "T4", revenue: 105000000, orders: 18 },
    { month: "T5", revenue: 120000000, orders: 22 },
    { month: "T6", revenue: 98000000, orders: 16 },
    { month: "T7", revenue: 115000000, orders: 20 },
    { month: "T8", revenue: 130000000, orders: 25 },
    { month: "T9", revenue: 142000000, orders: 28 },
    { month: "T10", revenue: 158000000, orders: 32 },
    { month: "T11", revenue: 165000000, orders: 35 },
    { month: "T12", revenue: 180000000, orders: 40 },
  ];

  const serviceData = [
    { name: "Bọc ghế da", value: 45, color: "#8884d8" },
    { name: "Độ nội thất", value: 30, color: "#82ca9d" },
    { name: "Thay thảm sàn", value: 15, color: "#ffc658" },
    { name: "Khác", value: 10, color: "#ff7c7c" },
  ];

  const customerData = [
    { month: "T1", new: 8, returning: 4 },
    { month: "T2", new: 12, returning: 3 },
    { month: "T3", new: 6, returning: 4 },
    { month: "T4", new: 14, returning: 4 },
    { month: "T5", new: 16, returning: 6 },
    { month: "T6", new: 10, returning: 6 },
    { month: "T7", new: 15, returning: 5 },
    { month: "T8", new: 18, returning: 7 },
    { month: "T9", new: 20, returning: 8 },
    { month: "T10", new: 22, returning: 10 },
    { month: "T11", new: 25, returning: 10 },
    { month: "T12", new: 28, returning: 12 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Chờ xử lý
          </Badge>
        );
      case "processing":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Đang xử lý
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Hoàn thành
          </Badge>
        );
      case "published":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Đã xuất bản
          </Badge>
        );
      case "draft":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200"
          >
            Bản nháp
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-lg font-bold">AutoLux</h1>
              <p className="text-xs text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Button
            variant={activeTab === "analytics" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("analytics")}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Thống kê
          </Button>
          <Button
            variant={activeTab === "orders" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Đơn hàng
          </Button>
          <Button
            variant={activeTab === "products" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("products")}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Sản phẩm
          </Button>
          <Button
            variant={activeTab === "categories" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("categories")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Danh mục sản phẩm
          </Button>
          <Button
            variant={activeTab === "brands" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("brands")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Thương hiệu
          </Button>
          <Button
            variant={activeTab === "posts" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("posts")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Bài viết
          </Button>
          <Button
            variant={activeTab === "post-categories" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("post-categories")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Danh mục bài viết
          </Button>
          <Button
            variant={activeTab === "users" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("users")}
          >
            <Users className="mr-2 h-4 w-4" />
            Người dùng
          </Button>
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full justify-start mb-2"
            onClick={handleViewWebsite}
          >
            <Eye className="mr-2 h-4 w-4" />
            Xem trang web
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                <span className="truncate">{getUserDisplayName()}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {getUserDisplayName()}
                  </p>
                  {user?.email && (
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  )}
                  <p className="text-xs leading-none text-muted-foreground">
                    Role: {user?.roles?.[0]?.name || "Admin"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden border-b bg-white">
          <div className="px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Car className="h-6 w-6 text-primary" />
              <h1 className="text-lg font-bold">AutoLux Admin</h1>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Users className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{getUserDisplayName()}</p>
                    {user?.email && (
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleViewWebsite}>
                  <Eye className="mr-2 h-4 w-4" />
                  Xem trang web
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
        {/* Stats Cards - Only show on analytics tab */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng đơn hàng
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124</div>
              <p className="text-xs text-muted-foreground">
                +12% từ tháng trước
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.2B VND</div>
              <p className="text-xs text-muted-foreground">
                +8% từ tháng trước
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">
                +15% từ tháng trước
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bài viết</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">+3 bài mới</p>
            </CardContent>
          </Card>
        </div>
        )}

          {/* Analytics Tab Charts */}
          {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Thống kê & Báo cáo</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Doanh thu theo tháng</CardTitle>
                  <CardDescription>
                    Theo dõi xu hướng doanh thu và số đơn hàng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip
                          formatter={(value: any, name: string) => [
                            name === "revenue"
                              ? `${(value / 1000000).toFixed(0)}M VND`
                              : value,
                            name === "revenue" ? "Doanh thu" : "Số đơn hàng",
                          ]}
                        />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="revenue"
                          stroke="#8884d8"
                          strokeWidth={2}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="orders"
                          stroke="#82ca9d"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Service Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Phân bố dịch vụ</CardTitle>
                  <CardDescription>
                    Tỷ lệ các dịch vụ được sử dụng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={serviceData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {serviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle>Khách hàng mới vs Quay lại</CardTitle>
                  <CardDescription>
                    Phân tích khách hàng theo tháng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={customerData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                          dataKey="new"
                          stackId="a"
                          fill="#8884d8"
                          name="Khách hàng mới"
                        />
                        <Bar
                          dataKey="returning"
                          stackId="a"
                          fill="#82ca9d"
                          name="Khách hàng quay lại"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Tỷ lệ chuyển đổi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68%</div>
                  <p className="text-xs text-muted-foreground">
                    +5% từ tháng trước
                  </p>
                  <div className="mt-2 h-2 bg-muted rounded-full">
                    <div
                      className="h-2 bg-primary rounded-full"
                      style={{ width: "68%" }}
                    ></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Giá trị đơn hàng TB
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">16.2M VND</div>
                  <p className="text-xs text-muted-foreground">
                    +2.1M từ tháng trước
                  </p>
                  <div className="mt-2 h-2 bg-muted rounded-full">
                    <div
                      className="h-2 bg-green-500 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Thời gian hoàn thành TB
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.2 ngày</div>
                  <p className="text-xs text-muted-foreground">
                    -0.5 ngày từ tháng trước
                  </p>
                  <div className="mt-2 h-2 bg-muted rounded-full">
                    <div
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: "82%" }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <OrderManagement />
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <ProductManagement
              categoryOptions={categoryOptions}
              brandOptions={brandOptions}
            />
          )}

          {/* Categories Tab */}
          {activeTab === "categories" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Quản lý Danh mục sản phẩm</h2>
              <CategoryManagement />
            </div>
          )}

          {/* Brands Tab */}
          {activeTab === "brands" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Quản lý Thương hiệu</h2>
              <BrandManagement />
            </div>
          )}

          {/* Posts Tab */}
          {activeTab === "posts" && (
            <PostManagement />
          )}

          {/* Post Categories Tab */}
          {activeTab === "post-categories" && (
            <PostCategoryManagement />
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <UserManagement />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
