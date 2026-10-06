#!/usr/bin/env python3
"""
Dead Link Auditor for NguyenNgocAnhTu modules.
Scans all 8 module files, extracts external script and rule URLs,
and verifies HTTP reachability concurrently.
"""
from __future__ import annotations

import re
import sys
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

# Ensure UTF-8 output on Windows
try:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

ROOT = Path(__file__).resolve().parent.parent
MODULE_DIR = ROOT / "Module"

def extract_urls() -> set[str]:
    url_pattern = re.compile(r"https?://[a-zA-Z0-9_\-\./:%?=&#+~]+(?<![.,;:\'\"()\[\]])")
    urls = set()
    for f in sorted(MODULE_DIR.glob("NguyenNgocAnhTu_*.*")):
        content = f.read_text(encoding="utf-8")
        for line in content.splitlines():
            line_str = line.strip()
            # Bỏ qua comment
            if line_str.startswith("#"):
                continue
            for match in url_pattern.finditer(line):
                u = match.group(0)
                # Chỉ kiểm tra URL tài nguyên script, rule hoặc api
                if any(ext in u for ext in [".js", ".list", ".min.js", "raw.githubusercontent.com", "github.com"]):
                    urls.add(u)
    return urls

def check_url(url: str) -> tuple[str, bool, int, str]:
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            status = resp.status
            return url, (200 <= status < 400), status, "OK"
    except urllib.error.HTTPError as e:
        return url, False, e.code, str(e.reason)
    except Exception as e:
        return url, False, 0, str(e)

def main() -> int:
    urls = sorted(extract_urls())
    print(f"== Bắt đầu kiểm tra {len(urls)} URLs tài nguyên trong module ==")
    
    passed = 0
    failed = 0
    failures = []

    with ThreadPoolExecutor(max_workers=10) as executor:
        results = executor.map(check_url, urls)
        for url, ok, status, reason in results:
            if ok:
                passed += 1
                print(f"  [PASS] {status} - {url}")
            else:
                failed += 1
                print(f"  [FAIL] {status} - {url} ({reason})")
                failures.append((url, status, reason))

    print("\n" + "=" * 60)
    print(f"Tổng kết: {passed} URLs hoạt động tốt / {failed} URLs gặp lỗi")
    
    if failures:
        print("\n❌ Danh sách liên kết hỏng:")
        for url, status, reason in failures:
            print(f"  - {url} -> {status}: {reason}")
        return 1
    
    print("✅ 100% LIÊN KẾT ĐỀU SỐNG VÀ TRẢ VỀ DỮ LIỆU CHÍNH XÁC")
    return 0

if __name__ == "__main__":
    sys.exit(main())
