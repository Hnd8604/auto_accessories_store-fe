import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Phone, Mail, Menu, User, LogOut, Settings, ShoppingCart, KeyRound } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { isAdmin } from "@/features/auth/hooks/useAuth";
import { AuthService } from "@/features/auth/api/auth";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchBar } from "@/components/SearchBar";
import { ChangePasswordDialog } from "@/features/auth/components/ChangePasswordDialog";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";

import { memo, useCallback, useState, useEffect } from "react";

const CartButton = memo(() => {
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate("/cart");
  }, [navigate]);

  return (
    <Button
      variant="outline"
      size="sm"
      className="relative"
      onClick={handleClick}
    >
      <ShoppingCart className="h-4 w-4" />
      {itemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {itemCount}
        </Badge>
      )}
      <span className="ml-2 hidden sm:inline">Giỏ Hàng</span>
    </Button>
  );
});

CartButton.displayName = "CartButton";

export const Header = memo(() => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [openChangePassword, setOpenChangePassword] = useState(false);

  // Handle scroll to show/hide header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show header when at top
      if (currentScrollY < 10) {
        setIsVisible(true);
      }
      // Hide header when scrolling down
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      // Show header when scrolling up
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = useCallback(async () => {
    try {
      await AuthService.logout();
      logout();
      // Invalidate sessionCart to refetch after logout
      queryClient.invalidateQueries({ queryKey: ["sessionCart"] });
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Still logout locally even if API call fails
      logout();
      queryClient.invalidateQueries({ queryKey: ["sessionCart"] });
      navigate("/");
    }
  }, [logout, queryClient, navigate]);

  const getUserInitials = useCallback((user: any) => {
    if (user?.fullName) {
      const names = user.fullName.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return user.fullName[0].toUpperCase();
    }
    if (user?.username) {
      return user.username[0].toUpperCase();
    }
    return "U";
  }, []);

  const getHighestRole = useCallback((user: any) => {
    if (!user?.roles || user.roles.length === 0) {
      return "USER";
    }

    // Check if user has ADMIN role
    const hasAdmin = user.roles.some((role: any) =>
      role.name?.toUpperCase() === "ADMIN"
    );

    if (hasAdmin) {
      return "ADMIN";
    }

    // Otherwise return first role name in uppercase
    return user.roles[0]?.name?.toUpperCase() || "USER";
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}>
        <div className="container mx-auto px-4">
          {/* Row 1: Logo, Search, User Actions */}
          <div className="flex items-center justify-between gap-4 py-3 border-b border-border/50">
            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Car className="h-8 w-8 text-primary" />
              <span className="text-xl md:text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent whitespace-nowrap">
                AutoLux Interior
              </span>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
              <SearchBar />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
              {/* Phone */}
              <a
                href="tel:0123456789"
                className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>0123 456 789</span>
              </a>

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
                          {user?.fullName || user?.username}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email || user?.username}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          Role: {getHighestRole(user)}
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
                    <DropdownMenuItem onClick={() => setOpenChangePassword(true)}>
                      <KeyRound className="mr-2 h-4 w-4" />
                      <span>Đổi mật khẩu</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
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

              {/* Notification Bell - chỉ hiện khi đăng nhập */}
              {isAuthenticated && <NotificationBell />}

              <CartButton />
              <Button variant="luxury" size="sm" className="hidden lg:inline-flex">
                Tư Vấn Miễn Phí
              </Button>
            </div>
          </div>

          {/* Row 2: Navigation Menu */}
          <div className="py-3">
            <nav className="hidden md:flex items-center justify-center gap-8">
              <a
                href="/"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Trang Chủ
              </a>
              <a
                href="/products"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Sản Phẩm
              </a>
              <a
                href="/order"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Đặt Hàng
              </a>
              <a
                href="#services"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Dịch Vụ
              </a>
              <a
                href="/blog"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Blog
              </a>
              <a
                href="#contact"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Liên Hệ
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={openChangePassword}
        onOpenChange={setOpenChangePassword}
      />
    </>
  );
});

Header.displayName = "Header";
