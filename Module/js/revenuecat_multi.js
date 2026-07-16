/***********************************************
> RevenueCat Multi-App Premium Unlocker
> Locket Gold + 车票票 VIP + Generic RC Apps
> Original: z3rokaze (revenuecat_multi.js)
> Updated: Nguyễn Ngọc Anh Tú (z3rokaze)
> Date: 2026-07-16 (v2.2.0-stable)
***********************************************/

// ========= App ID Mapping ========= //
// [entitlement, productIdentifier]. Khóa để dạng UTF-8 thường (KHÔNG percent-encode)
// vì User-Agent chứa chuỗi thật. Các app RC khác không khớp -> rơi vào fallback "pro" bên dưới.
const mapping = {
  'Locket': ['Gold', 'locket_1600_1y']
};

// =========  Core Logic  ========= //
// =========  @z3rokaze  ========= //
var ua = ($request.headers["User-Agent"] || $request.headers["user-agent"] || "");
var uaDecoded; try { uaDecoded = decodeURIComponent(ua); } catch (e) { uaDecoded = ua; }
var obj;
try { obj = JSON.parse($response.body); } catch (e) {}
if (!obj || typeof obj !== "object" || !obj.subscriber) {
  // Không parse được hoặc thiếu subscriber -> trả nguyên body, tránh làm hỏng app
  $done({});
} else {
obj.Attention = "Chúc mừng bạn! Vui lòng không bán hoặc chia sẻ cho người khác!";
var z3rokaze = {
      auto_resume_date: null,
      display_name: "locket_1600_1y",
      is_sandbox: true,
      ownership_type: "PURCHASED",
      billing_issues_detected_at: null,
      management_url: "https://apps.apple.com/account/subscriptions",
      period_type: "normal",
      price: {
          "amount": 399000.0,
          "currency": "VND"
      },
      expires_date: "9999-01-09T10:10:14Z",
      grace_period_expires_date: null,
      refunded_at: null,
      unsubscribe_detected_at: null,
      original_purchase_date: "2005-07-18T10:10:15Z",
      purchase_date: "2005-07-18T10:10:14Z",
      store: "app_store",
      store_transaction_id: "2000001108724193",
  },
  locketGold = {
      grace_period_expires_date: null,
      purchase_date: "2005-07-18T10:10:14Z",
      product_identifier: "locket_1600_1y",
      expires_date: "9999-07-18T10:10:14Z"
  };
const match = Object.keys(mapping).find(e => uaDecoded.includes(e) || ua.includes(e));
let entKey = "pro", prodKey = "locket_1600_1y";
if (match) {
  const [ent, prod] = mapping[match];
  if (ent) entKey = ent;
  if (prod) prodKey = prod;
}
locketGold.product_identifier = prodKey;
// Merge (giữ field server có thể thêm mới) thay vì ghi đè cả object
obj.subscriber.subscriptions[prodKey] = Object.assign({}, obj.subscriber.subscriptions[prodKey] || {}, z3rokaze);
obj.subscriber.entitlements[entKey] = Object.assign({}, obj.subscriber.entitlements[entKey] || {}, locketGold);
$done({ body: JSON.stringify(obj) });
}
