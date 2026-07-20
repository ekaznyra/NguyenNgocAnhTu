/***********************************************
> RevenueCat Multi-App Premium Unlocker
> Locket Gold + 车票票 VIP + Generic RC Apps
> Original: z3rokaze (revenuecat_multi.js)
> Updated: Nguyễn Ngọc Anh Tú (z3rokaze)
> Date: 2026-07-21 (v2.4.1-stable)
***********************************************/

// ========= App ID Mapping ========= //
// [entitlement, productIdentifier]. Khóa để dạng UTF-8 thường (KHÔNG percent-encode)
// vì User-Agent chứa chuỗi thật. App có trong mapping -> cấp ĐÚNG entitlement key riêng.
// App RC khác (đa số app hot quốc tế) -> rơi vào fallback đa-entitlement bên dưới.
const mapping = {
  'Locket': ['Gold', 'locket_1600_1y']
};

// ========= Fallback entitlement keys ========= //
// Các app RevenueCat hot quốc tế dùng nhiều tên entitlement khác nhau (pro/premium/plus...).
// Cấp quyền dưới TẤT CẢ key phổ biến này để phủ tối đa mà không cần script riêng cho từng app
// (tránh xung đột endpoint vì mọi app RC đều đi qua cùng handler này).
const GENERIC_ENTITLEMENT_KEYS = [
  "pro", "premium", "plus", "Pro", "Premium", "Plus", "vip", "VIP",
  "unlimited", "standard", "gold", "lifetime", "all_access",
  "premium_access", "pro_access", "isPremium", "premiumUser",
  "member", "membership", "svip", "vip_access", "full_access",
  "premium_yearly", "premium_lifetime", "unlimited_access", "paid", "Unlock"
];

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
let prodKey = "locket_1600_1y";
let entKeys;
if (match) {
  // App có trong mapping -> cấp đúng entitlement key riêng (GIỮ NGUYÊN hành vi Locket Gold)
  const [ent, prod] = mapping[match];
  if (prod) prodKey = prod;
  entKeys = [ent || "pro"];
} else {
  // App RC khác -> cấp quyền dưới nhiều entitlement key phổ biến (phủ nhiều app hot)
  entKeys = GENERIC_ENTITLEMENT_KEYS;
}
locketGold.product_identifier = prodKey;
obj.subscriber.subscriptions = obj.subscriber.subscriptions || {};
obj.subscriber.entitlements = obj.subscriber.entitlements || {};
// Merge (giữ field server có thể thêm mới) thay vì ghi đè cả object
obj.subscriber.subscriptions[prodKey] = Object.assign({}, obj.subscriber.subscriptions[prodKey] || {}, z3rokaze);
// Với app chưa map: gia hạn luôn mọi entitlement server đã định nghĩa sẵn (nếu có) -> phủ đúng key riêng của app
if (!match) {
  for (const k of Object.keys(obj.subscriber.entitlements)) {
    obj.subscriber.entitlements[k] = Object.assign({}, obj.subscriber.entitlements[k], {
      expires_date: locketGold.expires_date,
      purchase_date: locketGold.purchase_date,
      grace_period_expires_date: null,
      product_identifier: (obj.subscriber.entitlements[k] && obj.subscriber.entitlements[k].product_identifier) || prodKey
    });
  }
}
// Cấp quyền dưới các entitlement key mục tiêu
for (const k of entKeys) {
  obj.subscriber.entitlements[k] = Object.assign({}, obj.subscriber.entitlements[k] || {}, locketGold);
}
$done({ body: JSON.stringify(obj) });
}
