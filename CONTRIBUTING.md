# 🤝 Hướng dẫn đóng góp

Cảm ơn bạn đã quan tâm đóng góp cho dự án! Tài liệu này mô tả quy ước và quy
trình để đóng góp một cách hiệu quả và an toàn.

---

## 📋 Mục lục
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Quy trình đóng góp](#-quy-trình-đóng-góp)
- [Quy ước commit](#-quy-ước-commit)
- [Thêm / cập nhật một app unlock](#-thêm--cập-nhật-một-app-unlock)
- [Chính sách ghim commit SHA (quan trọng)](#-chính-sách-ghim-commit-sha-quan-trọng)
- [Chạy kiểm tra trước khi mở PR](#-chạy-kiểm-tra-trước-khi-mở-pr)
- [Checklist Pull Request](#-checklist-pull-request)

---

## 📁 Cấu trúc dự án

```
Module/
  NguyenNgocAnhTu_Surge.sgmodule      # Surge
  NguyenNgocAnhTu_Loon.plugin         # Loon
  NguyenNgocAnhTu_QuantumultX.snippet # Quantumult X
  NguyenNgocAnhTu_Stash.stoverride    # Stash
  NguyenNgocAnhTu_Egern.yaml          # Egern
  NguyenNgocAnhTu_LanceX.module       # LanceX
  NguyenNgocAnhTu_Premium.module      # Shadowrocket
  js/                                 # Script tự host (do repo này kiểm soát)
Rules/                                # Danh sách rule dùng chung (RULE-SET từ xa)
scripts/validate.py                   # Trình kiểm tra tính toàn vẹn (CI dùng)
```

Dự án hỗ trợ **7 ứng dụng proxy**. Khi thêm/sửa một tính năng, hãy cố gắng đồng
bộ trên **tất cả** module tương ứng để tránh lệch tính năng.

---

## 🔁 Quy trình đóng góp

1. **Fork** repo → tạo nhánh mới từ `master`.
2. Thực hiện thay đổi.
3. Chạy `python3 scripts/validate.py` (phải đạt).
4. Commit theo [quy ước commit](#-quy-ước-commit).
5. Mở **Pull Request** vào nhánh `master`, điền đầy đủ mô tả.

---

## ✍️ Quy ước commit

Dùng [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Dùng khi |
|---|---|
| `feat:` | Thêm app/tính năng mới |
| `fix:` | Sửa lỗi (script chết, regex sai, rule chặn nhầm...) |
| `chore:` | Việc phụ trợ (bump SHA, dọn dẹp) |
| `docs:` | Chỉ sửa tài liệu |
| `refactor:` | Tổ chức lại, không đổi hành vi |

Ví dụ: `feat: thêm unlock CapCut Pro` · `chore: bump SHA MarScrpt 2026-08`

---

## ➕ Thêm / cập nhật một app unlock

Khi thêm một app, cần cập nhật **đồng bộ** ở 3 chỗ trong mỗi module liên quan:

1. **Khối script** (`[Script]` / `scriptings:` / dòng `http-response`).
2. **`[MITM] hostname`** — thêm host của app (nếu thiếu, script sẽ không chạy).
3. Nếu là script mới bên thứ ba → phải **ghim commit SHA** (xem bên dưới).

Ưu tiên **tự host** script trong `Module/js/` khi có thể, và viết theo kiểu
**merge** (giữ field server, chỉ ép field quyền) thay vì ghi đè cả object — an
toàn hơn khi API đổi.

---

## 📌 Chính sách ghim commit SHA (quan trọng)

Các script này chạy trên traffic **đã được giải mã bởi MITM** (bao gồm receipt,
token). Nếu nạp từ nhánh `master`/`main` của repo bên thứ ba, nội dung có thể bị
đổi bất cứ lúc nào mà người dùng không hay biết (rủi ro chuỗi cung ứng).

**Quy tắc:** Mọi URL `raw.githubusercontent.com/<owner>/<repo>/...*.js` của bên
thứ ba **phải** dùng commit SHA 40 ký tự, **không** dùng `master`/`main`.

```diff
- script-path=https://raw.githubusercontent.com/owner/repo/main/foo.js
+ script-path=https://raw.githubusercontent.com/owner/repo/<commit-sha-40-ký-tự>/foo.js
```

**Ngoại lệ được phép** (validator bỏ qua):
- `ekaznyra/NguyenNgocAnhTu` — script tự host, do repo này kiểm soát.
- `Alex0510/Eric` (caml.js) — chưa có SHA ổn định; theo dõi để ghim sau.

Lấy SHA mới nhất của một repo:
```bash
git ls-remote https://github.com/<owner>/<repo> refs/heads/main
```
Nên **bump SHA định kỳ** để nhận bản vá, kèm ghi chú ngày trong CHANGELOG.

---

## ✅ Chạy kiểm tra trước khi mở PR

```bash
python3 scripts/validate.py
```

Validator kiểm tra:
- Phiên bản đồng nhất giữa các module.
- Khối `argument={...}` là JSON hợp lệ.
- `Rules/*.list` không có dòng trùng.
- Không còn script bên thứ ba chưa ghim SHA.
- Các file tài liệu được README tham chiếu đều tồn tại.

---

## 📝 Checklist Pull Request

- [ ] Đã chạy `python3 scripts/validate.py` và **đạt**.
- [ ] Nếu thêm app: đã cập nhật script **và** `[MITM] hostname` **và** đồng bộ
      trên các module liên quan.
- [ ] Script bên thứ ba mới đã **ghim commit SHA**.
- [ ] Đã bump phiên bản đồng nhất trên tất cả module (nếu phù hợp).
- [ ] Đã cập nhật `CHANGELOG.md`.
- [ ] Commit theo Conventional Commits.
