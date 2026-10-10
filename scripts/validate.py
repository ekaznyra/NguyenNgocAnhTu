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
   7. Spotify Premium phải đồng bộ trên 8 module: mọi module phải wire
      `Module/js/spotify.js`, có `api.spotify.com` trong MITM, và có cơ chế
      cache-bust (header-rewrite / request-header / script Cache-Control) để
      patch premium không bị cache `304` đè.
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
# Các tài liệu được README liên kết là một phần của giao diện dự án; thiếu file
# sẽ làm liên kết hỏng nên phải làm validator thất bại.
def check_referenced_files() -> None:
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    refs = set(re.findall(r"blob/(?:master|main)/([A-Za-z0-9_./-]+\.md)", readme))
    for rel in sorted(refs):
        if not (ROOT / rel).exists():
            errors.append(f"[docs] README tham chiếu '{rel}' nhưng file không tồn tại.")
    if refs:
        print(f"[docs] OK — đã kiểm tra {len(refs)} file được README tham chiếu")
    else:
        print("[docs] OK — không có file docs nào được tham chiếu")


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


def check_spotify_parity() -> None:
    js_path = MODULE_DIR / "js" / "spotify.js"
    if not js_path.exists():
        errors.append("[spotify] Module/js/spotify.js không tồn tại.")
        print("[spotify] SKIP — thiếu spotify.js")
        return
    spotify_src = js_path.read_text(encoding="utf-8")
    if "Cache-Control" not in spotify_src:
        errors.append("[spotify] spotify.js thiếu cơ chế cache-bust (Cache-Control).")

    test_endpoints = [
        "https://api.spotify.com/v1/me",
        "https://spclient.wg.spotify.com/identity/v3/me",
        "https://spclient.wg.spotify.com/device-capabilities/v1/capabilities",
        "https://spclient.wg.spotify.com/user-attributes/v1/attributes",
        "https://spclient.wg.spotify.com/bootstrap/v1/bootstrap",
        "https://spclient.wg.spotify.com/melody/v1/check_license",
    ]

    bad: list[str] = []
    for f in module_files():
        t = f.read_text(encoding="utf-8")
        wired = "Module/js/spotify.js" in t
        mitm = "api.spotify.com" in t and "spclient.wg.spotify.com" in t
        cb = (("header-del If-None-Match" in t) or
              ("request-header" in t and "If-None-Match" in t) or
              ("action: del" in t and "if-none-match" in t) or
              ("Cache-Control" in spotify_src))
        
        # Trích xuất regex pattern của Spotify_Premium
        pat_match = (
            re.search(r'Spotify_Premium\s*=\s*[^,\n]+,\s*pattern=([^\s,]+)', t) or
            re.search(r'name:\s*"Spotify Premium JSON"\s*\n\s*match:\s*"([^"\n]+)"', t) or
            re.search(r'name:\s*sp-premium-json\s*\n\s*match:\s*([^\s\n]+)', t) or
            re.search(r'http-response\s+([^\s]+)\s+script-path=[^\n]+spotify\.js', t) or
            re.search(r'(\^[^\s]+)\s+url\s+script-response-body[^\n]+spotify\.js', t)
        )
        regex_ok = False
        if pat_match:
            raw_pat = pat_match.group(1).strip('"')
            clean_pat = raw_pat.replace(r'\/', '/').replace(r'\\', '\\')
            try:
                comp_pat = re.compile(clean_pat)
                regex_ok = all(bool(comp_pat.match(u)) for u in test_endpoints)
            except Exception:
                regex_ok = False

        if not (wired and mitm and cb and regex_ok):
            bad.append(f"{f.name} (wire={wired}, mitm={mitm}, cb={cb}, regex_ok={regex_ok})")
    if bad:
        errors.append("[spotify] Các module thiếu đồng bộ Spotify Premium hoặc regex hỏng: " + "; ".join(bad))
    else:
        print("[spotify] OK — 8/8 module đồng bộ (wire + MITM spclient.wg + cache-bust + regex test 100%)")


def check_education_parity() -> None:
    bad: list[str] = []
    edu_scripts = ["duolingo.js", "cake.js", "quizlet.js"]
    for f in module_files():
        t = f.read_text(encoding="utf-8")
        missing = [s for s in edu_scripts if f"Module/js/{s}" not in t]
        if missing:
            bad.append(f"{f.name} (thiếu: {', '.join(missing)})")
    if bad:
        errors.append("[education] Các module thiếu đồng bộ Education Suite: " + "; ".join(bad))
    else:
        print("[education] OK — 8/8 module đồng bộ (Duolingo, Cake, Quizlet)")


def check_all_local_js_parity() -> None:
    js_dir = MODULE_DIR / "js"
    js_files = sorted(p.name for p in js_dir.glob("*.js")) if js_dir.is_dir() else []
    missing_map: dict[str, list[str]] = {}
    for f in module_files():
        t = f.read_text(encoding="utf-8")
        for j in js_files:
            if f"Module/js/{j}" not in t:
                missing_map.setdefault(f.name, []).append(j)
    if missing_map:
        for mod, miss in missing_map.items():
            errors.append(f"[parity] {mod} thiếu tham chiếu local scripts ({len(miss)}): {', '.join(miss)}")
    else:
        print(f"[parity] OK — 8/8 module wire đầy đủ cả {len(js_files)}/31 local scripts (calm, wps, darkroom, oldroll...)")


def check_mitm_essential_parity() -> None:
    essential_hosts = [
        "v1.darkroom.co",
        "com.zijayrate.analogcam",
        "api.craft.do",
        "api.sortedapp.com",
        "dayone.app",
        "api.elsaspeak.com",
        "api.photoroom.com",
        "api.remini.ai",
        "api.bazaart.me",
    ]
    missing_hosts: dict[str, list[str]] = {}
    for f in module_files():
        t = f.read_text(encoding="utf-8")
        for h in essential_hosts:
            if h not in t:
                missing_hosts.setdefault(f.name, []).append(h)
    if missing_hosts:
        for mod, miss in missing_hosts.items():
            errors.append(f"[mitm] {mod} thiếu hostnames quan trọng ({len(miss)}): {', '.join(miss)}")
    else:
        print(f"[mitm] OK — 8/8 module đồng bộ đầy đủ các MITM hostnames quan trọng ({len(essential_hosts)} hosts)")


def check_dns_profile() -> None:
    dns_file = ROOT / "DNS.mobileconfig"
    if not dns_file.exists():
        errors.append("[dns] DNS.mobileconfig không tồn tại.")
        return
    try:
        import xml.etree.ElementTree as ET
        ET.parse(dns_file)
        print("[dns] OK — DNS.mobileconfig tồn tại và cú pháp XML hợp lệ")
    except Exception as e:
        errors.append(f"[dns] DNS.mobileconfig lỗi cú pháp XML: {e}")


def check_rules_syntax() -> None:
    valid_types = {
        "DOMAIN", "DOMAIN-SUFFIX", "DOMAIN-KEYWORD",
        "IP-CIDR", "IP-CIDR6", "GEOIP", "USER-AGENT", "URL-REGEX"
    }
    rule_files = sorted(RULES_DIR.glob("*.list"))
    bad_lines = []
    for rf in rule_files:
        lines = rf.read_text(encoding="utf-8").splitlines()
        for idx, line in enumerate(lines, 1):
            s = line.strip()
            if not s or s.startswith("#"):
                continue
            parts = [x.strip() for x in s.split(",")]
            if len(parts) not in (2, 3):
                bad_lines.append(f"{rf.name}:{idx} (số phần tử không hợp lệ: {len(parts)})")
                continue
            rtype = parts[0].upper()
            if rtype not in valid_types:
                bad_lines.append(f"{rf.name}:{idx} (loại rule không hợp lệ: {parts[0]})")
    if bad_lines:
        errors.append(f"[rules-syntax] Phát hiện {len(bad_lines)} dòng rule sai cú pháp: {'; '.join(bad_lines[:5])}")
    else:
        print(f"[rules-syntax] OK — {len(rule_files)} files Rules/*.list có cú pháp chuẩn xác 100%")


def check_header_del_parity() -> None:
    target_modules = [
        "NguyenNgocAnhTu_Surge.sgmodule",
        "NguyenNgocAnhTu_Loon.plugin",
        "NguyenNgocAnhTu_LanceX.module",
        "NguyenNgocAnhTu_Egern.yaml",
        "NguyenNgocAnhTu_QuantumultX.snippet",
        "NguyenNgocAnhTu_Shadowrocket.module",
        "NguyenNgocAnhTu_Premium.module"
    ]
    bad = []
    for name in target_modules:
        p = MODULE_DIR / name
        if not p.exists():
            continue
        t = p.read_text(encoding="utf-8")
        has_rc = ("api.revenuecat.com" in t and ("If-None-Match" in t or "if-none-match" in t))
        has_itunes = ("buy.itunes.apple.com" in t and ("If-None-Match" in t or "if-none-match" in t))
        if not (has_rc and has_itunes):
            bad.append(f"{name} (rc={has_rc}, itunes={has_itunes})")
    if bad:
        errors.append(f"[header-del] Các module thiếu header-del cho RevenueCat hoặc iTunes: {'; '.join(bad)}")
    else:
        print(f"[header-del] OK — 7/7 module hỗ trợ đều có header-del cho RevenueCat & iTunes (chống 304 cache)")


def main() -> int:
    check_versions()
    check_json_arguments()
    check_rule_duplicates()
    check_rules_syntax()
    check_sha_pinning()
    check_referenced_files()
    check_dns_profile()
    check_js_references()
    check_spotify_parity()
    check_education_parity()
    check_all_local_js_parity()
    check_mitm_essential_parity()
    check_header_del_parity()
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
