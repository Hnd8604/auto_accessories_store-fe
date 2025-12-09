import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { OrdersApi } from "@/features/orders/api";
import { useToast } from "@/hooks/use-toast";
import type {
  OrderResponse,
  OrderUpdateByAdminRequest,
} from "@/features/orders/types";
import type { OrderStatus, PaymentStatus } from "@/features/orders/types";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash2, Loader2, Eye } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

// Validation schema
const orderUpdateSchema = z.object({
  orderStatus: z.enum([
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELED",
  ]),
  paymentStatus: z.enum(["UNPAID", "PAID", "REFUNDED"]),
});

type OrderUpdateFormData = z.infer<typeof orderUpdateSchema>;

interface OrderManagementProps {
  className?: string;
}

// Helper functions
const getOrderStatusLabel = (status?: OrderStatus) => {
  const labels: Record<OrderStatus, string> = {
    PENDING: "Chờ xử lý",
    PROCESSING: "Đang xử lý",
    SHIPPED: "Đã gửi hàng",
    DELIVERED: "Đã giao hàng",
    CANCELED: "Đã hủy",
  };
  return status ? labels[status] : "-";
};

const getOrderStatusVariant = (
  status?: OrderStatus
): "default" | "secondary" | "destructive" | "outline" => {
  const variants: Record<
    OrderStatus,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    PENDING: "secondary",
    PROCESSING: "default",
    SHIPPED: "default",
    DELIVERED: "default",
    CANCELED: "destructive",
  };
  return status ? variants[status] : "outline";
};

const getPaymentStatusLabel = (status?: PaymentStatus) => {
  const labels: Record<PaymentStatus, string> = {
    UNPAID: "Chưa thanh toán",
    PAID: "Đã thanh toán",
    REFUNDED: "Đã hoàn tiền",
  };
  return status ? labels[status] : "-";
};

const getPaymentStatusVariant = (
  status?: PaymentStatus
): "default" | "secondary" | "destructive" | "outline" => {
  const variants: Record<
    PaymentStatus,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    UNPAID: "secondary",
    PAID: "default",
    REFUNDED: "destructive",
  };
  return status ? variants[status] : "outline";
};

export const OrderManagement: React.FC<OrderManagementProps> = ({
  className,
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderResponse | null>(null);
  const [viewingOrder, setViewingOrder] = useState<OrderResponse | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form setup
  const form = useForm<OrderUpdateFormData>({
    resolver: zodResolver(orderUpdateSchema),
    defaultValues: {
      orderStatus: "PENDING",
      paymentStatus: "UNPAID",
    },
  });

  // Query: Get all orders
  const {
    data: ordersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => OrdersApi.getAll(),
  });

  // Mutation: Update order
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: OrderUpdateByAdminRequest }) =>
      OrdersApi.updateByAdmin(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setIsEditDialogOpen(false);
      setEditingOrder(null);
      form.reset();
      toast({
        title: "Thành công",
        description: "Đơn hàng đã được cập nhật",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.message || "Không thể cập nhật đơn hàng",
      });
    },
  });

  // Mutation: Delete order
  const deleteMutation = useMutation({
    mutationFn: OrdersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({
        title: "Thành công",
        description: "Đơn hàng đã được xóa",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.message || "Không thể xóa đơn hàng",
      });
    },
  });

  // Handlers
  const handleEdit = (order: OrderResponse) => {
    setEditingOrder(order);
    form.reset({
      orderStatus: order.status || "PENDING",
      paymentStatus: order.paymentStatus || "UNPAID",
    });
    setIsEditDialogOpen(true);
  };

  const handleViewDetail = (order: OrderResponse) => {
    setViewingOrder(order);
    setIsDetailDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setOrderToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      deleteMutation.mutate(orderToDelete);
      setDeleteConfirmOpen(false);
      setOrderToDelete(null);
    }
  };

  const onSubmit = (data: OrderUpdateFormData) => {
    if (editingOrder) {
      updateMutation.mutate({
        id: editingOrder.id,
        data: {
          orderStatus: data.orderStatus,
          paymentStatus: data.paymentStatus,
        },
      });
    }
  };

  const orders = ordersData?.result?.content || [];

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <p className="text-destructive">
            Lỗi khi tải đơn hàng: {(error as Error).message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý đơn hàng</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng</CardTitle>
          <CardDescription>
            Quản lý tất cả đơn hàng của khách hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : orders.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Chưa có đơn hàng nào
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn</TableHead>
                  <TableHead>Người nhận</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái đơn</TableHead>
                  <TableHead>Thanh toán</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      {order.id}
                    </TableCell>
                    <TableCell>{order.nameRecipient || "-"}</TableCell>
                    <TableCell>{order.phoneRecipient || "-"}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {order.addressRecipient || "-"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.totalPrice.toLocaleString("vi-VN")} ₫
                    </TableCell>
                    <TableCell>
                      <Badge variant={getOrderStatusVariant(order.status)}>
                        {getOrderStatusLabel(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getPaymentStatusVariant(order.paymentStatus)}
                      >
                        {getPaymentStatusLabel(order.paymentStatus)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewDetail(order)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(order)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Cập nhật trạng thái
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(order.id)}
                          >
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
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsEditDialogOpen(false);
            setEditingOrder(null);
            form.reset();
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
            <DialogDescription>
              Thay đổi trạng thái đơn hàng và thanh toán
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="orderStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái đơn hàng</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                        <SelectItem value="PROCESSING">Đang xử lý</SelectItem>
                        <SelectItem value="SHIPPED">Đã gửi hàng</SelectItem>
                        <SelectItem value="DELIVERED">Đã giao hàng</SelectItem>
                        <SelectItem value="CANCELED">Đã hủy</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái thanh toán</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="UNPAID">Chưa thanh toán</SelectItem>
                        <SelectItem value="PAID">Đã thanh toán</SelectItem>
                        <SelectItem value="REFUNDED">Đã hoàn tiền</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingOrder(null);
                    form.reset();
                  }}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Cập nhật
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog
        open={isDetailDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsDetailDialogOpen(false);
            setViewingOrder(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng #{viewingOrder?.id}</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết đơn hàng
            </DialogDescription>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Người nhận
                  </p>
                  <p className="text-base">{viewingOrder.nameRecipient || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Số điện thoại
                  </p>
                  <p className="text-base">{viewingOrder.phoneRecipient || "-"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Địa chỉ
                  </p>
                  <p className="text-base">{viewingOrder.addressRecipient || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Trạng thái đơn hàng
                  </p>
                  <Badge variant={getOrderStatusVariant(viewingOrder.status)} className="mt-1">
                    {getOrderStatusLabel(viewingOrder.status)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Trạng thái thanh toán
                  </p>
                  <Badge
                    variant={getPaymentStatusVariant(viewingOrder.paymentStatus)}
                    className="mt-1"
                  >
                    {getPaymentStatusLabel(viewingOrder.paymentStatus)}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Ghi chú
                  </p>
                  <p className="text-base">{viewingOrder.note || "Không có ghi chú"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Tổng tiền
                  </p>
                  <p className="text-xl font-bold text-primary">
                    {viewingOrder.totalPrice.toLocaleString("vi-VN")} ₫
                  </p>
                </div>
              </div>

              {viewingOrder.orderDetails && viewingOrder.orderDetails.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Chi tiết sản phẩm
                  </p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mã SP</TableHead>
                        <TableHead>Số lượng</TableHead>
                        <TableHead className="text-right">Đơn giá</TableHead>
                        <TableHead className="text-right">Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewingOrder.orderDetails.map((detail) => (
                        <TableRow key={detail.id}>
                          <TableCell className="font-mono text-sm">
                            {detail.productId}
                          </TableCell>
                          <TableCell>{detail.quantity}</TableCell>
                          <TableCell className="text-right">
                            {detail.unitPrice.toLocaleString("vi-VN")} ₫
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {(detail.unitPrice * detail.quantity).toLocaleString("vi-VN")} ₫
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={confirmDelete}
        title="Xác nhận xóa đơn hàng"
        description="Bạn có chắc chắn muốn xóa đơn hàng này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  );
};
