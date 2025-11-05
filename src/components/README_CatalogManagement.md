# Hướng dẫn sử dụng Quản lý Danh mục & Thương hiệu

## 🎯 Tổng quan

Hệ thống quản lý danh mục và thương hiệu đã được tích hợp vào trang Admin với đầy đủ chức năng CRUD và giao diện thân thiện.

## 📁 Files đã tạo:

### 1. **CategoryManagement.tsx**

- Quản lý danh mục sản phẩm
- CRUD hoàn chỉnh: Tạo, Xem, Sửa, Xóa
- Form validation với Zod
- Toast notifications
- Modal xem chi tiết

### 2. **BrandManagement.tsx**

- Quản lý thương hiệu sản phẩm
- CRUD hoàn chỉnh: Tạo, Xem, Sửa, Xóa
- Form validation với Zod
- Toast notifications
- Modal xem chi tiết

### 3. **CatalogManagement.tsx**

- Component tổng hợp với Tabs
- Chuyển đổi giữa Danh mục và Thương hiệu
- Giao diện thống nhất

### 4. **Tích hợp vào AdminPage.tsx**

- Thêm tab "Danh mục & Thương hiệu"
- Import và sử dụng CatalogManagement

## 🚀 Cách truy cập:

1. **Vào trang Admin**: `/admin`
2. **Chọn tab**: "Danh mục & Thương hiệu"
3. **Sử dụng tabs con**:
   - **Danh mục**: Quản lý categories
   - **Thương hiệu**: Quản lý brands

## ⚡ Tính năng chính:

### Cho cả Danh mục và Thương hiệu:

#### 📋 **Danh sách (Table)**

- Hiển thị ID, Tên, Mô tả
- Dropdown menu 3 tùy chọn:
  - 👁️ Xem chi tiết
  - ✏️ Chỉnh sửa
  - 🗑️ Xóa

#### ➕ **Thêm mới**

- Nút "Thêm danh mục/thương hiệu"
- Form popup với:
  - Tên (bắt buộc)
  - Mô tả (tùy chọn)
- Validation realtime
- Toast thông báo kết quả

#### 👁️ **Xem chi tiết**

- Modal hiển thị:
  - ID
  - Tên
  - Mô tả (nếu có)
- Nút "Chỉnh sửa" trực tiếp

#### ✏️ **Chỉnh sửa**

- Form pre-fill dữ liệu cũ
- Validation tương tự thêm mới
- Cập nhật realtime

#### 🗑️ **Xóa**

- Confirm dialog trước khi xóa
- Cập nhật danh sách ngay lập tức

## 💡 Sử dụng độc lập:

### Import riêng lẻ:

```tsx
import { CategoryManagement } from '@/components/CategoryManagement';
import { BrandManagement } from '@/components/BrandManagement';

// Sử dụng
<CategoryManagement />
<BrandManagement />
```

### Import component tổng hợp:

```tsx
import { CatalogManagement } from "@/components/CatalogManagement";

// Sử dụng
<CatalogManagement />;
```

## 🔧 API đã tích hợp:

### Categories API:

- `GET /api/categories` - Lấy danh sách
- `GET /api/categories/{id}` - Lấy chi tiết
- `POST /api/categories` - Tạo mới
- `PUT /api/categories/{id}` - Cập nhật
- `DELETE /api/categories/{id}` - Xóa

### Brands API:

- `GET /api/brands` - Lấy danh sách
- `GET /api/brands/{id}` - Lấy chi tiết
- `POST /api/brands` - Tạo mới
- `PUT /api/brands/{id}` - Cập nhật
- `DELETE /api/brands/{id}` - Xóa

## 📱 Responsive Design:

- ✅ Desktop: Layout 2 cột, đầy đủ tính năng
- ✅ Tablet: Adaptive layout
- ✅ Mobile: Single column, touch-friendly

## ⚠️ Error Handling:

- ✅ Network errors
- ✅ Validation errors
- ✅ Loading states
- ✅ Empty states
- ✅ Toast notifications

## 🎨 UI Components sử dụng:

- **shadcn/ui**: Card, Button, Table, Dialog, Form, Tabs
- **React Hook Form**: Form handling
- **Zod**: Validation
- **TanStack Query**: Data fetching
- **Lucide React**: Icons

## 🔥 Demo:

Đã tạo file `CatalogDemo.tsx` để test riêng component nếu cần.

---

✅ **Hệ thống đã sẵn sàng sử dụng!**
