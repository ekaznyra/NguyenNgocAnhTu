/*
 * @name: OldRoll Camera VIP Unlock (Shadowrocket)
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/ekaznyra/NguyenNgocAnhTu
 * @date: 2026-07-25
 */

var obj;
try { obj = JSON.parse($response.body); } catch (e) {}

if (!obj || typeof obj !== "object") {
    $done({});
} else {
    obj.result = Object.assign({}, obj.result || {}, {
        "is_vip": true,
        "vip_type": "forever",
        "expire_time": 32662137600000
    });
    $done({ body: JSON.stringify(obj) });
}
