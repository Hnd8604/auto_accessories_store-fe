# Component Architecture Diagram

## 📐 Kiến trúc tổng quan

```
┌─────────────────────────────────────────────────────────────┐
│                        APPLICATION                          │
│                       (React App)                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ uses
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                         PAGES                               │
│  src/pages/                                                 │
│  ├── AdminPage.tsx        ← Admin dashboard                │
│  ├── Index.tsx            ← Landing page                   │
│  ├── BlogPage.tsx         ← Blog listing                   │
│  └── NotFound.tsx         ← 404 page                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ uses
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    FEATURE COMPONENTS                       │
│  src/features/*/components/                                 │
│  ├── BrandManagement      ← Quản lý brands                 │
│  ├── UserManagement       ← Quản lý users                  │
│  ├── ProductManagement    ← Quản lý products               │
│  ├── Cart                 ← Shopping cart                  │
│  └── OrderForm            ← Order form                     │
│                                                             │
│  Purpose: Business-specific components cho từng feature    │
│  Reuse: Chỉ trong feature đó                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ uses
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              SHARED BUSINESS COMPONENTS                     │
│  src/components/shared/                                     │
│  ├── CRUDManagement       ← Generic CRUD manager           │
│  ├── DataTable            ← Table with actions             │
│  ├── Pagination           ← Pagination control             │
│  ├── SearchBar            ← Search input                   │
│  ├── ConfirmDialog        ← Confirmation dialog            │
│  ├── FormDialog           ← Form dialog wrapper            │
│  └── PageHeader           ← Page header                    │
│                                                             │
│  Purpose: Business logic components dùng chung             │
│  Reuse: Across all features trong project này             │
│  Has: Business logic, state management, data handling      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ uses
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  UI PRIMITIVE COMPONENTS                    │
│  src/components/ui/  (from shadcn/ui)                      │
│  ├── button.tsx           ← Styled button                  │
│  ├── table.tsx            ← Styled table                   │
│  ├── dialog.tsx           ← Modal dialog                   │
│  ├── input.tsx            ← Styled input                   │
│  ├── badge.tsx            ← Styled badge                   │
│  ├── card.tsx             ← Styled card                    │
│  └── ...50+ more                                           │
│                                                             │
│  Purpose: Generic UI primitives với styling                │
│  Reuse: Any React project                                  │
│  Has: ONLY presentation, NO business logic                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ uses
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      HTML ELEMENTS                          │
│  <button>, <table>, <input>, <div>, <span>, etc.          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Example: User Management

```
USER CLICKS "Xóa User"
        │
        ↓
┌─────────────────────────────────────────┐
│ UserManagement.tsx                      │  ← Feature Component
│ (features/users/components/)            │
│                                         │
│ - Gọi API xóa user                     │
│ - Hiển thị toast notification          │
│ - Refresh data                         │
└─────────────────────────────────────────┘
        │ renders
        ↓
┌─────────────────────────────────────────┐
│ CRUDManagement                          │  ← Shared Component
│ (components/shared/)                    │
│                                         │
│ - Quản lý dialogs state                │
│ - Xử lý form submissions               │
│ - Show/hide confirmation               │
└─────────────────────────────────────────┘
        │ renders
        ↓
┌─────────────────────────────────────────┐
│ DataTable                               │  ← Shared Component
│ (components/shared/)                    │
│                                         │
│ - Map data to rows                     │
│ - Render action dropdown               │
│ - Handle loading state                 │
└─────────────────────────────────────────┘
        │ renders
        ↓
┌─────────────────────────────────────────┐
│ Table, Button, DropdownMenu             │  ← UI Components
│ (components/ui/)                        │
│                                         │
│ - Apply Tailwind styles                │
│ - Handle variants                      │
│ - Forward refs                         │
└─────────────────────────────────────────┘
        │ renders
        ↓
┌─────────────────────────────────────────┐
│ <table>, <button>, <div>                │  ← HTML
└─────────────────────────────────────────┘
```

---

## 🎨 Real Code Example

### Level 1: Feature Component

```tsx
// features/brands/components/BrandManagement.tsx
export function BrandManagement() {
  const { data, isLoading } = useQuery(['brands'], BrandsApi.getAll);
  const deleteMutation = useMutation(BrandsApi.delete);
  
  return (
    <CRUDManagement                          // ← Uses Shared Component
      resourceName="Thương hiệu"
      data={data}
      isLoading={isLoading}
      onDelete={(id) => deleteMutation.mutate(id)}
      // ... more props
    />
  );
}
```

### Level 2: Shared Business Component

```tsx
// components/shared/CRUDManagement.tsx
export function CRUDManagement({ data, onDelete, ... }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  return (
    <Card>                                   // ← Uses UI Component
      <DataTable                             // ← Uses Shared Component
        data={data}
        actions={[
          { label: "Xóa", onClick: () => setIsDeleteOpen(true) }
        ]}
      />
      <ConfirmDialog                         // ← Uses Shared Component
        open={isDeleteOpen}
        onConfirm={onDelete}
      />
    </Card>
  );
}
```

### Level 3: Shared Component (với logic)

```tsx
// components/shared/DataTable.tsx
export function DataTable({ data, actions }) {
  if (isLoading) return <Loader2 />;        // ← Business logic
  
  return (
    <Table>                                  // ← Uses UI Component
      <TableHeader>                          // ← Uses UI Component
        <TableRow>                           // ← Uses UI Component
          <TableHead>Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(item => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>
              <DropdownMenu>               // ← Uses UI Component
                {actions.map(action => (
                  <DropdownMenuItem 
                    onClick={() => action.onClick(item)}
                  >
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### Level 4: UI Primitive Component (NO logic)

```tsx
// components/ui/table.tsx (from shadcn/ui)
export const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
// ☝️ Chỉ có styling, KHÔNG có business logic
```

---

## 📊 Comparison Matrix

| Aspect | UI Components | Shared Components | Feature Components |
|--------|---------------|-------------------|-------------------|
| **Location** | `components/ui/` | `components/shared/` | `features/*/components/` |
| **Source** | shadcn/ui | Custom | Custom |
| **Logic** | ❌ None | ✅ Generic business | ✅ Feature-specific |
| **State** | ❌ Stateless | ✅ Can have state | ✅ Has state |
| **Reusability** | 🌍 Universal | 🏢 Project-wide | 📦 Feature-only |
| **Dependencies** | HTML only | UI components | Shared + UI |
| **Example** | Button, Table | DataTable, CRUD | BrandManagement |
| **Styling** | ✅ Tailwind | ✅ Tailwind | ✅ Tailwind |
| **Testing** | Visual | Logic + Visual | Integration |
| **Update from** | shadcn/ui | Business needs | Feature needs |

---

## 🎯 When to Use What?

### Use `components/ui/`
```tsx
✅ <Button>Click me</Button>
✅ <Input placeholder="Search" />
✅ <Card><CardHeader>Title</CardHeader></Card>
```

### Use `components/shared/`
```tsx
✅ <DataTable data={users} actions={actions} />
✅ <Pagination currentPage={1} totalPages={10} />
✅ <SearchBar value={query} onChange={setQuery} />
```

### Use `features/*/components/`
```tsx
✅ <BrandManagement />
✅ <ProductManagement />
✅ <UserManagement />
```

---

## 🚫 Anti-patterns

### ❌ WRONG: Business logic in UI components

```tsx
// ❌ components/ui/user-table.tsx
export function UserTable() {
  const [users, setUsers] = useState([]);
  const deleteUser = (id) => { /* API call */ };  // ← Business logic!
  
  return <table>...</table>;
}
```

### ✅ RIGHT: Separate concerns

```tsx
// ✅ components/ui/table.tsx
export function Table({ children }) {
  return <table>{children}</table>;  // ← Only presentation
}

// ✅ components/shared/DataTable.tsx
export function DataTable({ data, onDelete }) {
  return (
    <Table>
      {data.map(item => (
        <tr onClick={() => onDelete(item.id)}>  // ← Business logic
          ...
        </tr>
      ))}
    </Table>
  );
}
```

---

## 🔗 Dependencies Flow

```
features/*/components/
    ↓ imports
components/shared/
    ↓ imports
components/ui/
    ↓ imports
HTML elements
```

**Rule:** 
- ✅ Lower level can be imported by higher level
- ❌ Higher level CANNOT be imported by lower level
- ❌ ui/ NEVER imports from shared/
- ✅ shared/ CAN import from ui/

---

## 📦 File Organization

```
src/
├── components/
│   ├── ui/              ← Level 1: Primitives (from shadcn/ui)
│   │   ├── button.tsx
│   │   ├── table.tsx
│   │   └── ...
│   │
│   ├── shared/          ← Level 2: Business (custom)
│   │   ├── DataTable.tsx
│   │   ├── CRUDManagement.tsx
│   │   └── ...
│   │
│   ├── Blog.tsx         ← Landing page components
│   ├── Footer.tsx
│   └── Header.tsx
│
├── features/            ← Level 3: Feature-specific
│   ├── brands/
│   │   └── components/
│   │       └── BrandManagement.tsx
│   ├── users/
│   │   └── components/
│   │       └── UserManagement.tsx
│   └── ...
│
└── pages/               ← Level 4: Pages
    ├── AdminPage.tsx
    └── Index.tsx
```

---

## ✨ Benefits of This Architecture

1. **Separation of Concerns** ✅
   - UI = Presentation
   - Shared = Business logic
   - Features = Feature-specific

2. **Reusability** ✅
   - UI: Dùng ở mọi project
   - Shared: Dùng ở mọi feature
   - Features: Dùng trong feature đó

3. **Maintainability** ✅
   - Sửa 1 shared component → apply cho tất cả
   - Update shadcn/ui → không ảnh hưởng business logic

4. **Testability** ✅
   - Test UI: Visual testing
   - Test Shared: Logic testing
   - Test Features: Integration testing

5. **Scalability** ✅
   - Thêm feature mới: Dùng lại shared components
   - Thêm shared component: Dùng lại ui components

---

## 📚 Further Reading

- [UI_VS_SHARED.md](./UI_VS_SHARED.md) - Chi tiết sự khác biệt
- [SHARED_COMPONENTS.md](./SHARED_COMPONENTS.md) - Hướng dẫn shared components
- [REFACTORING_PLAN.md](./REFACTORING_PLAN.md) - Kế hoạch refactor
- [shadcn/ui docs](https://ui.shadcn.com) - UI components documentation
