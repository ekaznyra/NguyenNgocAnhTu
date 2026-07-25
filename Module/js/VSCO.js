/*
 * @name: VSCO X Premium Unlock (Shadowrocket)
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/ekaznyra/NguyenNgocAnhTu
 * @date: 2026-07-25
 */

var objc;
try { objc = JSON.parse($response.body); } catch (e) {}

if (!objc || typeof objc !== "object") {
    // Non-JSON / lỗi / 304 -> để nguyên response
    $done({});
} else {
    // Merge: giữ user_id thật + field khác server cấp, chỉ ép các field quyền
    objc.user_subscription = Object.assign({}, objc.user_subscription || {}, {
        "subscription_code": "VSCO_MEMBERSHIP",
        "expires_on_sec": 32662137600,
        "is_active": true,
        "is_trial_period": false,
        "payment_type": 1,
        "subscription_type": "yearly",
        "granted_by": "apple"
    });
    $done({ body: JSON.stringify(objc) });
}
