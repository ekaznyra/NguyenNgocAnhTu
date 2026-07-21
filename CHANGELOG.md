# 📝 Nhật ký thay đổi (Changelog)

Mọi thay đổi đáng chú ý của dự án được ghi lại tại đây.

Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/vi/1.0.0/),
và dự án tuân theo [Semantic Versioning](https://semver.org/lang/vi/).

## [2.4.5-stable] — 2026-07-21

### 🧹 Gỡ app chết + dọn cấu hình
- **Gỡ hoàn toàn CARROT Weather** khỏi **cả 7 module** (handler/script + host
  `[MITM]`). Backend chạy trên `carrotweather.herokuapp.com` — hạ tầng Heroku free
  dyno đã bị khai tử → handler này là **mã chết**. Số host MITM: 75 → 74.
- **Dọn `always-real-ip`**: gỡ `*.stun.l.google.com` (Premium/Surge/LanceX). Mẫu
  này **không khớp** STUN server thật của Google (dạng `stunN.l.google.com`) nên
  vô tác dụng, lại còn ngược ý với các rule `REJECT` chống rò rỉ WebRTC ở trên.
- **Egern**: ghi rõ QUIC-block cho YouTube **không được hỗ trợ** (cú pháp
  `AND,((…),(PROTOCOL,UDP))`, giống ghi chú đã có ở Stash) để tránh hiểu nhầm là
  thiếu sót — thay vì để dòng comment trống mập mờ.

### ✨ Nhất quán
- Đồng bộ phiên bản tất cả module **7/7 → `2.4.5-stable`**.

## [2.4.4-stable] — 2026-07-21

### 🧹 Dọn dẹp (gỡ mã thừa)
- **Egern**: gỡ script `deleteHeader.js` (một `http_request` chỉ để xóa header
  `X-RevenueCat-ETag`). Header này **đã được xóa native** ở mục `header_rewrites`
  cho **cả** `api.revenuecat.com` **và** `api.rc-backup.com` → script bị **trùng
  lặp** và còn tốn 1 lần khởi động JS engine mỗi request RevenueCat.
- **Xóa hẳn file `Module/js/deleteHeader.js`**: sau khi gỡ tham chiếu ở Egern,
  file này không còn module nào dùng (dead code).
- Kết quả: hành vi **không đổi** (ETag vẫn bị xóa native), nhưng nhẹ hơn và repo
  sạch hơn.

### ✨ Nhất quán
- Đồng bộ phiên bản tất cả module **7/7 → `2.4.4-stable`**.

## [2.4.3-stable] — 2026-07-21

### 🔒 Đồng bộ chính sách DNS trên toàn bộ nền tảng khai báo DNS
- Đưa **LanceX** và **Egern** về cùng triết lý DNS với `Premium.module`:
  - Chuyển từ resolver **không lọc** (`dns.google` / `cloudflare-dns` / `quad9`)
    sang **DoH có lọc** ads/tracking/malware: `dns.adguard-dns.com` +
    `freedns.controld.com/**p2**`.
  - **Bỏ fallback `system`** (trước đây nếu DoH lỗi sẽ rơi về resolver hệ thống
    dạng plaintext → **rò rỉ DNS**). Nay mọi truy vấn đều mã hóa.
  - Dùng ControlD **p2** (Malware + Ads/Trackers), **KHÔNG p3** vì p3 chặn thêm
    Social (Facebook/Instagram/TikTok…) — mâu thuẫn mục tiêu "Tối ưu Social".
- Các module không tự khai báo DNS (Surge/Loon/Stash/Quantumult X) **giữ nguyên**:
  chúng dùng DNS của config chính do người dùng kiểm soát, không ép ghi đè.

> Ghi chú: đây là thay đổi mang tính "quan điểm" nhưng thống nhất theo lựa chọn
> tác giả đã áp dụng cho nền tảng chính (Shadowrocket). Nếu muốn ưu tiên tốc độ
> hơn lọc, có thể đổi lại resolver — chỉ cần sửa 1 dòng ở mỗi module.

### ✨ Nhất quán
- Đồng bộ phiên bản tất cả module **7/7 → `2.4.3-stable`**.

## [2.4.2-stable] — 2026-07-21

### 🔒 DNS & định tuyến an toàn hơn
- **Shadowrocket (`Premium.module`)** — gom DNS về **1 primary + 1 fallback**, cùng
  chính sách lọc (ads/tracking/malware) và **đều mã hóa (DoH)**:
  - Primary `dns.adguard-dns.com`, fallback `freedns.controld.com/**p2**`.
  - Bỏ fallback `system` (tránh **rò rỉ DNS plaintext** khi DoH lỗi) và bỏ việc
    trộn 3 resolver (2 lọc + 1 không lọc) gây kết quả không nhất quán + fanout.
  - Thêm `hijack-dns = *:53` để chống app hardcode DNS gây leak.
  - **Fix:** dùng ControlD `p2` thay vì `p3`. `p3` chặn thêm **Social**
    (Facebook/Instagram/TikTok…) → mâu thuẫn với mục tiêu "Tối ưu Social" và sẽ
    chặn nhầm app mạng xã hội mỗi khi rơi xuống fallback. `p2` chỉ lọc
    Malware + Ads/Trackers, đúng chính sách đã ghi trong comment.
- **Thứ tự rule (bảo mật thắng định tuyến):** chuyển rule-set chống lừa đảo
  (`hostsVN/threat`, `REJECT`) **lên trước** `AI_Proxy`/`Proxy` (`PROXY`) trên
  **Surge, Loon, LanceX** — đồng bộ với `Premium.module`. Nhờ đó domain độc hại
  luôn bị `REJECT` thay vì bị rule `PROXY` định tuyến chặn trước.

### ✨ Nhất quán
- Đồng bộ phiên bản tất cả module **7/7 → `2.4.2-stable`**.

## [2.4.1-stable] — 2026-07-21

### 🔥 Mở rộng thêm app hot quốc tế
- `revenuecat_multi.js`: bổ sung thêm entitlement key phổ biến
  (`member`, `membership`, `svip`, `vip_access`, `full_access`, `premium_yearly`,
  `premium_lifetime`, `unlimited_access`, `paid`, `Unlock`) → phủ thêm nhiều app hot.
- README: thêm mục hiển thị rõ danh sách app hot quốc tế được hỗ trợ qua RevenueCat
  (Structured, Gentler Streak, OneTodo, Converter, Pillow, Planny, Usage, Grow, Happy,
  Emote, Widget Art, Weather Apps…). Đã xác minh entitlement/product từ nguồn đã ghim SHA.
- Đồng bộ version 7/7 → `2.4.1-stable`.

> Ghi chú: các app này dùng entitlement phổ biến (`pro`/`premium`/`Pro`…) nên hầu hết
> đã hoạt động từ v2.4.0; bản này mở rộng thêm key và **ghi rõ danh sách** cho minh bạch.

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
