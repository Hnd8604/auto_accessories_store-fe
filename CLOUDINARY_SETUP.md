# Hướng dẫn cấu hình Cloudinary Upload Preset

## Bước 1: Tạo Unsigned Upload Preset

Để cho phép frontend tải ảnh trực tiếp lên Cloudinary mà không cần expose API secret, bạn cần tạo một **Unsigned Upload Preset**.

### Các bước thực hiện:

1. **Đăng nhập vào Cloudinary Dashboard**
   - Truy cập: https://cloudinary.com/console
   - Đăng nhập với tài khoản của bạn (Cloud name: `dsgftzhzt`)

2. **Mở Settings > Upload**
   - Click vào biểu tượng ⚙️ (Settings) ở góc trên bên phải
   - Chọn tab **Upload**
   - Cuộn xuống phần **Upload presets**

3. **Tạo Upload Preset mới**
   - Click nút **Add upload preset**
   - Cấu hình như sau:
     ```
     Preset name: ml_default (hoặc tên tùy chọn)
     Signing Mode: Unsigned ⚠️ (quan trọng!)
     Folder: store/posts/content (hoặc để trống)
     ```

4. **Cấu hình bổ sung (tùy chọn)**
   - **Allowed formats**: jpg, png, gif, webp
   - **Max file size**: 10485760 (10MB)
   - **Transformation**: Có thể thêm resize tự động nếu muốn
   - **Auto tagging**: Bật nếu muốn tự động tag ảnh

5. **Lưu lại**
   - Click **Save**
   - Copy tên preset (ví dụ: `ml_default`)

## Bước 2: Cập nhật cấu hình Frontend

Mở file `src/constants/config.ts` và cập nhật:

```typescript
export const CLOUDINARY_CONFIG = {
  cloudName: "dsgftzhzt",
  uploadPreset: "ml_default", // ← Thay bằng tên preset vừa tạo
};
```

## Bước 3: Kiểm tra

1. Mở trang tạo/sửa bài viết
2. Trong phần **Nội dung bài viết**, thử:
   - Kéo thả ảnh vào vùng soạn thảo
   - Hoặc click nút Image → tab "Tải lên" → chọn file

3. Ảnh sẽ được tự động upload lên Cloudinary và URL sẽ được chèn vào markdown

## Lưu ý bảo mật

### Phương án hiện tại (Unsigned Upload):
- ✅ Đơn giản, dễ triển khai
- ⚠️ Bất kỳ ai cũng có thể upload lên preset này nếu biết tên
- 💡 Phù hợp cho môi trường development

### Phương án nâng cao (Signed Upload qua Backend):
Để bảo mật hơn trong production, nên sử dụng backend để ký upload request:

1. Tạo endpoint backend mới: `POST /api/v1/cloudinary/signature`
2. Backend sẽ generate signature với secret key
3. Frontend gọi API này trước khi upload
4. Cập nhật `CloudinaryApi.uploadImage()` để sử dụng signed upload

## Troubleshooting

### Lỗi "Invalid upload preset"
- Kiểm tra lại tên preset trong `config.ts`
- Đảm bảo preset đã được set là **Unsigned**

### Lỗi "Upload failed"
- Kiểm tra kích thước file (max 10MB)
- Kiểm tra định dạng file (jpg, png, gif, webp)
- Xem Network tab trong DevTools để biết lỗi chi tiết

### Ảnh upload nhưng không hiển thị
- Kiểm tra console có lỗi CORS không
- Đảm bảo URL trả về từ Cloudinary là `https://`

## Tài liệu tham khảo

- Cloudinary Upload Presets: https://cloudinary.com/documentation/upload_presets
- Unsigned Upload: https://cloudinary.com/documentation/upload_images#unsigned_upload
