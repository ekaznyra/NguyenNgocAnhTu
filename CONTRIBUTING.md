# 🤝 Hướng Dẫn Đóng Góp (Contributing Guidelines)

Cảm ơn bạn đã quan tâm đóng góp cho dự án **Nguyễn Ngọc Anh Tú Premium**!

---

## 📋 Quy Định Đóng Góp

1. **Tuân thủ quy chuẩn Module Shadowrocket / Client:**
   - Không sử dụng dấu trừ `-` trong `[MITM]` hostname của Shadowrocket.
   - Tránh dùng dấu chấm `.` trong tên khóa script dưới phần `[Script]`.
   - Bắt buộc khai báo REJECT cho UDP (QUIC) với `googlevideo.com` và `youtubei.googleapis.com` trong `[Rule]`.
   - Giữ các quy tắc xóa cache headers (`X-RevenueCat-ETag`, `If-None-Match`, `If-Modified-Since`).

2. **Quy trình gửi Pull Request (PR):**
   - Fork kho lưu trữ về tài khoản của bạn.
   - Tạo nhánh mới cho tính năng hoặc sửa lỗi (`git checkout -b feature/amazing-feature`).
   - Kiểm tra linter bằng script `python scripts/validate.py`.
   - Gửi Pull Request mô tả chi tiết thay đổi.

---

Cảm ơn bạn đã chung tay làm dự án ngày càng hoàn thiện hơn! 🌸
