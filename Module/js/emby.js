/*
 * @name: Emby Premiere Unlock
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/ekaznyra/NguyenNgocAnhTu
 * @date: 2026-05-09
 */

var objc;
try { objc = JSON.parse($response.body); } catch (e) {}

if (objc && typeof objc === "object") {
    objc.cacheExpirationDays = 999;
    objc.message = "Device is valid";
    objc.resultCode = "GOOD";
} else {
    objc = {
        "cacheExpirationDays": 999,
        "message": "Device is valid",
        "resultCode": "GOOD"
    };
}

$done({ body: JSON.stringify(objc) });
