/*
 * @name: Funimate Pro Premium Unlock
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/ekaznyra/NguyenNgocAnhTu
 * @date: 2026-05-09
 */

var objc;
try { objc = JSON.parse($response.body); } catch (e) {}

if (!objc || typeof objc !== "object") {
    $done({});
} else {
    if (objc.user) {
        objc.user.is_pro = true;
        objc.user.pro_status = "active";
        objc.user.pro_expires_at = "2099-12-31T23:59:59.000Z";
        objc.user.subscription_type = "yearly";
    }
    $done({ body: JSON.stringify(objc) });
}
