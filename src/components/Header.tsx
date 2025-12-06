import { Button } from "@/components/ui/button";
import { Car, Phone, Mail, Menu, User, LogOut, Settings } from "lucide-react";
import { Cart } from "@/features/cart/components/Cart";
import { useAuth } from "@/context/auth-context";
import { isAdmin } from "@/features/auth/hooks/useAuth";
import { AuthService } from "@/features/auth/api/auth";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Still logout locally even if API call fails
      logout();
      navigate("/");
    }
  };

  const getUserInitials = (user: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.username) {
      return user.username[0].toUpperCase();
    }
    return "U";
  };

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
            <a
              href="/"
              className="text-foreground hover:text-primary transition-colors"
            >
              Trang Chủ
            </a>
            <a
              href="/products"
              className="text-foreground hover:text-primary transition-colors"
            >
              Sản Phẩm
            </a>
            <a
              href="/order"
              className="text-foreground hover:text-primary transition-colors"
            >
              Đặt Hàng
            </a>
            <a
              href="#services"
              className="text-foreground hover:text-primary transition-colors"
            >
              Dịch Vụ
            </a>
            <a
              href="#gallery"
              className="text-foreground hover:text-primary transition-colors"
            >
              Thư Viện
            </a>
            <a
              href="/blog"
              className="text-foreground hover:text-primary transition-colors"
            >
              Blog
            </a>
            <a
              href="#contact"
              className="text-foreground hover:text-primary transition-colors"
            >
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
            </div>

            {/* User Authentication */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt={user?.username || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getUserInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.firstName && user?.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user?.username}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || user?.username}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        Role: {user?.role?.name || "User"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin(user) && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Quản trị</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <a
                href="/auth"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                title="Đăng nhập / Đăng ký"
              >
                <User className="h-5 w-5 text-primary" />
              </a>
            )}

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
