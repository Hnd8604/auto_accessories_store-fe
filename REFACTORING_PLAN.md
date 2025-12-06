# Component Optimization Plan

## ✅ Đã tạo Shared Components

### 1. Components tái sử dụng cao
- ✅ `DataTable` - Bảng dữ liệu với actions
- ✅ `Pagination` - Phân trang
- ✅ `SearchBar` - Tìm kiếm
- ✅ `ConfirmDialog` - Dialog xác nhận
- ✅ `FormDialog` - Dialog form
- ✅ `PageHeader` - Header trang
- ✅ `CRUDManagement` - Generic CRUD manager

### 2. Example refactored
- ✅ `BrandManagement.new.tsx` - Sử dụng CRUDManagement (giảm 50% code)

## 📋 Cần Refactor

### Feature Components (Cần sử dụng CRUDManagement)

#### 1. CategoryManagement
**File:** `src/features/categories/components/CategoryManagement.tsx`
**Lines:** 460 lines
**Pattern:** CRUD standard
**Effort:** Low
**Benefit:** Giảm ~250 lines

**Actions:**
- [ ] Chuyển sang CRUDManagement
- [ ] Giữ form validation
- [ ] Tái sử dụng renderFormFields

---

#### 2. UserManagement
**File:** `src/features/users/components/UserManagement.tsx`
**Lines:** 1017 lines
**Pattern:** CRUD với roles
**Effort:** Medium
**Benefit:** Giảm ~500 lines

**Special Cases:**
- Có 2 forms (create/update riêng)
- Dropdown roles
- Custom detail view với roles/permissions

**Actions:**
- [ ] Chuyển sang CRUDManagement
- [ ] Custom renderFormFields cho roles
- [ ] Custom detail view

---

#### 3. ProductManagement
**File:** `src/features/products/components/ProductManagement.tsx`
**Lines:** 839 lines
**Pattern:** CRUD với relationships
**Effort:** Medium-High
**Benefit:** Giảm ~400 lines

**Special Cases:**
- Category và Brand selects
- Image management button
- Pagination từ API
- Primary image display

**Actions:**
- [ ] Chuyển sang CRUDManagement
- [ ] Custom action cho image management
- [ ] Integrate pagination
- [ ] Custom column render cho image

---

#### 4. ProductImageManagement
**File:** `src/features/products/components/ProductImageManagement.tsx`
**Lines:** ~400 lines
**Pattern:** CRUD với image preview
**Effort:** Medium
**Benefit:** Giảm ~200 lines

**Special Cases:**
- Image preview
- Primary image toggle
- Sort order
- Image upload

**Actions:**
- [ ] Có thể dùng CRUDManagement
- [ ] Custom render cho image preview
- [ ] Custom actions cho set primary

---

### Landing Page Components (Giữ nguyên - đã tối ưu)

✅ Các components này đã được tối ưu và đặt đúng vị trí:
- `Blog.tsx` - Landing page section
- `Contact.tsx` - Landing page section  
- `Footer.tsx` - Shared layout
- `Gallery.tsx` - Landing page section
- `Header.tsx` - Shared layout
- `HeroSlider.tsx` - Landing page section
- `Services.tsx` - Landing page section

**Lý do giữ nguyên:**
- Không phải CRUD pattern
- UI/UX specific
- Ít khả năng tái sử dụng
- Đã được organize tốt

---

### Page Components

#### 1. AdminPage.tsx
**File:** `src/pages/AdminPage.tsx`
**Lines:** ~800 lines
**Pattern:** Dashboard with multiple tabs
**Effort:** High
**Benefit:** Tách thành nhiều components

**Issues:**
- Quá nhiều logic trong 1 file
- Mix nhiều concerns (stats, users, products, orders)
- Nên tách thành:
  - `DashboardStats.tsx`
  - `RecentOrders.tsx`
  - Sử dụng các Management components đã refactor

**Actions:**
- [ ] Tách stats vào component riêng
- [ ] Tách orders vào component riêng
- [ ] Dùng các Management components cho tabs
- [ ] Keep only orchestration logic

---

#### 2. OrderPage.tsx & OrderForm.tsx
**File:** `src/features/orders/`
**Pattern:** Form-heavy
**Effort:** Medium
**Benefit:** Medium

**Special Cases:**
- Complex form với multiple steps
- Service selection
- Time slot booking
- Address info

**Actions:**
- [ ] Có thể tạo `MultiStepForm` component
- [ ] Separate form steps
- [ ] Reusable time slot picker

---

#### 3. Cart & Checkout
**Files:** 
- `src/features/cart/components/Cart.tsx`
- `src/features/cart/components/Checkout.tsx`

**Pattern:** E-commerce specific
**Effort:** Low
**Benefit:** Low

**Actions:**
- [ ] Giữ nguyên - domain specific
- [ ] Có thể extract `CartItem` component
- [ ] Có thể extract `CheckoutStep` component

---

### Products & Filters

#### ProductFilters.tsx
**File:** `src/features/products/components/ProductFilters.tsx`
**Pattern:** Filter UI
**Effort:** Low
**Benefit:** Medium

**Actions:**
- [ ] Extract `PriceRangeFilter` component
- [ ] Extract `CategoryFilter` component
- [ ] Make filters more generic/reusable

---

#### Products.tsx & ProductsPage.tsx
**Files:**
- `src/features/products/components/Products.tsx`
- `src/features/products/pages/ProductsPage.tsx`

**Pattern:** Product listing
**Effort:** Low
**Benefit:** Low

**Actions:**
- [ ] Giữ nguyên - specific UI
- [ ] Có thể extract `ProductCard` component
- [ ] Có thể extract `ProductGrid` component

---

## 📊 Refactoring Priority

### High Priority (Nên làm ngay)
1. **CategoryManagement** - Dễ, benefit cao
2. **BrandManagement** - Đã có example
3. **UserManagement** - File lớn nhất, nhiều duplicate

### Medium Priority
4. **ProductManagement** - Có dependencies
5. **AdminPage** - Cần tách thành nhiều components
6. **ProductImageManagement** - Có custom logic

### Low Priority
7. **OrderForm** - Domain specific
8. **ProductFilters** - Có thể improve
9. **Cart/Checkout** - Đã OK

---

## 🎯 Expected Results

### Metrics

**Trước refactoring:**
- CategoryManagement: 460 lines
- BrandManagement: 452 lines
- UserManagement: 1017 lines
- ProductManagement: 839 lines
- **Total: 2,768 lines**

**Sau refactoring:**
- CategoryManagement: ~220 lines (↓ 52%)
- BrandManagement: ~220 lines (↓ 51%)
- UserManagement: ~500 lines (↓ 51%)
- ProductManagement: ~450 lines (↓ 46%)
- **Total: 1,390 lines (↓ 50%)**

### Benefits
- ✅ Code ngắn gọn hơn 50%
- ✅ Dễ maintain
- ✅ Consistency across features
- ✅ Bug fixes ở 1 chỗ → apply cho tất cả
- ✅ Onboarding dev mới dễ hơn
- ✅ Testing dễ hơn

---

## 🚀 Next Steps

1. **Refactor CategoryManagement** theo pattern của BrandManagement.new.tsx
2. **Replace old BrandManagement** bằng version mới
3. **Refactor UserManagement** với custom logic
4. **Refactor ProductManagement** với pagination
5. **Tách AdminPage** thành smaller components
6. **Create ProductCard, CartItem** shared components nếu cần
7. **Update documentation** với examples

---

## 📚 Resources

- `SHARED_COMPONENTS.md` - Documentation
- `src/features/brands/components/BrandManagement.new.tsx` - Example
- `src/components/shared/` - Shared components source
