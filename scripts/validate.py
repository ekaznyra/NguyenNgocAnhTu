#!/usr/bin/env python3
"""
Trình kiểm tra tính toàn vẹn cho bộ module NguyenNgocAnhTu.

Chạy cục bộ:  python3 scripts/validate.py
CI sẽ chạy file này; trả về mã thoát != 0 nếu có lỗi.

Các kiểm tra:
  1. Phiên bản đồng nhất giữa tất cả module (tránh lệch version).
  2. Mọi khối `argument={...}` trong module phải là JSON hợp lệ.
  3. Rules/*.list không có dòng trùng lặp.
  4. Chính sách ghim SHA: không được nạp script .js bên thứ ba từ nhánh
     master/main (chỉ script tự host của ekaznyra mới được để master).
   5. Các file được README tham chiếu phải tồn tại.
   6. Mọi script Module/js/<tên>.js được tham chiếu trong module phải tồn tại
      trên đĩa VỚI ĐÚNG phân biệt hoa/thường (bắt lỗi typo như bussu/MeiTu
      và sai case như AlightMotion.js).
 """
from __future__ import annotations
import json
import re
import sys
from pathlib import Path

# Đảm bảo stdout là UTF-8 (tránh UnicodeEncodeError trên Windows/cp1252).
try:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:  # noqa: BLE001
    pass

ROOT = Path(__file__).resolve().parent.parent
MODULE_DIR = ROOT / "Module"
RULES_DIR = ROOT / "Rules"

# Chủ sở hữu được phép để script .js trên nhánh di động (master/main).
# ekaznyra = script tự host trong chính repo này (do tác giả kiểm soát).
PIN_EXEMPT_OWNERS = {"ekaznyra"}

errors: list[str] = []
warnings: list[str] = []


def module_files() -> list[Path]:
    return sorted(p for p in MODULE_DIR.glob("NguyenNgocAnhTu_*.*"))


def strip_comment(line: str) -> str:
    return line.split("#", 1)[0] if line.lstrip().startswith("#") else line


# --- 1. Version đồng nhất ---------------------------------------------------
def check_versions() -> None:
    ver_re = re.compile(r"(\d+\.\d+\.\d+-stable)")
    found: dict[str, set[str]] = {}
    for f in module_files():
        vers = set(ver_re.findall(f.read_text(encoding="utf-8")))
        if vers:
            found[f.name] = vers
    all_versions = set().union(*found.values()) if found else set()
    if not found:
        errors.append("[version] Không tìm thấy chuỗi phiên bản trong bất kỳ module nào.")
        return
    if len(all_versions) != 1:
        errors.append(f"[version] Phiên bản không đồng nhất giữa các module: {found}")
    else:
        print(f"[version] OK — tất cả module ở {all_versions.pop()}")


# --- 2. JSON argument hợp lệ ------------------------------------------------
def extract_json_blocks(text: str) -> list[str]:
    blocks = []
    for m in re.finditer(r"argument=", text):
        i = text.find("{", m.end())
        if i == -1:
            continue
        depth = 0
        for j in range(i, len(text)):
            c = text[j]
            if c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    blocks.append(text[i:j + 1])
                    break
    return blocks


def check_json_arguments() -> None:
    count = 0
    for f in module_files():
        for blk in extract_json_blocks(f.read_text(encoding="utf-8")):
            count += 1
            try:
                json.loads(blk)
            except Exception as e:  # noqa: BLE001
                errors.append(f"[json] {f.name}: argument không hợp lệ ({e}): {blk[:80]}")
    print(f"[json] OK — {count} khối argument JSON hợp lệ")


# --- 3. Rules không trùng ---------------------------------------------------
def check_rule_duplicates() -> None:
    for f in sorted(RULES_DIR.glob("*.list")):
        seen: set[str] = set()
        dups: set[str] = set()
        for raw in f.read_text(encoding="utf-8").splitlines():
            line = raw.strip()
            if not line or line.startswith("#"):
                continue
            if line in seen:
                dups.add(line)
            seen.add(line)
        if dups:
            errors.append(f"[rules] {f.name}: {len(dups)} dòng trùng: {sorted(dups)[:5]}")
    print("[rules] OK — không có dòng trùng trong Rules/*.list")


# --- 4. Chính sách ghim SHA -------------------------------------------------
def check_sha_pinning() -> None:
    # bắt raw.githubusercontent.com/<owner>/<repo>/<branch>/....js
    url_re = re.compile(
        r"raw\.githubusercontent\.com/([^/]+)/([^/]+)/(master|main|Master|Main)/[^\s,'\"]+\.js"
    )
    bad = 0
    for f in module_files():
        for ln in f.read_text(encoding="utf-8").splitlines():
            if ln.lstrip().startswith("#"):
                continue  # bỏ qua dòng đã comment
            for owner, repo, branch in url_re.findall(ln):
                if owner in PIN_EXEMPT_OWNERS:
                    continue
                bad += 1
                errors.append(
                    f"[pin] {f.name}: script bên thứ ba chưa ghim SHA "
                    f"({owner}/{repo}@{branch}). Hãy thay bằng commit SHA 40 ký tự."
                )
    if not bad:
        print("[pin] OK — mọi script .js bên thứ ba đều đã ghim commit SHA")


# --- 5. File README tham chiếu tồn tại --------------------------------------
def check_referenced_files() -> None:
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    required = set(re.findall(r"blob/(?:master|main)/([A-Za-z0-9_./-]+\.md)", readme))
    # luôn kiểm tra các file cốt lõi
    required |= {"CONTRIBUTING.md", "CHANGELOG.md"}
    for rel in sorted(required):
        if not (ROOT / rel).exists():
            errors.append(f"[docs] README tham chiếu '{rel}' nhưng file không tồn tại.")
    print(f"[docs] OK — đã kiểm tra {len(required)} file được tham chiếu")


def check_js_references() -> None:
    js_dir = MODULE_DIR / "js"
    on_disk = {p.name for p in js_dir.glob("*.js")} if js_dir.is_dir() else set()
    ref_re = re.compile(r"Module/js/([A-Za-z0-9_]+\.js)")
    missing: list[str] = []
    for f in module_files():
        for name in ref_re.findall(f.read_text(encoding="utf-8")):
            if name not in on_disk:
                missing.append(f"{f.name}: Module/js/{name}")
    if missing:
        errors.append(
            "[js] Các script được tham chiếu nhưng KHÔNG tồn tại trên đĩa "
            "(sai tên/sai hoa-thường): " + "; ".join(sorted(set(missing)))
        )
    else:
        print(f"[js] OK — mọi tham chiếu Module/js/*.js đều tồn tại ({len(on_disk)} file)")


def main() -> int:
    check_versions()
    check_json_arguments()
    check_rule_duplicates()
    check_sha_pinning()
    check_referenced_files()
    check_js_references()
    print("\n" + "=" * 60)
    if warnings:
        print(f"⚠️  {len(warnings)} cảnh báo:")
        for w in warnings:
            print("  -", w)
    if errors:
        print(f"❌ THẤT BẠI — {len(errors)} lỗi:")
        for e in errors:
            print("  -", e)
        return 1
    print("✅ TẤT CẢ KIỂM TRA ĐỀU ĐẠT")
    return 0


if __name__ == "__main__":
    sys.exit(main())
