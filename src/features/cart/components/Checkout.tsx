import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/cart-context";
import { CalendarDays, Clock, Car, Phone, Mail, MapPin, CreditCard, Truck } from "lucide-react";

interface CheckoutFormData {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  carModel: string;
  carYear: string;
  appointmentDate: string;
  appointmentTime: string;
  paymentMethod: string;
  notes: string;
}

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"
];

const paymentMethods = [
  { value: "cash", label: "Thanh toán tiền mặt", icon: "💵" },
  { value: "transfer", label: "Chuyển khoản", icon: "🏦" },
  { value: "card", label: "Thẻ tín dụng", icon: "💳" },
];

export const Checkout = ({ isOpen, onClose, onComplete }: CheckoutProps) => {
  const { toast } = useToast();
  const { cart, itemCount } = useCart();
  
  const form = useForm<CheckoutFormData>({
    defaultValues: {
      customerName: "",
      phone: "",
      email: "",
      address: "",
      carModel: "",
      carYear: "",
      appointmentDate: "",
      appointmentTime: "",
      paymentMethod: "",
      notes: "",
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const cartItems = cart?.items || [];
  const totalPrice = cart?.totalPrice || 0;
  const shippingFee = totalPrice >= 20000000 ? 0 : 500000;
  const finalTotal = totalPrice + shippingFee;

  const onSubmit = (data: CheckoutFormData) => {
    console.log("Checkout data:", { ...data, cartItems, totalPrice: finalTotal });
    
    toast({
      title: "Đặt hàng thành công!",
      description: `Đơn hàng ${itemCount} sản phẩm trị giá ${formatPrice(finalTotal)} đã được xác nhận.`,
    });
    
    form.reset();
    onComplete();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <CreditCard className="h-6 w-6 text-automotive-red" />
            Thanh Toán Đơn Hàng
          </DialogTitle>
          <DialogDescription>
            Hoàn tất thông tin để xác nhận đơn hàng của bạn
          </DialogDescription>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Order Summary */}
          <div className="space-y-4">
            <Card className="border-automotive-red/20">
              <CardHeader>
                <CardTitle className="text-automotive-red">Đơn Hàng Của Bạn</CardTitle>
                <CardDescription>
                  {itemCount} sản phẩm trong giỏ hàng
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                      <Car className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-1">
                        {item.productName || `Sản phẩm #${item.productId}`}
                      </h4>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-muted-foreground">
                          SL: {item.quantity}
                        </span>
                        <span className="font-bold text-sm text-automotive-red">
                          {formatPrice(item.totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Phí vận chuyển:
                    </span>
                    <span className={shippingFee === 0 ? "text-green-600" : ""}>
                      {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-automotive-red">{formatPrice(finalTotal)}</span>
                  </div>
                  {shippingFee === 0 && (
                    <p className="text-xs text-green-600">
                      🎉 Bạn được miễn phí vận chuyển!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Phone className="h-5 w-5" />
                      Thông Tin Khách Hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="customerName"
                        rules={{ required: "Vui lòng nhập họ tên" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Họ và Tên *</FormLabel>
                            <FormControl>
                              <Input placeholder="Nguyễn Văn A" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        rules={{ 
                          required: "Vui lòng nhập số điện thoại",
                          pattern: {
                            value: /^[0-9+\-\s()]+$/,
                            message: "Số điện thoại không hợp lệ"
                          }
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Số Điện Thoại *</FormLabel>
                            <FormControl>
                              <Input placeholder="0901234567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      rules={{ 
                        required: "Vui lòng nhập email",
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: "Email không hợp lệ"
                        }
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input placeholder="example@email.com" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      rules={{ required: "Vui lòng nhập địa chỉ" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Địa Chỉ Giao Hàng *
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Số nhà, đường, quận, thành phố" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Car Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Car className="h-5 w-5" />
                      Thông Tin Xe
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="carModel"
                        rules={{ required: "Vui lòng nhập dòng xe" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dòng Xe *</FormLabel>
                            <FormControl>
                              <Input placeholder="Toyota Camry..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="carYear"
                        rules={{ required: "Vui lòng chọn năm sản xuất" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Năm Sản Xuất *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn năm" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Array.from({ length: 15 }, (_, i) => 2024 - i).map((year) => (
                                  <SelectItem key={year} value={year.toString()}>
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Appointment */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <CalendarDays className="h-5 w-5" />
                      Lịch Hẹn Lắp Đặt
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="appointmentDate"
                        rules={{ required: "Vui lòng chọn ngày hẹn" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ngày Hẹn *</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} min={new Date().toISOString().split('T')[0]} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="appointmentTime"
                        rules={{ required: "Vui lòng chọn giờ hẹn" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Giờ Hẹn *
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn giờ" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {timeSlots.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <CreditCard className="h-5 w-5" />
                      Phương Thức Thanh Toán
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      rules={{ required: "Vui lòng chọn phương thức thanh toán" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="grid grid-cols-1 gap-3">
                              {paymentMethods.map((method) => (
                                <label
                                  key={method.value}
                                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                    field.value === method.value
                                      ? "border-automotive-red bg-automotive-red/10"
                                      : "border-border hover:border-automotive-red/50"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    value={method.value}
                                    checked={field.value === method.value}
                                    onChange={field.onChange}
                                    className="sr-only"
                                  />
                                  <span className="text-xl">{method.icon}</span>
                                  <span className="font-medium">{method.label}</span>
                                </label>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Notes */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ghi Chú</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Ghi chú thêm về đơn hàng..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                    Quay Lại
                  </Button>
                  <Button type="submit" variant="luxury" className="flex-1" size="lg">
                    Xác Nhận Đặt Hàng
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};