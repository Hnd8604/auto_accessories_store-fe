import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import dashboardImage from "@/assets/dashboard.jpg";
import seatsImage from "@/assets/seats.jpg";
import steeringWheelImage from "@/assets/steering-wheel.jpg";
import heroImage from "@/assets/hero-interior.jpg";

const galleryItems = [
  {
    id: 1,
    image: heroImage,
    title: "Nội thất Mercedes S-Class",
    category: "Sedan Hạng Sang",
    description: "Bọc ghế da Nappa đỏ, ốp carbon fiber toàn bộ taplo"
  },
  {
    id: 2,
    image: dashboardImage,
    title: "Taplo BMW M3",
    category: "Xe Thể Thao",
    description: "Độ taplo carbon fiber, đèn LED ambient xanh"
  },
  {
    id: 3,
    image: seatsImage,
    title: "Ghế Audi RS6",
    category: "SUV Cao Cấp",
    description: "Ghế da đỏ với đường chỉ kim cương"
  },
  {
    id: 4,
    image: steeringWheelImage,
    title: "Vô lăng Porsche 911",
    category: "Xe Thể Thao",
    description: "Vô lăng da Alcantara với carbon fiber"
  },
  {
    id: 5,
    image: dashboardImage,
    title: "Nội thất Range Rover",
    category: "SUV Cao Cấp",
    description: "Bọc da toàn bộ với gỗ thật walnut"
  },
  {
    id: 6,
    image: seatsImage,
    title: "Ghế Lexus LX570",
    category: "SUV Cao Cấp",
    description: "Ghế massage với chất liệu da cao cấp"
  }
];

const categories = ["Tất Cả", "Sedan Hạng Sang", "Xe Thể Thao", "SUV Cao Cấp"];

export const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("Tất Cả");
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const filteredItems = activeCategory === "Tất Cả" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <section id="gallery" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Thư Viện 
            <span className="bg-gradient-accent bg-clip-text text-transparent"> Tác Phẩm</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Khám phá những dự án nội thất ô tô đẳng cấp mà chúng tôi đã thực hiện, 
            từ xe sedan hạng sang đến SUV cao cấp.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
                className="transition-all duration-300"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-card rounded-lg overflow-hidden shadow-card hover:shadow-luxury transition-all duration-500 hover:-translate-y-2"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Category Badge */}
                <Badge 
                  variant="secondary" 
                  className="absolute top-4 left-4 bg-primary/20 text-primary border-primary/30 backdrop-blur-sm"
                >
                  {item.category}
                </Badge>

                {/* Hover Content */}
                <div className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${
                  hoveredItem === item.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                <Button variant="outline" size="sm" className="w-full">
                  Xem Chi Tiết
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="luxury" size="xl">
            Xem Thêm Tác Phẩm
          </Button>
        </div>
      </div>
    </section>
  );
};