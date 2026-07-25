/*
 * @name: Busuu Premium Unlock
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/ekaznyra/NguyenNgocAnhTu
 * @date: 2026-05-09
 */

var objc;
try { objc = JSON.parse($response.body); } catch (e) {}

if (!objc || typeof objc !== "object" || !objc.user || typeof objc.user !== "object") {
    // Không có user object -> để nguyên, KHÔNG bịa id/email (tránh hỏng đồng bộ/đăng nhập)
    $done({});
} else {
    objc.user.premium = true;
    objc.user.premium_until = "9999-01-09T02:00:00Z";
    objc.user.subscription_type = "premium_plus";
    objc.user.is_trial = false;
    objc.user.features = {
        "offline_mode": true,
        "grammar_review": true,
        "vocabulary_trainer": true,
        "travel_courses": true,
        "business_courses": true,
        "certificates": true
    };
    $done({ body: JSON.stringify(objc) });
}
