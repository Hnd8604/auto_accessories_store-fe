import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, X, ShoppingCart, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useState, useEffect } from "react";
import { Checkout } from "@/features/cart/components/Checkout";
import { useNavigate } from "react-router-dom";
import { ProductImagesApi } from "@/features/products/api";

export default function CartPage() {
  const { cart, itemCount, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [productImages, setProductImages] = useState<Record<number, string>>({});
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const cartItems = cart?.items || [];
  const totalPrice = cart?.totalPrice || 0;

  // Fetch product images when cart items change
  useEffect(() => {
    const fetchImages = async () => {
      if (cartItems.length === 0) return;
      
      const images: Record<number, string> = {};
      await Promise.all(
        cartItems.map(async (item) => {
          try {
            const response = await ProductImagesApi.getByProductId(item.productId);
            const productImages = response?.result || [];
            const primaryImage = productImages.find(img => img.isPrimary);
            if (primaryImage?.imageUrl) {
              images[item.productId] = primaryImage.imageUrl;
            }
          } catch (error) {
            console.error(`Failed to fetch image for product ${item.productId}:`, error);
          }
        })
      );
      setProductImages(images);
    };
    
    fetchImages();
  }, [cartItems.length]);

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      await removeFromCart(itemId);
      return;
    }
    await updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId: number) => {
    await removeFromCart(itemId);
  };

  const handleOrderComplete = () => {
    clearCart();
    setIsCheckoutOpen(false);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ShoppingCart className="h-8 w-8" />
              Giỏ Hàng
            </h1>
            <p className="text-muted-foreground mt-1">
              {itemCount} sản phẩm trong giỏ hàng
            </p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <Card className="p-12">
            <div className="text-center">
              <ShoppingCart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-semibold mb-2">Giỏ hàng của bạn đang trống</h2>
              <p className="text-muted-foreground mb-6">
                Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
              </p>
              <Button 
                variant="luxury" 
                size="lg"
                onClick={() => navigate('/')}
              >
                Tiếp Tục Mua Sắm
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="p-6">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    {productImages[item.productId] ? (
                      <img
                        src={productImages[item.productId]}
                        alt={item.productName || `Sản phẩm #${item.productId}`}
                        className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-semibold text-lg line-clamp-2">
                          {item.productName || `Sản phẩm #${item.productId}`}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive flex-shrink-0"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>

                      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Price */}
                        <div>
                          <p className="text-sm text-muted-foreground">Đơn giá</p>
                          <p className="text-lg font-bold text-primary">
                            {formatPrice(item.unitPrice)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Số lượng</p>
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-10 w-10"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-semibold text-lg">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-10 w-10"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Thành tiền</p>
                          <p className="text-xl font-bold text-primary">
                            {formatPrice(item.totalPrice)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Thông tin đơn hàng</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground">Tạm tính:</span>
                    <span className="font-medium">{formatPrice(totalPrice)}</span>
                  </div>
                  
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground">Phí vận chuyển:</span>
                    <span className="font-medium">Miễn phí</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Tổng cộng:</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>

                  <div className="pt-4 space-y-3">
                    <Button 
                      variant="luxury" 
                      className="w-full" 
                      size="lg"
                      onClick={() => setIsCheckoutOpen(true)}
                    >
                      Thanh Toán
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/')}
                    >
                      Tiếp Tục Mua Sắm
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground text-center">
                      Miễn phí vận chuyển cho đơn hàng trên 500.000đ
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Dialog */}
      <Checkout 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onComplete={handleOrderComplete}
      />
    </div>
  );
}
