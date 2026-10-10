/*
 * @name: Xmind Premium Unlock
 * @desc: Unlock Xmind mind-map subscription until year 2099
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/ekaznyra/NguyenNgocAnhTu
 * @date: 2026-05-09
 */

let rawBody = ($response && $response.body) || "";
let obj;
try { obj = JSON.parse(rawBody); } catch (e) {}

if (!obj || typeof obj !== "object") {
    $done({});
} else {
    obj.license = obj.license || {};
    obj.license.status = "sub";
    obj.license.expireTime = 4071600000000; // 2099-01-01 ms
    $done({ body: JSON.stringify(obj) });
}
