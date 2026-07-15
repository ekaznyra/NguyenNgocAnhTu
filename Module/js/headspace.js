/*
 * @name: Headspace Premium Unlock
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/ekaznyra/NguyenNgocAnhTu
 * @date: 2026-05-09
 */

var objc;
try { objc = JSON.parse($response.body); } catch (e) {}

if (!objc || typeof objc !== "object") {
    // Non-JSON / lỗi / 304 -> để nguyên response
    $done({});
} else {
    objc.subscriptions = [
        {
            "sku": "com.headspace.annual",
            "status": "active",
            "store": "apple",
            "is_trial": false,
            "expires_at": "9999-01-09T02:00:00Z",
            "started_at": "2024-01-09T02:00:00Z",
            "product_id": "com.headspace.annual"
        }
    ];
    objc.has_subscription = true;
    $done({ body: JSON.stringify(objc) });
}
