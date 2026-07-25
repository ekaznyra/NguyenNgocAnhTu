/*
 * @name: WPS Office Super VIP Unlock (Shadowrocket)
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/ekaznyra/NguyenNgocAnhTu
 * @date: 2026-07-25
 */

var obj;
try { obj = JSON.parse($response.body); } catch (e) {}

if (!obj || typeof obj !== "object") {
    $done({});
} else {
    obj.result = "ok";
    obj.level = 88;
    obj.vip = {
        "name": "超级会员",
        "has_ad": 0,
        "enabled": [
            {"id": 12, "name": "稻壳会员", "expire_time": 32662137600},
            {"id": 20, "name": "WPS会员", "expire_time": 32662137600},
            {"id": 40, "name": "超级会员", "expire_time": 32662137600}
        ]
    };
    $done({ body: JSON.stringify(obj) });
}
