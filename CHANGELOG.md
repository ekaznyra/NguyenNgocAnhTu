# 📜 Nhật ký thay đổi (CHANGELOG)

Tất cả phiên bản đều đồng bộ trên **8/8 định dạng proxy**:
Shadowrocket · LanceX · Egern · Surge · Loon · Quantumult X · Stash · Premium.

---

## `v2.8.2-stable` (2026-08-27)

- **Sửa lỗi 404 do sai tên file** (gây hỏng Busuu/Meitu trên 6/8 client):
  `bussu.js → busuu.js` và `MeiTuXiuXiu.js → meitu.js` trên Egern/LanceX/Loon/QX/Stash/Surge.
- **Sửa lỗi 404 do sai hoa/thường** trên Premium/Shadowrocket (10 script: `AlightMotion.js`,
  `BeautyPlus.js`, `camScanner.js`, `iTunes.js`, `Kinemaster.js`, `PicsArt.js`, `Snow.js`,
  `TrueCaller.js`, `VSCO.js`, `Wink.js`) — GitHub raw phân biệt hoa/thường.
- Chuẩn hóa ngày hết hạn `9999 → 2099` cho `busuu.js`, `funimate.js`, `djay.js`,
  `headspace.js`, `TrueCaller.js` (đồng nhất claim "hết hạn 2099").
- Bổ sung `api.spotify.com` vào MITM/force-http-engine-hosts cho **đủ 8/8 module**
  (Loon/QX trước đó thiếu hẳn → Spotify JS không bắt được). Siết guard `spotify.js`
  (`identity/v3/me` chỉ patch khi có `type`/`product`/`id`), fix guard `PicsArt.js`
  (`$request` null-safe).
- **Siết trình validate**: thêm bước `[js]` kiểm tra mọi script `Module/js/*.js` tham
  chiếu trong module phải tồn tại trên đĩa **đúng phân biệt hoa/thường** — chặn triệt để
  lớp lỗi typo (`bussu`/`MeiTu`) và sai case lọt qua trước đây (đã test âm bắt được `Busuu.js`).
- **Spotify Premium cache-bust**: xoá `If-None-Match`/`If-Modified-Since`/`ETag` cho
  `api.spotify.com/v1/me` và `.../identity/v3/me` trên **cả 8/8 module** — đảm bảo patch
  premium không bị app phục vụ từ cache `304` làm mất hiệu lực unlock:
  - Họ Surge (Premium/Shadowrocket/LanceX/Surge) & Loon: `[Header Rewrite]` `header-del`.
  - Egern: `header_rewrites` `action: del`.
  - Quantumult X: `url request-header` strip validator.
  - Stash: xử lý trong `spotify.js` (set `Cache-Control: no-store`, xoá `ETag` response).
- **Parity MITM**: thêm `gads.current.spotify.com` vào MITM của 6 module còn thiếu
  (LanceX/Surge/Egern/Loon/QX/Stash) để chặn ad Spotify đồng bộ; sửa Egern ghi nhầm
  `api.picsart.c*` → `api.picsart.com` + `api.picsart.cn` (PicsArt Gold không bị hỏng trên Egern).

## `v2.8.1-stable` (2026-08-13)

- Đồng bộ toàn bộ 8 module lên `2.8.1-stable`.
- Chuẩn hóa ngày hết hạn premium (RevenueCat / iTunes) về mốc **2099**.
- Công cụ `scripts/validate.py` chạy ổn định trên mọi môi trường (đã sửa lỗi
  UnicodeEncodeError trên Windows).
- README khớp với version thực tế của module.
- **Sửa Spotify không có Premium**: thêm `Module/js/spotify.js` (JSON-only, không cần
  global `protobuf`) patch `api.spotify.com/v1/me` và `spclient.../identity/v3/me`,
  wire vào cả 8 module + bổ sung `api.spotify.com` vào MITM/force-http-engine-hosts.
  Fix lỗi script `spotify-proto.js` (app2smile) nổ lỗi im lặng trên client thiếu `protobuf`.

## `v2.8.0-stable` (2026-08-03)

- Thêm `Gaming_Direct.list` (20+ game/platform đi DIRECT giảm ping).
- Thêm `Streaming_Proxy.list` (Netflix, Disney+, HBO, Prime Video, Hulu, Crunchyroll).
- Mở rộng chặn iOS OTA (appldnld, swcdn, xp.apple.com) & App Store Search Ads.
- Chặn Spotify Podcast Ads & Canvas, 13 domain QC app VN.
- 11 RevenueCat app mapping cụ thể.

## `v2.7.0-stable` (2026-07-25)

- Sửa triệt để MITM OldRoll Camera, mở rộng Remini/PhotoRoom/ELSA/Bazaart.
- Khai tử cú pháp Surge-only trong Shadowrocket.

## `v2.6.0-stable` (2026-07-25)

- Tích hợp 27 standalone scripts tự host (CamScanner, VSCO, Meitu, Wink, …).

## `v2.3.0-stable` (2026-07-21)

- Ghim commit SHA toàn bộ script bên thứ ba (chống chuỗi cung ứng).
- Thêm validator + GitHub Actions CI.
- Thêm `CONTRIBUTING.md` / `CHANGELOG.md` / `CODE_OF_CONDUCT.md` / `.gitignore`.
