import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  LogOut,
  Car
} from "lucide-react";
import seatsImg from "@/assets/seats.jpg";
import steeringImg from "@/assets/steering-wheel.jpg";
import dashboardImg from "@/assets/dashboard.jpg";
import { useToast } from "@/hooks/use-toast";


const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const { toast } = useToast();

  // Mock data
  const orders = [
    {
      id: "ORD001",
      customer: "Nguyễn Văn A",
      phone: "0901234567",
      service: "Bọc ghế da",
      car: "Toyota Camry 2022",
      status: "pending",
      date: "2024-01-15",
      total: "15,000,000 VND"
    },
    {
      id: "ORD002",
      customer: "Trần Thị B",
      phone: "0912345678",
      service: "Độ nội thất",
      car: "Honda CR-V 2023",
      status: "processing",
      date: "2024-01-14",
      total: "25,000,000 VND"
    },
    {
      id: "ORD003",
      customer: "Lê Văn C",
      phone: "0923456789",
      service: "Thay thảm sàn",
      car: "Mazda 3 2021",
      status: "completed",
      date: "2024-01-13",
      total: "8,000,000 VND"
    }
  ];

  const posts = [
    {
      id: "POST001",
      title: "Xu hướng nội thất ô tô 2024",
      author: "Admin",
      status: "published",
      date: "2024-01-15",
      views: 1250
    },
    {
      id: "POST002",
      title: "Hướng dẫn bảo dưỡng ghế da ô tô",
      author: "Admin",
      status: "draft",
      date: "2024-01-14",
      views: 0
    },
    {
      id: "POST003",
      title: "Lựa chọn chất liệu bọc ghế phù hợp",
      author: "Admin",
      status: "published",
      date: "2024-01-12",
      views: 980
    }
  ];

  // Products data (UI demo)
  const productCategories = ["Bọc ghế da", "Thảm sàn", "Ốp taplo", "Bọc vô lăng"];
  const productsDemo = [
    { id: "SP001", name: "Bọc ghế da Nappa", category: "Bọc ghế da", price: 15000000, stock: 8, status: "active", image: seatsImg },
    { id: "SP002", name: "Thảm sàn 5D cao cấp", category: "Thảm sàn", price: 3500000, stock: 20, status: "active", image: dashboardImg },
    { id: "SP003", name: "Bọc vô lăng da", category: "Bọc vô lăng", price: 800000, stock: 50, status: "inactive", image: steeringImg }
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
    { month: "T12", revenue: 180000000, orders: 40 }
  ];

  const serviceData = [
    { name: "Bọc ghế da", value: 45, color: "#8884d8" },
    { name: "Độ nội thất", value: 30, color: "#82ca9d" },
    { name: "Thay thảm sàn", value: 15, color: "#ffc658" },
    { name: "Khác", value: 10, color: "#ff7c7c" }
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
    { month: "T12", new: 28, returning: 12 }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Chờ xử lý</Badge>;
      case "processing":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Đang xử lý</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Hoàn thành</Badge>;
      case "published":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Đã xuất bản</Badge>;
      case "draft":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Bản nháp</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Car className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">AutoLux Admin</h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background border shadow-md">
              <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                Xem trang web
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="h-4 w-4 mr-2" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124</div>
              <p className="text-xs text-muted-foreground">+12% từ tháng trước</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.2B VND</div>
              <p className="text-xs text-muted-foreground">+8% từ tháng trước</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">+15% từ tháng trước</p>
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

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="analytics">Thống kê</TabsTrigger>
            <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
            <TabsTrigger value="products">Sản phẩm</TabsTrigger>
            <TabsTrigger value="posts">Bài viết</TabsTrigger>
            <TabsTrigger value="customers">Khách hàng</TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Thống kê & Báo cáo</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Doanh thu theo tháng</CardTitle>
                  <CardDescription>Theo dõi xu hướng doanh thu và số đơn hàng</CardDescription>
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
                            name === 'revenue' ? `${(value / 1000000).toFixed(0)}M VND` : value,
                            name === 'revenue' ? 'Doanh thu' : 'Số đơn hàng'
                          ]}
                        />
                        <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                        <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Service Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Phân bố dịch vụ</CardTitle>
                  <CardDescription>Tỷ lệ các dịch vụ được sử dụng</CardDescription>
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
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
                  <CardDescription>Phân tích khách hàng theo tháng</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={customerData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="new" stackId="a" fill="#8884d8" name="Khách hàng mới" />
                        <Bar dataKey="returning" stackId="a" fill="#82ca9d" name="Khách hàng quay lại" />
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
                  <CardTitle className="text-sm font-medium">Tỷ lệ chuyển đổi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68%</div>
                  <p className="text-xs text-muted-foreground">+5% từ tháng trước</p>
                  <div className="mt-2 h-2 bg-muted rounded-full">
                    <div className="h-2 bg-primary rounded-full" style={{ width: "68%" }}></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Giá trị đơn hàng TB</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">16.2M VND</div>
                  <p className="text-xs text-muted-foreground">+2.1M từ tháng trước</p>
                  <div className="mt-2 h-2 bg-muted rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Thời gian hoàn thành TB</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.2 ngày</div>
                  <p className="text-xs text-muted-foreground">-0.5 ngày từ tháng trước</p>
                  <div className="mt-2 h-2 bg-muted rounded-full">
                    <div className="h-2 bg-blue-500 rounded-full" style={{ width: "82%" }}></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Quản lý đơn hàng</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tạo đơn hàng
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Danh sách đơn hàng</CardTitle>
                <CardDescription>Quản lý tất cả đơn hàng của khách hàng</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã đơn</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Dịch vụ</TableHead>
                      <TableHead>Xe</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Tổng tiền</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.customer}</div>
                            <div className="text-sm text-muted-foreground">{order.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>{order.service}</TableCell>
                        <TableCell>{order.car}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="font-medium">{order.total}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-background border shadow-md">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                Xem chi tiết
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Quản lý sản phẩm</h2>
              <Button onClick={() => setProductDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm sản phẩm
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Danh sách sản phẩm</CardTitle>
                <CardDescription>Quản lý sản phẩm dịch vụ nội thất ô tô</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead>Giá</TableHead>
                      <TableHead>Tồn kho</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productsDemo.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img src={p.image} alt={`Sản phẩm ${p.name}`} loading="lazy" className="h-12 w-12 rounded-md object-cover" />
                            <div>
                              <div className="font-medium">{p.name}</div>
                              <div className="text-sm text-muted-foreground">{p.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{p.category}</TableCell>
                        <TableCell className="font-medium">{p.price.toLocaleString()} VND</TableCell>
                        <TableCell>{p.stock}</TableCell>
                        <TableCell>
                          {p.status === "active" ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Đang bán</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Ngừng bán</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-background border shadow-md">
                              <DropdownMenuItem onClick={() => toast({ title: "Xem sản phẩm", description: "Chế độ demo - chỉ giao diện" })}>
                                <Eye className="h-4 w-4 mr-2" />
                                Xem chi tiết
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast({ title: "Chỉnh sửa", description: "Chế độ demo - chỉ giao diện" })}>
                                <Edit className="h-4 w-4 mr-2" />
                                Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => toast({ title: "Xóa sản phẩm", description: "Chế độ demo - chưa xóa dữ liệu" })}>
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
              </CardContent>
            </Card>

            <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Thêm sản phẩm</DialogTitle>
                  <DialogDescription>Tạo sản phẩm mới (UI demo, chưa lưu dữ liệu)</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">Tên sản phẩm</label>
                    <Input placeholder="Nhập tên sản phẩm" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Danh mục</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        {productCategories.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Giá (VND)</label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tồn kho</label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Hình ảnh (URL)</label>
                    <Input type="url" placeholder="https://..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">Mô tả</label>
                    <Textarea placeholder="Mô tả chi tiết..." className="min-h-[120px]" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setProductDialogOpen(false)}>Hủy</Button>
                  <Button onClick={() => { toast({ title: "Đã lưu (demo)", description: "Chỉ giao diện, chưa lưu thực tế" }); setProductDialogOpen(false); }}>Lưu sản phẩm</Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Quản lý bài viết</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo bài viết
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Tạo bài viết mới</DialogTitle>
                    <DialogDescription>
                      Thêm bài viết mới cho blog của AutoLux Interior
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Tiêu đề</label>
                      <Input placeholder="Nhập tiêu đề bài viết" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Trạng thái</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Bản nháp</SelectItem>
                          <SelectItem value="published">Xuất bản</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Nội dung</label>
                      <Textarea 
                        placeholder="Nhập nội dung bài viết..." 
                        className="min-h-[200px]"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Hủy</Button>
                      <Button>Lưu bài viết</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Danh sách bài viết</CardTitle>
                <CardDescription>Quản lý tất cả bài viết trên blog</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tiêu đề</TableHead>
                      <TableHead>Tác giả</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Lượt xem</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>{post.author}</TableCell>
                        <TableCell>{getStatusBadge(post.status)}</TableCell>
                        <TableCell>{post.views.toLocaleString()}</TableCell>
                        <TableCell>{post.date}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-background border shadow-md">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                Xem bài viết
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Quản lý khách hàng</h2>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Danh sách khách hàng</CardTitle>
                <CardDescription>Thông tin tất cả khách hàng đã sử dụng dịch vụ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Chức năng quản lý khách hàng đang được phát triển</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;