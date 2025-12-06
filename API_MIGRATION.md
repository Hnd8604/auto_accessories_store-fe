# API Migration Guide - Version 2.0

## 📝 Tổng quan thay đổi

Dự án đã được cập nhật để tương thích với API backend mới với các thay đổi chính:

### 1. **Base URL Changes**
- **Cũ**: Các endpoint không có prefix cụ thể
- **Mới**: Tất cả endpoint giờ có base path `/api/v1`
- **Config**: `API_BASE_URL = "http://localhost:8080/api/v1"`

### 2. **Endpoint Path Updates**
Tất cả các endpoint đã được cập nhật để loại bỏ `/api` prefix trong request path (vì đã có trong base URL):

#### Products API
```typescript
// Cũ
/api/products
/api/products/{id}

// Mới
/products (→ http://localhost:8080/api/v1/products)
/products/id/{id}
/products/slug/{slug}  // Mới thêm
```

#### Users API  
```typescript
// Cũ
/api/users
/api/users/{userId}

// Mới
/users
/users/{userId}
/users/my-info  // Mới thêm
```

#### Auth API
```typescript
// Cũ
/api/auth/token
/api/auth/logout
/api/auth/refresh

// Mới
/auth/token
/auth/logout  
/auth/refresh
```

#### Categories, Brands, Orders, Carts - Tương tự
- Loại bỏ `/api` prefix
- Thêm endpoint get by slug cho Categories và Brands

### 3. **Pagination Support**

#### New Types
```typescript
export interface PageResponse<T> {
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  size: number;
  content: T[];
  number: number;
  sort: SortObject;
  numberOfElements: number;
  pageable: PageableObject;
  empty: boolean;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}
```

#### API Updates
```typescript
// Products
ProductsApi.getAll(params?: PaginationParams) 
  → ApiResponse<PageResponse<ProductResponse>>

// Users
UsersApi.getAll(params?: PaginationParams) 
  → ApiResponse<PageResponse<UserResponse>>

// Product Images
ProductImagesApi.getAll(params?: PaginationParams)
  → ApiResponse<PageResponse<ProductImageResponse>>
```

### 4. **Type System Updates**

#### UserResponse
```typescript
// Cũ
interface UserResponse {
  role?: RoleResponse;  // Single role
}

// Mới
interface UserResponse {
  roles?: RoleResponse[];  // Multiple roles
  fullName?: string;       // Thay vì firstName/lastName
}
```

#### ProductResponse
```typescript
// Thêm
interface ProductResponse {
  slug?: string;  // SEO-friendly URL
}
```

#### CategoryResponse & BrandResponse
```typescript
// Thêm
interface CategoryResponse {
  slug?: string;
  productCount?: number;
}

interface BrandResponse {
  slug?: string;
  productCount?: number;
}
```

### 5. **New API Endpoints**

#### Product Search
```typescript
ProductsApi.search(
  searchRequest: ProductSearchRequest, 
  params?: PaginationParams
)

interface ProductSearchRequest {
  keyword?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  brand?: string;
}
```

#### Role Permission Management
```typescript
RolesApi.addPermissions(roleId: string, permissionNames: string[])
RolesApi.removePermissions(roleId: string, permissionNames: string[])
```

#### Posts Module (NEW)
```typescript
// New types
PostResponse
PostCategoryResponse
PostRequest
PostCategoryRequest

// Endpoints sẽ được thêm trong tương lai
```

### 6. **Helper Functions Updates**

#### User Role Checking
```typescript
// Cũ
hasRole(user, "ADMIN") // Kiểm tra user.role.name

// Mới  
hasRole(user, "ADMIN") // Kiểm tra user.roles array

// Mới thêm
getUserRoles(user) // Trả về string[] của tất cả roles
```

### 7. **API Client Configuration**

#### Refresh Token
```typescript
// Cập nhật URL đầy đủ trong refreshCall
const res = await fetch(`http://localhost:8080/api/v1/auth/refresh`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ refreshToken }),
});
```

## 🔧 Migration Steps

### Đã hoàn thành:
- ✅ Cập nhật `API_BASE_URL` trong constants
- ✅ Thêm pagination types (PageResponse, PaginationParams)
- ✅ Cập nhật tất cả API endpoints (loại bỏ /api prefix)
- ✅ Cập nhật UserResponse (role → roles)
- ✅ Cập nhật ProductResponse, CategoryResponse, BrandResponse (thêm slug)
- ✅ Thêm ProductSearchRequest
- ✅ Cập nhật helper functions (hasRole, getUserRole)
- ✅ Fix TypeScript errors

### Cần làm thêm (optional):
- [ ] Implement Posts API integration
- [ ] Update UI components để sử dụng pagination
- [ ] Add loading states cho paginated requests
- [ ] Implement search functionality
- [ ] Add error handling cho failed requests

## 📊 Impact Assessment

### Breaking Changes:
1. **UserResponse.role → UserResponse.roles**: Cần cập nhật tất cả code check role
2. **API URLs**: Tất cả requests giờ đi qua `/api/v1` base path
3. **Pagination**: Response structure thay đổi từ array → PageResponse

### Non-breaking:
- Thêm slug fields (optional)
- Thêm productCount (optional)
- Thêm new endpoints

## 🧪 Testing Checklist

- [ ] Test login/logout flow
- [ ] Test user role checking
- [ ] Test product CRUD operations
- [ ] Test pagination on products list
- [ ] Test product search
- [ ] Test category/brand filtering
- [ ] Test order creation
- [ ] Test cart operations

## 📝 Notes

- API base URL được config qua environment variable `VITE_API_BASE_URL`
- Default: `http://localhost:8080/api/v1`
- Tất cả requests đều dùng JWT authentication (Bearer token)
- Refresh token tự động xử lý bởi AuthHttpClient

## 🔗 Related Files

### Updated:
- `src/constants/config.ts` - API base URL
- `src/types/api.ts` - All type definitions
- `src/features/*/api/*.ts` - All API endpoints
- `src/features/auth/hooks/useAuth.ts` - Role checking logic
- `src/services/http.ts` - HTTP client

### No Changes Needed:
- UI Components (chưa dùng pagination)
- Context providers
- Hooks (trừ useAuth)
