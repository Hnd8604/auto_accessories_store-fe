import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Award, Users } from "lucide-react";
import heroImage from "@/assets/hero-interior.jpg";

export const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero">
        <img 
          src={heroImage} 
          alt="Luxury Car Interior" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-deep-black/90 via-deep-black/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm font-medium backdrop-blur-sm">
              ✨ Chuyên Gia Nội Thất Ô Tô Hàng Đầu Việt Nam
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            Nâng Tầm 
            <span className="bg-gradient-accent bg-clip-text text-transparent"> Đẳng Cấp</span>
            <br />
            Nội Thất Xe Hơi
          </h1>
          
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl">
            Chúng tôi chuyên thiết kế và độ nội thất ô tô cao cấp với chất liệu da thật, 
            carbon fiber và công nghệ hiện đại. Mang đến trải nghiệm lái xe sang trọng và đẳng cấp.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button variant="hero" size="xl" className="group">
              Khám Phá Dịch Vụ
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="premium" size="xl">
              Xem Thư Viện Ảnh
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 p-6 bg-card/30 backdrop-blur-sm rounded-lg border border-border/50">
              <div className="p-3 bg-primary/20 rounded-lg">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-foreground">5+</div>
                <div className="text-sm text-primary-foreground/70">Năm Kinh Nghiệm</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-6 bg-card/30 backdrop-blur-sm rounded-lg border border-border/50">
              <div className="p-3 bg-primary/20 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-foreground">500+</div>
                <div className="text-sm text-primary-foreground/70">Khách Hàng Hài Lòng</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-6 bg-card/30 backdrop-blur-sm rounded-lg border border-border/50">
              <div className="p-3 bg-primary/20 rounded-lg">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-foreground">4.9/5</div>
                <div className="text-sm text-primary-foreground/70">Đánh Giá Chất Lượng</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};