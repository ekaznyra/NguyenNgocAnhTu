# 📜 Changelog — Nguyễn Ngọc Anh Tú Premium

Tất cả những thay đổi quan trọng của dự án sẽ được ghi nhận tại đây.

---

## [2.8.0-stable] - 2026-08-03
### 🎮 Added
- **Gaming DIRECT Rule-Set:** Tạo `Rules/Gaming_Direct.list` với 20+ game/platform (Garena, Liên Quân, Free Fire, PUBG Mobile, Genshin Impact, Mobile Legends, Roblox, COD Mobile, Steam, Epic Games, Riot Games...) → kết nối DIRECT giảm ping.
- **Streaming PROXY Rule-Set:** Tạo `Rules/Streaming_Proxy.list` hỗ trợ Netflix, Disney+, HBO Max, Amazon Prime Video, Hulu, Crunchyroll, Apple TV+ → đi qua PROXY để xem nội dung vùng khác.
- **GeoIP VN DIRECT:** Thêm `GEOIP,VN,DIRECT` — tất cả traffic đến server Việt Nam kết nối trực tiếp.
- **Spotify Podcast Ads & Canvas Blocking:** Chặn 4 domain podcast ads CDN (`audio-sp-*.pscdn.co`) + `podcastads.spotify.com`. Thêm URL Rewrite chặn Spotify Canvas & Storylines.
- **iOS OTA Update Blocking (Triệt để):** Bổ sung `appldnld.apple.com`, `swcdn.apple.com`, `xp.apple.com` — chặn triệt để thông báo cập nhật iOS.
- **App Store Search Ads Blocking:** Chặn `searchads.apple.com`, `iad.apple.com`, `iadsdk.apple.com`.
- **VN In-App Ads Blocking:** Thêm 13 domain QC in-app Việt Nam (Zalo, Báo Mới, VnExpress, Zing, Kenh14, 24h, Dân Trí, Thanh Niên, Tuổi Trẻ).
- **RevenueCat App Mapping:** Thêm 11 app mapping cụ thể (Remini, PhotoRoom, ELSA, Bazaart, Splice, Facetune, Mojo, Prequel, 24FPS, Unfold, Videoleap) cho entitlement delivery chính xác hơn.
- **Firebase/Apple/Amazon Tracking:** Bổ sung 15+ domain tracking mới (Firebase Installations, Apple Advertising, Amazon Device Metrics...).

### 🔄 Synced
- **All 8 Clients Synced:** Đồng bộ tất cả module lên v2.8.0-stable (Premium.module, Loon.plugin, Surge.sgmodule, LanceX.module, Stash.stoverride, Egern.yaml, QuantumultX.snippet).

### ⚡ Performance
- Không thêm hostname MITM mới — tất cả rule mới đều là REJECT/DIRECT (zero overhead).

---

## [2.7.0-stable] - 2026-07-25
### 🚀 Added & Improved
- **YFamily Standards Integration:** Đồng bộ 100% tiêu chuẩn từ YFamily (`https://yfamilys.com/` - `deezertidal`).
- **Remini, PhotoRoom, ELSA Speak, Bazaart, OldRoll:** Bổ sung host pattern & giải mã MITM cho các app làm nét AI, tách nền, học tiếng Anh AI & camera retro.
- **Shadowrocket Fix:** Khai tử toàn bộ tiền tố `-` Surge-only trong danh sách MITM `hostname` trên Shadowrocket.
- **OldRoll MITM Fix:** Thêm `com.zijayrate.analogcam` vào `[MITM]` hostname và `force-http-engine-hosts`.
- **All Clients Synced:** Đồng bộ 8/8 client proxy formats (`Premium.module`, `Shadowrocket.module`, `Surge.sgmodule`, `Loon.plugin`, `QuantumultX.snippet`, `Stash.stoverride`, `LanceX.module`, `Egern.yaml`).

---

## [2.6.0-stable] - 2026-07-25
### 💎 Added
- **27 Standalone Scripts:** Tích hợp bộ 27 script tự host độc lập cho CamScanner, VSCO, Meitu, Wink, BeautyPlus, Truecaller, Photomath, Alight Motion, KineMaster, XMind, Busuu, djay Pro, Headspace, PicsArt, Photoshop Express, Emby, SoundCloud, WPS Office, Darkroom, Fimo, Calm...
- **DoH Encrypted DNS:** Mã hóa DNS với DoH AdGuard Primary & ControlD Fallback (`p2`).

---

## [2.4.5-stable] - 2026-07-21
### 🧹 Cleaned
- Gỡ bỏ ứng dụng CARROT Weather do backend herokuapp đã ngừng hoạt động.
- Dọn dẹp `always-real-ip` và chuẩn hóa WebRTC anti-leak rules.
