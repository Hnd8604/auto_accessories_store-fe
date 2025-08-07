import { Button } from "@/components/ui/button";
import { Car, Phone, Mail, Menu, User } from "lucide-react";
import { Cart } from "@/components/Cart";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              AutoLux Interior
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-foreground hover:text-primary transition-colors">
              Trang Chủ
            </a>
            <a href="/products" className="text-foreground hover:text-primary transition-colors">
              Sản Phẩm
            </a>
            <a href="/order" className="text-foreground hover:text-primary transition-colors">
              Đặt Hàng
            </a>
            <a href="#services" className="text-foreground hover:text-primary transition-colors">
              Dịch Vụ
            </a>
            <a href="#gallery" className="text-foreground hover:text-primary transition-colors">
              Thư Viện
            </a>
            <a href="/blog" className="text-foreground hover:text-primary transition-colors">
              Blog
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">
              Liên Hệ
            </a>
          </nav>

          {/* Contact Buttons */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">0123 456 789</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">info@autolux.vn</span>
              </div>
            </div>
            <a 
              href="/auth" 
              className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
              title="Đăng nhập / Đăng ký"
            >
              <User className="h-5 w-5 text-primary" />
            </a>
            <Cart />
            <Button variant="luxury" size="sm">
              Tư Vấn Miễn Phí
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};