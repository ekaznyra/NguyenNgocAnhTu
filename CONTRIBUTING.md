# 🤝 Đóng góp (CONTRIBUTING)

Cảm ơn bạn quan tâm đến dự án **NguyenNgocAnhTu**!

## Quy tắc chung
- Mọi thay đổi script tự host trong `Module/js/` phải giữ nguyên phân biệt hoa/thường
  của tên file (GitHub raw phân biệt hoa/thường, sai sẽ gây lỗi 404).
- Script bên thứ ba (app2smile, Marol62926, …) **bắt buộc ghim commit SHA** 40 ký tự,
  không dùng nhánh `master`/`main` trực tiếp (xem `PIN_EXEMPT_OWNERS` trong `validate.py`
  — chỉ script tự host của `ekaznyra` được miễn).
- Giữ **version đồng bộ** trên cả 8 module (`Premium`, `Shadowrocket`, `LanceX`, `Surge`,
  `Loon`, `QuantumultX`, `Stash`, `Egern`).

## Quy trình
1. Fork repo và tạo branch tính năng.
2. Chỉnh sửa, sau đó chạy kiểm tra cục bộ:
   ```bash
   python3 scripts/validate.py
   ```
   Mọi bước phải đạt (`EXIT=0`) trước khi tạo PR.
3. Cập nhật `CHANGELOG.md` với phiên bản mới (tăng bản `x.y.z-stable`).
4. Tạo Pull Request mô tả rõ thay đổi.

## Báo lỗi
Mở Issue kèm: client đang dùng, log lỗi (đổi thông tin nhạy cảm), và bước tái hiện.
