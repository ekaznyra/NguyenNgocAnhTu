/*
 * @name: Locket Gold Unlock (RevenueCat)
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/ekaznyra/NguyenNgocAnhTu
 * @date: 2026-07-24
 *
 * Cơ chế:
 *   Chặn response của RevenueCat (api.revenuecat.com | api.rc-backup.com)
 *   ở endpoint /receipts hoặc /subscribers/<app_user_id> rồi tiêm:
 *     - subscription "locket_1600_1y" (hết hạn năm 9999)
 *     - entitlement "Gold" (hết hạn năm 9999)
 *   để Locket nhận diện tài khoản đã mua Gold vĩnh viễn.
 *
 * Lưu ý: script CHỈ xử lý Locket Gold (một entitlement duy nhất) — giữ tối giản,
 * KHÔNG áp entitlement đa app như revenuecat_multi.js, tránh sửa nhầm app khác.
 */

var obj;
try { obj = JSON.parse($response.body); } catch (e) {}

// Không parse được hoặc thiếu subscriber -> trả nguyên body để tránh làm hỏng app
if (!obj || typeof obj !== "object" || !obj.subscriber) {
  $done({});
} else {
  var PRODUCT_ID = "locket_1600_1y";
  var ENTITLEMENT = "Gold";

  obj.Attention = "Chúc mừng bạn! Vui lòng không bán hoặc chia sẻ cho người khác!";

  var subscription = {
    auto_resume_date: null,
    billing_issues_detected_at: null,
    display_name: PRODUCT_ID,
    expires_date: "9999-01-09T10:10:14Z",
    grace_period_expires_date: null,
    is_sandbox: true,
    management_url: "https://apps.apple.com/account/subscriptions",
    original_purchase_date: "2005-07-18T10:10:15Z",
    ownership_type: "PURCHASED",
    period_type: "normal",
    price: { amount: 399000.0, currency: "VND" },
    purchase_date: "2005-07-18T10:10:14Z",
    refunded_at: null,
    store: "app_store",
    store_transaction_id: "2000001108724193",
    unsubscribe_detected_at: null
  };

  var entitlement = {
    expires_date: "9999-07-18T10:10:14Z",
    grace_period_expires_date: null,
    product_identifier: PRODUCT_ID,
    purchase_date: "2005-07-18T10:10:14Z"
  };

  obj.subscriber.subscriptions = obj.subscriber.subscriptions || {};
  obj.subscriber.entitlements = obj.subscriber.entitlements || {};

  // Merge (giữ nguyên field server có thể thêm) thay vì ghi đè cả object
  obj.subscriber.subscriptions[PRODUCT_ID] = Object.assign(
    {}, obj.subscriber.subscriptions[PRODUCT_ID] || {}, subscription
  );
  obj.subscriber.entitlements[ENTITLEMENT] = Object.assign(
    {}, obj.subscriber.entitlements[ENTITLEMENT] || {}, entitlement
  );

  $done({ body: JSON.stringify(obj) });
}
