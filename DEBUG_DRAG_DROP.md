# Debug Drag & Drop Image Upload

## Cách kiểm tra

### 1. Mở Console (F12)
- Nhấn F12 hoặc Ctrl+Shift+I
- Chọn tab "Console"
- Clear console (Ctrl+L hoặc nút Clear)

### 2. Tải lại trang
Bạn sẽ thấy logs:
```
✅ RichTextEditor mounted
🔧 RichTextEditor: Setting up drag/drop listeners
```

### 3. Kiểm tra Debug Panel
- Phía trên editor sẽ có một panel màu vàng với:
  - `isDragging` state
  - `dialogOpen` state
  - Nút "Test Handler"

### 4. Test Drag & Drop
Khi kéo file vào editor, bạn sẽ thấy log:

```
📄 Document level event: dragover Inside editor: true Has files: ["Files"]
✅ Letting editor handlers manage this event
🎯 handleDrag called: dragover
   ├─ hasFiles: true
   └─ isDragging state: false
   ✅ Setting isDragging = true
```

Khi thả file:
```
🎯 handleDrop called!
✅ File dropped: { name: "...", type: "image/...", size: ... }
📂 handleFileSelect called: filename.jpg
✅ File validation passed, creating preview...
✅ Preview image ready
📝 Dialog should be opening now...
```

### 5. Các trường hợp lỗi có thể xảy ra:

#### Không thấy log "handleDrag called"
➡️ **Nguyên nhân:** Event handlers không được gắn
- Kiểm tra xem `editorRef.current` có null không
- Kiểm tra xem có component nào wrap editor và chặn events không

#### Thấy log "handleDrag" nhưng hasFiles = false
➡️ **Nguyên nhân:** Không phải file được kéo vào
- Chỉ kéo file từ File Explorer, không phải từ browser
- Đảm bảo kéo IMAGE file (png, jpg, webp, gif)

#### Thấy "handleDrag" nhưng không thấy "handleDrop"
➡️ **Nguyên nhân:** Drop event bị chặn
- Kiểm tra console có log "Preventing default" không
- Có thể có overlay đang che textarea

#### Thấy "handleDrop" nhưng không mở dialog
➡️ **Nguyên nhân:** File không hợp lệ hoặc state không update
- Xem log validation
- Kiểm tra xem file có phải image không

### 6. Test thủ công
Nhấn nút "Test Handler" trong debug panel để xem:
- `editorRef.current` có tồn tại không
- State hiện tại của isDragging và dialog

## Các vấn đề đã biết

1. **Browser extension chặn drag drop** - Disable extensions
2. **Antivirus software** - Có thể chặn file access
3. **React strict mode** - Có thể gây double mount trong dev

## Nếu vẫn không hoạt động

Gửi cho tôi screenshot của:
1. Console logs (toàn bộ)
2. Debug panel (panel màu vàng)
3. Network tab (nếu có lỗi network)
