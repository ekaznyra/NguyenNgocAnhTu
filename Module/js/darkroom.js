/*
 * @name: Darkroom Pro Unlock (Shadowrocket)
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/ekaznyra/NguyenNgocAnhTu
 * @date: 2026-07-25
 */

var obj;
try { obj = JSON.parse($response.body); } catch (e) {}

if (!obj || typeof obj !== "object") {
    $done({});
} else {
    obj.profile = Object.assign({}, obj.profile || {}, {
        "membership_type": "forever",
        "is_subscriber": true,
        "is_active": true,
        "subscription_expiration_date": 32662137600000
    });
    $done({ body: JSON.stringify(obj) });
}
