# 📜 Changelog — Nguyễn Ngọc Anh Tú Premium

Tất cả những thay đổi quan trọng của dự án sẽ được ghi nhận tại đây.

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
