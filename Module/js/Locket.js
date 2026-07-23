/*
 * @name: Locket Gold Unlock (RevenueCat) — Best/Hardened
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/ekaznyra/NguyenNgocAnhTu
 * @date: 2026-07-24
 *
 * Cơ chế:
 *   Chặn response RevenueCat (api.revenuecat.com | api.rc-backup.com) ở endpoint
 *   /receipts hoặc /subscribers/<app_user_id>, rồi MERGE (không thay nguyên body,
 *   để giữ app_user_id thật) các trường sau vào subscriber:
 *     - subscription "locket_1600_1y" (hết hạn 2099, ownership PURCHASED)
 *     - entitlement "Gold" + "pro" + "premium" (Locket v2.41+ có thể kiểm tra thêm
 *       pro/premium — cấp cả 3 để chắc chắn; app chỉ đọc key nó biết nên vô hại)
 *     - vài field subscriber giúp một số bản validate store (chỉ set nếu server chưa có)
 *
 * Tham khảo: spec RevenueCat API v1 + các bản cộng đồng (Ohoang7, itskevinz "Hybrid",
 * ddgksf2013) + ghi chú cải tiến v3.0/v2.41+ trong repo. Chọn cách MERGE vì an toàn nhất.
 */

var obj;
try { obj = JSON.parse($response.body); } catch (e) {}

// Không parse được hoặc thiếu subscriber -> trả nguyên body để tránh làm hỏng app
if (!obj || typeof obj !== "object" || !obj.subscriber) {
  $done({});
} else {
  var FOREVER = "2099-12-31T23:59:59Z";   // hạn "vĩnh viễn" an toàn (khớp brand "đến 2099")
  var PAST = "2020-01-01T00:00:00Z";       // ngày mua trong quá khứ
  var PRODUCT_ID = "locket_1600_1y";       // product Gold phổ biến nhất của Locket
  var ENT_KEYS = ["Gold", "pro", "premium"]; // đa key cho tương thích Locket v2.41+

  var sub = obj.subscriber;
  sub.subscriptions = sub.subscriptions || {};
  sub.entitlements = sub.entitlements || {};
  sub.non_subscriptions = sub.non_subscriptions || {};

  // 1) Subscription (khớp schema thật RevenueCat cho subscriptions.<product_id>)
  var subscription = {
    auto_resume_date: null,
    billing_issues_detected_at: null,
    expires_date: FOREVER,
    grace_period_expires_date: null,
    is_sandbox: false,
    original_purchase_date: PAST,
    ownership_type: "PURCHASED",
    period_type: "normal",
    product_plan_identifier: null,
    purchase_date: PAST,
    refunded_at: null,
    store: "app_store",
    unsubscribe_detected_at: null
  };
  sub.subscriptions[PRODUCT_ID] = Object.assign({}, sub.subscriptions[PRODUCT_ID] || {}, subscription);

  // 2) Entitlements (đúng 4 field theo spec) — cấp cho cả Gold/pro/premium
  for (var i = 0; i < ENT_KEYS.length; i++) {
    var k = ENT_KEYS[i];
    sub.entitlements[k] = Object.assign({}, sub.entitlements[k] || {}, {
      expires_date: FOREVER,
      grace_period_expires_date: null,
      product_identifier: PRODUCT_ID,
      purchase_date: PAST
    });
  }

  // 3) Field phụ giúp một số bản Locket validate store (chỉ set nếu server CHƯA có,
  //    để không ghi đè dữ liệu thật của tài khoản)
  if (!sub.original_application_version) sub.original_application_version = "1";
  if (!sub.first_seen) sub.first_seen = PAST;
  if (!sub.management_url) sub.management_url = "https://apps.apple.com/account/subscriptions";

  obj.Attention = "Chúc mừng bạn! Vui lòng không bán hoặc chia sẻ cho người khác!";

  $done({ body: JSON.stringify(obj) });
}
