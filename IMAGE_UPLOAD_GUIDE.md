# Hướng dẫn sử dụng Upload ảnh Cloudinary trong Post Content

## Tổng quan

Tính năng upload ảnh vào nội dung bài viết đã được tích hợp với Cloudinary. Người dùng có thể:
- ✅ Kéo thả ảnh trực tiếp vào vùng soạn thảo
- ✅ Upload ảnh từ máy tính qua dialog
- ✅ Nhập URL ảnh có sẵn
- ✅ Ảnh tự động upload lên Cloudinary và trả về URL

## Cách sử dụng

### 1. Kéo thả ảnh (Drag & Drop)

Khi soạn thảo nội dung bài viết:

1. Kéo file ảnh từ máy tính
2. Thả vào vùng soạn thảo (textarea)
3. Ảnh sẽ tự động:
   - Upload lên Cloudinary
   - Hiển thị progress
   - Chèn markdown vào vị trí con trỏ

**Ưu điểm**: Nhanh nhất, không cần mở dialog

### 2. Upload qua Dialog

Trong toolbar của editor:

1. Click nút 📷 (Image)
2. Chọn tab "Tải lên"
3. Click vào khu vực upload hoặc drag & drop
4. Ảnh tự động upload và chèn vào

**Ưu điểm**: Rõ ràng, dễ sử dụng

### 3. Nhập URL ảnh có sẵn

Nếu đã có URL ảnh trên internet:

1. Click nút 📷 (Image)
2. Chọn tab "URL"
3. Nhập URL, alt text, caption (tùy chọn)
4. Click "Chèn ảnh"

**Ưu điểm**: Không cần upload, sử dụng ảnh đã có

## Giới hạn

- **Định dạng**: PNG, JPG, WEBP, GIF
- **Kích thước**: Tối đa 10MB
- **Folder Cloudinary**: `store/posts/content`

## Kết quả

Sau khi upload thành công, markdown sẽ được chèn vào nội dung:

```markdown
![image-name](https://res.cloudinary.com/dsgftzhzt/image/upload/v1234567890/store/posts/content/abc123.jpg)
```

Khi xem bài viết, ảnh sẽ hiển thị đầy đủ với:
- Responsive design
- Shadow và border radius
- Lazy loading

## Cấu hình (Admin)

Để tính năng hoạt động, cần cấu hình Cloudinary Upload Preset:

👉 Xem chi tiết trong file: [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md)

## Technical Details

### Files đã thay đổi

1. **`src/services/cloudinary.ts`** (mới)
   - CloudinaryApi với các phương thức upload
   - Validation file type và size

2. **`src/components/shared/RichTextEditor.tsx`**
   - Thêm drag & drop handlers
   - Upload progress indicator
   - Dialog cải tiến với tabs

3. **`src/constants/config.ts`**
   - Thêm CLOUDINARY_CONFIG

### Luồng xử lý

```
User action → File selection/drop
     ↓
Validation (type, size)
     ↓
Upload to Cloudinary API
     ↓
Receive secure_url
     ↓
Insert markdown to content
     ↓
User sees image in preview
```

## Demo Usage

```typescript
// RichTextEditor tự động xử lý, không cần code thêm
<RichTextEditor
  value={content}
  onChange={setContent}
  placeholder="Viết nội dung..."
/>
```

## Troubleshooting

### Ảnh không upload được
1. Kiểm tra preset đã cấu hình chưa
2. Xem console log để biết lỗi
3. Kiểm tra network tab (status 400/401/403)

### Ảnh upload nhưng không hiển thị trong preview
- Kiểm tra markdown syntax
- Thử refresh lại trang

### Lỗi "Invalid upload preset"
- Preset chưa được tạo hoặc tên sai
- Xem [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md)

## Bảo mật

⚠️ **Lưu ý**: Hiện tại đang dùng unsigned upload preset

Trong môi trường production, nên:
- Chuyển sang signed upload qua backend
- Thêm rate limiting
- Validate file tại backend

Xem phần "Bảo mật" trong [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md)
