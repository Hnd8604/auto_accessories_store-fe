import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Zap, Shield, Settings, Sparkles, Award } from "lucide-react";

const services = [
  {
    icon: Palette,
    title: "Bọc Ghế Da Cao Cấp",
    description: "Bọc ghế bằng da thật imported từ Châu Âu, với đa dạng màu sắc và họa tiết theo yêu cầu",
    features: ["Da Nappa Premium", "Đường chỉ may tinh xảo", "Bảo hành 3 năm"],
    price: "Từ 15.000.000 VNĐ"
  },
  {
    icon: Zap,
    title: "Độ Taplo Carbon Fiber",
    description: "Ốp taplo carbon fiber thật, mang lại vẻ đẹp thể thao và hiện đại cho xe",
    features: ["Carbon fiber thật 100%", "Thiết kế 3D độc quyền", "Chống trầy xước"],
    price: "Từ 8.000.000 VNĐ"
  },
  {
    icon: Shield,
    title: "Phủ Nano Nội Thất",
    description: "Bảo vệ nội thất khỏi bụi bẩn, nước và tia UV với công nghệ nano tiên tiến",
    features: ["Công nghệ nano Nhật Bản", "Chống nước hiệu quả", "Bảo vệ màu sắc"],
    price: "Từ 3.000.000 VNĐ"
  },
  {
    icon: Settings,
    title: "Lắp Đặt Đèn LED Ambient",
    description: "Hệ thống đèn LED ambient tạo không gian sang trọng và ấm cúng",
    features: ["64 màu RGB", "Điều khiển qua app", "Tiết kiệm điện năng"],
    price: "Từ 5.000.000 VNĐ"
  },
  {
    icon: Sparkles,
    title: "Độ Vô Lăng Thể Thao",
    description: "Độ vô lăng với chất liệu da cao cấp, carbon fiber và thiết kế ergonomic",
    features: ["Da Alcantara premium", "Tích hợp nút bấm", "Thiết kế đua xe F1"],
    price: "Từ 12.000.000 VNĐ"
  },
  {
    icon: Award,
    title: "Gói VIP Toàn Diện",
    description: "Gói dịch vụ cao cấp nhất bao gồm tất cả các hạng mục nâng cấp nội thất",
    features: ["Thiết kế riêng biệt", "Chất liệu cao cấp nhất", "Bảo hành trọn đời"],
    price: "Từ 50.000.000 VNĐ"
  }
];

export const Services = () => {
  return (
    <section id="services" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Dịch Vụ 
            <span className="bg-gradient-accent bg-clip-text text-transparent"> Chuyên Nghiệp</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Chúng tôi cung cấp đầy đủ các dịch vụ nội thất ô tô từ cơ bản đến cao cấp, 
            đáp ứng mọi nhu cầu của khách hàng với chất lượng tốt nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-card hover:-translate-y-2">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Giá từ</div>
                    <div className="font-bold text-primary">{service.price}</div>
                  </div>
                </div>
                <CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Tư Vấn Chi Tiết
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="luxury" size="xl">
            Xem Tất Cả Dịch Vụ
          </Button>
        </div>
      </div>
    </section>
  );
};