# UI vs Shared Components - Giải thích chi tiết

## 🤔 Câu hỏi: Tại sao cần 2 thư mục components/ui và components/shared?

Đây là câu hỏi rất hay! Hãy phân tích sự khác biệt:

---

## 📦 `components/ui/` - Primitive Components (Từ shadcn/ui)

### Đặc điểm:
- **Level:** Low-level, primitive components
- **Source:** Từ shadcn/ui library (auto-generated)
- **Purpose:** Cung cấp các HTML elements được styled
- **Business Logic:** KHÔNG có
- **Reusability:** 100% generic, dùng được ở mọi project

### Ví dụ:

```tsx
// components/ui/button.tsx
// CHỈ LÀ 1 CÁI BUTTON với styling
<Button variant="default" size="lg">
  Click me
</Button>

// components/ui/table.tsx  
// CHỈ LÀ BẢNG HTML với styling
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

**👉 Không có logic, chỉ là HTML + CSS + variant styles**

---

## 🎯 `components/shared/` - Business Components

### Đặc điểm:
- **Level:** High-level, composed components
- **Source:** Tự viết cho project cụ thể
- **Purpose:** Giải quyết business problems
- **Business Logic:** CÓ (actions, state, data handling)
- **Reusability:** Dùng chung trong project này

### Ví dụ:

```tsx
// components/shared/DataTable.tsx
// BẢNG với LOGIC: actions, loading, empty state, dropdown menu
<DataTable
  columns={columns}
  data={users}
  isLoading={isLoading}
  actions={[
    { label: "Xem", onClick: handleView },
    { label: "Xóa", onClick: handleDelete }
  ]}
/>

// Bên trong nó SỬ DỤNG ui components:
import { Table, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
```

**👉 Có logic business, compose nhiều ui components lại**

---

## 🔍 So sánh trực quan

### Component `ui/table` (Primitive):

```tsx
// ❌ KHÔNG thể làm được:
<Table>
  {/* Hiển thị loading spinner? KHÔNG */}
  {/* Hiển thị "no data"? KHÔNG */}
  {/* Actions dropdown? KHÔNG */}
  {/* Phải tự viết mọi thứ */}
</Table>
```

### Component `shared/DataTable` (Business):

```tsx
// ✅ Làm được tất cả:
<DataTable
  data={data}
  isLoading={true}        // ✅ Auto show spinner
  emptyMessage="No data"  // ✅ Auto show empty state
  actions={actions}       // ✅ Auto show action dropdown
  columns={columns}       // ✅ Auto render columns
/>
```

---

## 📊 Hierarchy (Phân cấp)

```
Application
    ↓
┌─────────────────────────────────────┐
│ Features (pages/features/)          │
│ - BrandManagement                   │
│ - UserManagement                    │
│ - ProductManagement                 │
└─────────────────────────────────────┘
    ↓ uses
┌─────────────────────────────────────┐
│ Shared Business Components          │
│ (components/shared/)                │
│ - DataTable                         │
│ - CRUDManagement                    │
│ - Pagination                        │
│ - SearchBar                         │
└─────────────────────────────────────┘
    ↓ uses
┌─────────────────────────────────────┐
│ UI Primitives                       │
│ (components/ui/)                    │
│ - Button                            │
│ - Table                             │
│ - Dialog                            │
│ - Input                             │
└─────────────────────────────────────┘
    ↓ uses
┌─────────────────────────────────────┐
│ HTML Elements                       │
│ <button>, <table>, <div>, <input>  │
└─────────────────────────────────────┘
```

---

## 🎨 Analogy (So sánh)

### `components/ui/` = Lego Pieces (Miếng Lego)

- Button = 1 miếng Lego màu đỏ
- Input = 1 miếng Lego màu xanh
- Table = 1 tấm nền Lego

**👉 Bạn không thể chơi với 1 miếng Lego, phải ghép lại**

### `components/shared/` = Lego Models (Mô hình Lego)

- DataTable = 1 cái xe Lego đã lắp sẵn (gồm nhiều miếng)
- CRUDManagement = 1 cái nhà Lego đã lắp sẵn
- SearchBar = 1 cái cây Lego đã lắp sẵn

**👉 Bạn có thể chơi ngay, đã lắp sẵn từ các miếng nhỏ**

---

## ❓ Có nên gộp lại không?

### ❌ KHÔNG nên gộp vì:

#### 1. **Mục đích khác nhau**
```
ui/       → Generic, không biết business
shared/   → Specific, hiểu business logic
```

#### 2. **Nguồn gốc khác nhau**
```
ui/       → Từ shadcn/ui (external)
shared/   → Tự viết (internal)
```

#### 3. **Update khác nhau**
```
ui/       → Update khi shadcn/ui release new version
shared/   → Update theo business requirements
```

#### 4. **Testing khác nhau**
```
ui/       → Test presentation (CSS, variants)
shared/   → Test logic (actions, state, data)
```

#### 5. **Reusability khác nhau**
```
ui/       → Copy sang project khác → OK
shared/   → Copy sang project khác → Cần modify logic
```

---

## 🏗️ Architecture Pattern (Best Practice)

### Atomic Design Pattern:

```
Atoms       = components/ui/          (Button, Input)
Molecules   = components/shared/      (SearchBar, Pagination)
Organisms   = components/shared/      (DataTable, CRUDManagement)
Templates   = features/*/components/  (BrandManagement)
Pages       = pages/                  (AdminPage)
```

---

## 📝 Quy tắc đặt component

### ✅ Đặt vào `components/ui/` khi:
- Component từ shadcn/ui
- Không có business logic
- Chỉ có styling và variants
- 100% generic, reusable mọi project

**Examples:**
- Button, Input, Dialog, Table, Card
- Badge, Avatar, Checkbox, Switch
- Alert, Toast, Tooltip

### ✅ Đặt vào `components/shared/` khi:
- Tự viết component
- Có business logic
- Compose nhiều ui components
- Specific cho project này nhưng dùng chung nhiều features

**Examples:**
- DataTable (có actions dropdown, loading, empty state)
- CRUDManagement (có create/edit/delete logic)
- SearchBar (có search icon + input)
- Pagination (có page logic)
- ConfirmDialog (có confirm/cancel logic)

### ✅ Đặt vào `features/*/components/` khi:
- Component chỉ dùng cho 1 feature cụ thể
- Không dùng chung

**Examples:**
- BrandManagement (specific cho brands)
- ProductImageManagement (specific cho product images)
- OrderForm (specific cho orders)

---

## 🎯 Real Example

### Scenario: Tạo bảng hiển thị users

#### ❌ Cách SAI (gộp hết vào ui/):

```tsx
// ❌ components/ui/user-table.tsx
export function UserTable() {
  const [users, setUsers] = useState([]);
  const handleDelete = (id) => { /* ... */ }
  const handleEdit = (id) => { /* ... */ }
  
  return (
    <Table>
      {/* Business logic trong ui component */}
    </Table>
  );
}
```

**Problems:**
- ui/ component có business logic ❌
- Không reusable cho products, orders ❌
- Mix concerns ❌

#### ✅ Cách ĐÚNG (tách ra):

```tsx
// ✅ components/ui/table.tsx (from shadcn)
export function Table({ children }) {
  return <table>{children}</table>
}

// ✅ components/shared/DataTable.tsx
export function DataTable({ data, columns, actions }) {
  return (
    <Table>
      {/* Logic hiển thị data, actions */}
    </Table>
  );
}

// ✅ features/users/components/UserManagement.tsx
export function UserManagement() {
  const users = useUsers();
  
  return (
    <DataTable
      data={users}
      actions={[handleEdit, handleDelete]}
    />
  );
}
```

**Benefits:**
- Tách biệt rõ ràng ✅
- DataTable dùng lại cho products, orders ✅
- Table dùng được ở mọi project ✅

---

## 📚 Tổng kết

| Aspect | `components/ui/` | `components/shared/` |
|--------|------------------|----------------------|
| **Level** | Atoms/Molecules | Molecules/Organisms |
| **Logic** | Presentation only | Business logic |
| **Source** | shadcn/ui | Custom code |
| **Reuse** | Any project | This project |
| **Example** | Button, Table | DataTable, CRUDManagement |
| **Depends on** | HTML elements | ui/ components |
| **Update** | shadcn/ui releases | Business changes |

### 💡 Ghi nhớ:

```
ui/     = "Cái gì?" (What?) - Button, Table, Input
shared/ = "Làm gì?" (What to do?) - Show data with actions, Manage CRUD
```

---

## 🚀 Kết luận

**KHÔNG nên gộp `shared/` vào `ui/`** vì:

1. ❌ Vi phạm Separation of Concerns
2. ❌ Khó maintain khi business logic thay đổi
3. ❌ Khó update ui components từ shadcn/ui
4. ❌ Khó reuse ui components cho projects khác
5. ❌ Khó test riêng presentation và logic

**✅ Giữ tách biệt là Best Practice!**

Cấu trúc hiện tại là chuẩn theo:
- Atomic Design Pattern
- Component-driven Development
- Separation of Concerns Principle
- Industry Best Practices
