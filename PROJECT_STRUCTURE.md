# Cấu trúc dự án Store Frontend

Dự án đã được tổ chức lại theo cấu trúc Feature-Based Architecture chuẩn.

## 📁 Cấu trúc thư mục

```
src/
├── assets/               # Ảnh, fonts, icons, videos...
│   └── images/
│
├── components/           # Component UI dùng chung (shadcn/ui)
│   └── ui/              # UI components (Button, Modal, Card...)
│
├── features/            # Các module chức năng (feature-based)
│   ├── auth/           # Authentication & Authorization
│   │   ├── api/        # API calls cho auth
│   │   ├── components/ # Components của auth (ProtectedRoute...)
│   │   ├── hooks/      # Custom hooks cho auth (useAuth, isAdmin...)
│   │   └── pages/      # Pages của auth (AuthPage)
│   │
│   ├── products/       # Quản lý sản phẩm
│   │   ├── api/        # API: products, productImages
│   │   ├── components/ # Components: ProductManagement, ProductFilters...
│   │   ├── hooks/      # Custom hooks cho products
│   │   └── pages/      # Pages: ProductsPage
│   │
│   ├── brands/         # Quản lý thương hiệu
│   │   ├── api/
│   │   ├── components/ # BrandManagement
│   │   └── pages/
│   │
│   ├── categories/     # Quản lý danh mục
│   │   ├── api/
│   │   ├── components/ # CategoryManagement
│   │   └── pages/
│   │
│   ├── orders/         # Quản lý đơn hàng
│   │   ├── api/
│   │   ├── components/ # OrderForm
│   │   ├── hooks/
│   │   └── pages/      # OrderPage
│   │
│   ├── cart/           # Giỏ hàng
│   │   ├── api/
│   │   ├── components/ # Cart, Checkout
│   │   └── pages/
│   │
│   └── users/          # Quản lý người dùng
│       ├── api/        # users, roles, permissions
│       ├── components/ # UserManagement
│       └── pages/
│
├── pages/              # Các page chính (Home, Admin, Blog...)
│   ├── Index.tsx
│   ├── AdminPage.tsx
│   ├── BlogPage.tsx
│   └── NotFound.tsx
│
├── hooks/              # Custom hooks dùng chung
│   ├── use-mobile.tsx
│   └── use-toast.ts
│
├── context/            # React Context
│   └── auth-context.tsx
│
├── routes/             # Định nghĩa routes
│   └── index.tsx
│
├── services/           # HTTP clients & API utilities
│   ├── http.ts         # AuthHttpClient
│   ├── httpClient.ts   # SimpleHttpClient
│   └── index.ts
│
├── utils/              # Hàm tiện ích
│   ├── cn.ts           # classNames utility (tailwind merge)
│   └── index.ts
│
├── styles/             # CSS global
│   ├── App.css
│   └── index.css
│
├── constants/          # Các biến constant
│   ├── config.ts       # API_BASE_URL, TOKEN_KEYS...
│   └── index.ts
│
├── types/              # TypeScript types/interfaces
│   ├── api.ts          # API response/request types
│   └── index.ts
│
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

## 🔄 Migration Changes

### Import Paths Changed

**Trước:**
```typescript
import { AuthService } from "@/api/auth";
import { UserResponse } from "@/api/types";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
```

**Sau:**
```typescript
import { AuthService } from "@/features/auth/api/auth";
import { UserResponse } from "@/types/api";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/utils/cn";
```

### Features Structure

Mỗi feature module bây giờ có cấu trúc riêng:
- `api/` - API calls và HTTP requests
- `components/` - React components cho feature đó
- `hooks/` - Custom hooks cho feature đó  
- `pages/` - Pages của feature đó

### Index Files

Mỗi thư mục con trong feature đều có file `index.ts` để export các thành phần, giúp import dễ dàng hơn:

```typescript
// Có thể import như này:
import { ProductManagement } from "@/features/products/components";
// Thay vì:
import { ProductManagement } from "@/features/products/components/ProductManagement";
```

## 🎯 Benefits

1. **Modularity**: Mỗi feature độc lập, dễ maintain
2. **Scalability**: Dễ dàng thêm features mới
3. **Clear Separation**: API, components, hooks được tách riêng
4. **Reusability**: Shared components và utilities ở top level
5. **Type Safety**: Types được centralized trong `/types`
6. **Constants Management**: Config và constants ở một nơi

## 🚀 Development

### Thêm Feature Mới

1. Tạo thư mục trong `src/features/<feature-name>/`
2. Tạo cấu trúc: `api/`, `components/`, `hooks/`, `pages/`
3. Thêm `index.ts` files để export
4. Cập nhật routes nếu cần

### Working with APIs

Tất cả API calls nên đặt trong `features/<feature>/api/`:
- Sử dụng `http` client từ `@/features/auth/api/auth` cho authenticated requests
- Sử dụng `simpleHttp` từ `@/services/httpClient` cho public requests

### Shared vs Feature-Specific

- **Shared**: Đặt trong `src/components/`, `src/hooks/`, `src/utils/`
- **Feature-Specific**: Đặt trong `src/features/<feature>/`

## 📝 Notes

- Tất cả UI components (shadcn/ui) vẫn ở `src/components/ui/`
- Pages chính (Index, Admin, Blog...) vẫn ở `src/pages/`
- Routes được centralized trong `src/routes/`
- Auth context được shared qua `src/context/`
