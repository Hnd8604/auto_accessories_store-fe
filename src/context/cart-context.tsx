import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CartsApi } from "@/features/cart/api";
import { useAuth } from "./auth-context";
import type { CartResponse, CartItemRequest } from "@/features/cart/types";
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  cart: CartResponse | null;
  cartId: number | null;
  isLoading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [cartId, setCartId] = useState<number | null>(null);

  // Fetch user's cart
  const { data: cartData, isLoading } = useQuery({
    queryKey: ["cart", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      try {
        const response = await CartsApi.getMyCart();
        if (response.result?.id) {
          setCartId(response.result.id);
        }
        return response;
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        return null;
      }
    },
    enabled: !!user?.id,
  });

  const cart = cartData?.result || null;
  const cartItems = cart?.items || [];
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  
  // Enhanced cart with calculated values
  const enhancedCart = cart ? {
    ...cart,
    totalPrice,
    totalItems: itemCount,
  } : null;

  // Add item mutation
  const addItemMutation = useMutation({
    mutationFn: (payload: CartItemRequest) => CartsApi.addItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
      toast({
        title: "Thành công",
        description: "Đã thêm sản phẩm vào giỏ hàng",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error?.message || "Không thể thêm sản phẩm vào giỏ hàng",
        variant: "destructive",
      });
    },
  });

  // Remove item mutation
  const removeItemMutation = useMutation({
    mutationFn: ({ itemId }: { itemId: number }) =>
      cartId ? CartsApi.removeItem(cartId, itemId) : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
      toast({
        title: "Đã xóa",
        description: "Đã xóa sản phẩm khỏi giỏ hàng",
      });
    },
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      CartsApi.updateItem(itemId, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
    },
  });

  const addToCart = async (productId: number, quantity = 1) => {
    if (!user?.id) {
      toast({
        title: "Lỗi",
        description: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng",
        variant: "destructive",
      });
      return;
    }

    const targetCartId = cartId || 0;
    
    try {
      const response = await addItemMutation.mutateAsync({
        cartId: targetCartId,
        productId,
        quantity,
      });
      
      if (!cartId && response?.result?.cartId) {
        setCartId(response.result.cartId);
      }
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  };

  const removeFromCart = async (itemId: number) => {
    await removeItemMutation.mutateAsync({ itemId });
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    await updateQuantityMutation.mutateAsync({ itemId, quantity });
  };

  const clearCart = () => {
    setCartId(null);
    queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
  };

  return (
    <CartContext.Provider
      value={{
        cart: enhancedCart,
        cartId,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
