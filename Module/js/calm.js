/*
 * @name: Calm Premium Unlock (Shadowrocket)
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/ekaznyra/NguyenNgocAnhTu
 * @date: 2026-07-25
 */

var obj;
try { obj = JSON.parse($response.body); } catch (e) {}

if (!obj || typeof obj !== "object") {
    $done({});
} else {
    obj.is_lifetime = true;
    obj.valid = true;
    obj.expires = "2099-12-31T23:59:59.000Z";
    obj.is_free = false;
    $done({ body: JSON.stringify(obj) });
}
