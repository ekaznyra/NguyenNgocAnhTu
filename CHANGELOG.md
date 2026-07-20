# 📝 Nhật ký thay đổi (Changelog)

Mọi thay đổi đáng chú ý của dự án được ghi lại tại đây.

Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/vi/1.0.0/),
và dự án tuân theo [Semantic Versioning](https://semver.org/lang/vi/).

## [2.4.0-stable] — 2026-07-21

### 🔥 Mở rộng app hot quốc tế (RevenueCat)
- Nâng cấp script tự host `revenuecat_multi.js`:
  - Fallback cho app chưa map giờ cấp quyền dưới **17 entitlement key phổ biến**
    (`pro`, `premium`, `plus`, `Pro`, `Premium`, `Plus`, `vip`, `VIP`, `unlimited`,
    `standard`, `gold`, `lifetime`, `all_access`, `premium_access`, `pro_access`,
    `isPremium`, `premiumUser`) thay vì chỉ `pro`.
  - Đồng thời **kích hoạt & gia hạn mọi entitlement mà server đã định nghĩa sẵn**
    → phủ đúng cả các app dùng entitlement key riêng.
  - Nhờ đó tự động mở khoá thêm nhiều app RevenueCat hot quốc tế (Structured,
    Gentler Streak, Flighty, Retake…) **mà không cần thêm script riêng và không gây
    xung đột endpoint** (mọi app RC đều đi qua cùng một handler).
  - **Giữ nguyên 100%** hành vi Locket Gold (vẫn chỉ cấp entitlement `Gold`).
- Vì tất cả 7 module đều tham chiếu cùng script này nên thay đổi có hiệu lực đồng bộ
  trên cả 7 nền tảng.

### ✨ Nhất quán
- Đồng bộ phiên bản tất cả module lên `2.4.0-stable`.

## [2.3.0-stable] — 2026-07-21

### 🔒 Bảo mật (Security)
- **Ghim commit SHA cho toàn bộ script bên thứ ba** trên cả 7 module
  (Surge, Loon, LanceX, Quantumult X, Stash, Egern, Shadowrocket) — trước đây
  chỉ module Shadowrocket được ghim. Điều này giảm rủi ro chuỗi cung ứng khi
  script chạy trên traffic đã giải mã (receipt/token). Tổng cộng **267** tham
  chiếu được chuyển từ nhánh di động `master`/`main` sang commit SHA cố định.
  - Ngoại lệ có chủ đích: script tự host `ekaznyra/NguyenNgocAnhTu` giữ nhánh
    `master` (do tác giả kiểm soát) và `Alex0510/Eric` (caml.js — chưa xác định
    được SHA ổn định).

### ✨ Nhất quán (Consistency)
- **Đồng nhất phiên bản** tất cả module về `2.3.0-stable` (trước đây lệch giữa
  `2.2.0` và `2.2.1`).
- **Shadowrocket (`Premium.module`)**: bổ sung **Sub-Store** cho đồng bộ tính năng
  với Surge/Loon (đây là khác biệt tính năng thực sự duy nhất còn lại). Sub-Store
  dùng nguồn release chính thức và không cần thêm host MITM.
- Chuẩn hoá segment nhánh của URL WPS (`Master` → SHA) để tránh lỗi phân biệt
  hoa/thường của GitHub raw.

### 🛠️ Hạ tầng (Tooling / CI)
- Thêm `scripts/validate.py` — kiểm tra: đồng nhất phiên bản, JSON `argument`
  hợp lệ, rule không trùng, chính sách ghim SHA, và file tài liệu tồn tại.
- Thêm workflow GitHub Actions `.github/workflows/ci.yml` chạy validator trên
  mỗi push/PR.

### 📚 Tài liệu (Docs)
- Thêm `CONTRIBUTING.md`, `CHANGELOG.md`, `CODE_OF_CONDUCT.md`, `.gitignore`.
- Thêm mẫu Issue/PR trong `.github/`.
- Sửa liên kết hỏng trong README (trỏ tới `CONTRIBUTING.md` nhưng file chưa tồn
  tại) và các liên kết tài liệu khác.
- Sửa số liệu sai: **"8 Nền Tảng" → "7 Nền Tảng"** (dự án hỗ trợ đúng 7 app proxy).

---

> Các phiên bản trước 2.3.0 được tổng hợp trong mục **"Cập nhật mới nhất"** của
> [README](README.md).
