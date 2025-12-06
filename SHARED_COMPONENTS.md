# Shared Components Documentation

## Tổng quan

Thư mục `src/components/shared/` chứa các **business components** có khả năng tái sử dụng cao, được thiết kế để dùng chung cho toàn bộ ứng dụng.

### ❓ Shared vs UI Components

**Confused?** Đọc [UI_VS_SHARED.md](./UI_VS_SHARED.md) để hiểu sự khác biệt giữa `components/ui/` và `components/shared/`.

**TL;DR:**
- `ui/` = Primitive components từ shadcn/ui (Button, Table, Input) - KHÔNG có business logic
- `shared/` = Business components tự viết (DataTable, CRUDManagement) - CÓ business logic

**Hierarchy:**
```
Features → Shared Components → UI Primitives → HTML
```

## Components

### 1. CRUDManagement

Component quản lý CRUD operations (Create, Read, Update, Delete) cho bất kỳ resource nào.

**Ưu điểm:**
- Tái sử dụng logic CRUD
- Tự động xử lý dialogs, forms, confirmations
- Hỗ trợ pagination, search
- Customizable actions

**Sử dụng:**

```tsx
import { CRUDManagement } from "@/components/shared";

<CRUDManagement<BrandResponse, BrandFormData>
  resourceName="Thương hiệu"
  resourceNamePlural="Thương hiệu"
  data={brands}
  isLoading={isLoading}
  columns={[
    { key: "name", header: "Tên" },
    { key: "description", header: "Mô tả" },
  ]}
  getRowKey={(brand) => brand.id}
  form={form}
  renderFormFields={(form) => <YourFormFields />}
  onCreate={(data) => createMutation.mutate(data)}
  onUpdate={(id, data) => updateMutation.mutate({ id, data })}
  onDelete={(id) => deleteMutation.mutate(id)}
/>
```

### 2. DataTable

Component hiển thị dữ liệu dạng bảng với actions.

**Sử dụng:**

```tsx
import { DataTable } from "@/components/shared";

<DataTable
  columns={[
    { key: "name", header: "Tên" },
    { 
      key: "status", 
      header: "Trạng thái",
      render: (item) => <Badge>{item.status}</Badge>
    }
  ]}
  data={items}
  isLoading={isLoading}
  actions={[
    {
      label: "Xem",
      icon: Eye,
      onClick: (item) => console.log(item)
    },
    {
      label: "Xóa",
      icon: Trash2,
      onClick: (item) => handleDelete(item.id),
      variant: "destructive"
    }
  ]}
  getRowKey={(item) => item.id}
/>
```

### 3. Pagination

Component phân trang.

**Sử dụng:**

```tsx
import { Pagination } from "@/components/shared";

<Pagination
  currentPage={0}
  totalPages={10}
  totalItems={100}
  onPageChange={(page) => setPage(page)}
  itemLabel="sản phẩm"
/>
```

### 4. SearchBar

Component tìm kiếm với icon.

**Sử dụng:**

```tsx
import { SearchBar } from "@/components/shared";

<SearchBar
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Tìm kiếm sản phẩm..."
/>
```

### 5. ConfirmDialog

Dialog xác nhận hành động.

**Sử dụng:**

```tsx
import { ConfirmDialog } from "@/components/shared";

<ConfirmDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Xóa sản phẩm"
  description="Bạn có chắc chắn muốn xóa sản phẩm này?"
  onConfirm={handleConfirm}
  variant="destructive"
/>
```

### 6. FormDialog

Dialog chứa form.

**Sử dụng:**

```tsx
import { FormDialog } from "@/components/shared";

<FormDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Thêm sản phẩm"
  description="Nhập thông tin sản phẩm"
>
  <YourFormContent />
</FormDialog>
```

### 7. PageHeader

Header của page với title và action button.

**Sử dụng:**

```tsx
import { PageHeader } from "@/components/shared";

<PageHeader
  title="Quản lý sản phẩm"
  description="Quản lý toàn bộ sản phẩm trong hệ thống"
  action={{
    label: "Thêm sản phẩm",
    onClick: () => setIsCreateOpen(true)
  }}
/>
```

## Best Practices

### 1. Khi nào nên sử dụng CRUDManagement?

✅ **NÊN dùng khi:**
- Resource có đầy đủ CRUD operations
- Giao diện quản lý đơn giản, chuẩn
- Không có logic phức tạp đặc biệt

❌ **KHÔNG nên dùng khi:**
- UI phức tạp, custom nhiều
- Logic nghiệp vụ đặc thù
- Cần control chi tiết từng bước

### 2. Custom CRUDManagement

Bạn có thể customize bằng cách:

```tsx
<CRUDManagement
  // ... basic props
  
  // Custom actions
  customActions={[
    {
      label: "Export",
      icon: Download,
      onClick: (item) => exportData(item)
    }
  ]}
  
  // Hide default actions
  hideView={true}
  hideDelete={false}
  
  // Custom render
  renderDetailView={(item) => <CustomDetailView item={item} />}
/>
```

### 3. Extending Components

Nếu cần thêm tính năng:

```tsx
// Tạo wrapper component
export function MyCustomTable<T>(props: MyCustomTableProps<T>) {
  return (
    <div className="custom-container">
      <DataTable {...props} />
      <MyCustomFooter />
    </div>
  );
}
```

## Migration Guide

### Chuyển đổi Management Component sang CRUDManagement

**Trước:**

```tsx
export function BrandManagement() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  // ... 100+ lines of boilerplate
  
  return (
    <Card>
      <CardHeader>...</CardHeader>
      <CardContent>
        <Table>...</Table>
      </CardContent>
      <Dialog>...</Dialog>
      <Dialog>...</Dialog>
      <AlertDialog>...</AlertDialog>
    </Card>
  );
}
```

**Sau:**

```tsx
export function BrandManagement() {
  const form = useForm(...);
  const { data, isLoading } = useQuery(...);
  
  return (
    <CRUDManagement
      resourceName="Thương hiệu"
      data={data}
      isLoading={isLoading}
      columns={columns}
      form={form}
      renderFormFields={renderFormFields}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}
```

**Kết quả:**
- Giảm từ 452 lines → 220 lines ✅
- Code dễ đọc, dễ maintain ✅
- Logic tái sử dụng ✅

## Component Architecture

```
src/components/
├── shared/               # Reusable components
│   ├── CRUDManagement.tsx  # Generic CRUD manager
│   ├── DataTable.tsx       # Table with actions
│   ├── Pagination.tsx      # Pagination control
│   ├── SearchBar.tsx       # Search input
│   ├── ConfirmDialog.tsx   # Confirmation dialog
│   ├── FormDialog.tsx      # Form dialog wrapper
│   ├── PageHeader.tsx      # Page header with action
│   └── index.ts
├── ui/                   # shadcn/ui components
│   ├── button.tsx
│   ├── dialog.tsx
│   └── ...
├── Blog.tsx             # Landing page components
├── Contact.tsx
├── Footer.tsx
├── Gallery.tsx
├── Header.tsx
├── HeroSlider.tsx
└── Services.tsx
```

## Examples

Xem các examples:
- `src/features/brands/components/BrandManagement.new.tsx` - Example sử dụng CRUDManagement
- `src/features/categories/components/CategoryManagement.tsx` - Can be refactored
- `src/features/users/components/UserManagement.tsx` - Can be refactored

## Support

Nếu cần hỗ trợ hoặc có câu hỏi, tham khảo:
- Code examples trong `src/features/*/components/`
- shadcn/ui documentation
- React Hook Form documentation
