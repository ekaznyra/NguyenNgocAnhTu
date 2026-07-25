/*
 * @name: Fimo Camera VIP Unlock (Shadowrocket)
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/ekaznyra/NguyenNgocAnhTu
 * @date: 2026-07-25
 */

var obj;
try { obj = JSON.parse($response.body); } catch (e) {}

if (!obj || typeof obj !== "object") {
    $done({});
} else {
    obj.user = Object.assign({}, obj.user || {}, {
        "subscribe": 1,
        "expireTime": 32662137600000,
        "isSubscribe": true
    });
    $done({ body: JSON.stringify(obj) });
}
