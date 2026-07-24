# Project Rules - NguyenNgocAnhTu

## 1. Xưng hô với Người dùng
- Luôn xưng hô với người dùng là **Tú**.

## 2. Quy tắc Định dạng & Cú pháp Module Shadowrocket (.module)
- **Cấm dùng cú pháp Surge-only trong MITM**: KHÔNG dùng tiền tố dấu trừ `-` trong danh sách `hostname` (ví dụ: `-redirector*.googlevideo.com` là không hợp lệ trên Shadowrocket). Dùng danh sách domain chuẩn như `*.googlevideo.com, www.youtube.com, s.youtube.com, youtubei.googleapis.com`.
- **Tên Script trong `[Script]`**: Tránh dùng dấu chấm `.` trong tên khóa script (ví dụ: dùng `YouTube_Premium` thay vì `youtube.response`).
- **Ép kết nối YouTube HTTPS (Chặn QUIC)**: Luôn khai báo luật chặn UDP cho `googlevideo.com` và `youtubei.googleapis.com` trong phần `[Rule]` để ép YouTube dùng TCP HTTPS giải mã MITM.
- **Xóa Cache Validators ở Request**: Luôn thêm `header-del` xóa `If-None-Match`, `If-Modified-Since` và `X-RevenueCat-ETag` để tránh lỗi HTTP 304 khi tiêm dữ liệu Premium cho Locket Gold và Spotify.
