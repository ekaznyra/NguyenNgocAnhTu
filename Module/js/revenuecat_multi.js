/***********************************************
> RevenueCat Multi-App Premium Unlocker
> Locket Gold + 车票票 VIP + Generic RC Apps
> Original: z3rokaze (revenuecat_multi.js)
> Updated: Nguyễn Ngọc Anh Tú (z3rokaze)
> Date: 2026-08-21 (v2.5.0-fixed)
>
> CHANGELOG v2.5.0:
> - FIX: expires_date mismatch giữa subscription/entitlement (Critical)
> - FIX: Xóa non-standard fields (display_name, price) khỏi subscription
> - FIX: Di chuyển management_url về đúng subscriber level
> - FIX: purchase_date thống nhất 2005-07-18 (Thành viên kể từ)
> - FIX: Thêm product_plan_identifier cho SDK v5+
> - FIX: Init non_subscriptions tránh crash
***********************************************/

// ========= App ID Mapping ========= //
// [entitlement, productIdentifier]. Khóa để dạng UTF-8 thường (KHÔNG percent-encode)
// vì User-Agent chứa chuỗi thật. App có trong mapping -> cấp ĐÚNG entitlement key riêng.
// App RC khác (đa số app hot quốc tế) -> rơi vào fallback đa-entitlement bên dưới.
const mapping = {
  'Locket': ['Gold', 'locket_1600_1y'],
  'Remini': ['premium', 'com.bigwinepot.nwdn.revive.sub.yearly'],
  'PhotoRoom': ['pro', 'photoroom_pro_yearly'],
  'ELSA': ['premium', 'elsa_premium_1y'],
  'Bazaart': ['pro', 'bazaart_pro_yearly'],
  'Splice': ['pro', 'splice_pro_yearly'],
  'Facetune': ['VIP', 'facetune_vip_yearly'],
  'Mojo': ['pro', 'mojo_pro_yearly'],
  'Prequel': ['premium', 'prequel_premium_yearly'],
  '24FPS': ['pro', 'twentyfourfps_pro_yearly'],
  'Unfold': ['plus', 'unfold_plus_yearly'],
  'Videoleap': ['pro', 'videoleap_pro_yearly'],
  'Captions': ['pro', 'captions_pro_yearly'],
  'iScreen': ['VIP', 'iscreen_vip_yearly'],
  'MDVinyl': ['pro', 'mdvinyl_pro_yearly'],
  'MD Vinyl': ['pro', 'mdvinyl_pro_yearly'],
  'Structured': ['pro', 'structured_pro_lifetime'],
  'Moises': ['premium', 'moises_premium_yearly'],
  'Lensa': ['pro', 'lensa_pro_yearly'],
  'AIMirror': ['premium', 'aimirror_premium_yearly'],
  'AI Mirror': ['premium', 'aimirror_premium_yearly'],
  'Widgetsmith': ['Premium', 'widgetsmith_premium_yearly'],
  'Pixelup': ['pro', 'pixelup_pro_yearly']
};

// ========= Fallback entitlement keys ========= //
// Các app RevenueCat hot quốc tế dùng nhiều tên entitlement khác nhau (pro/premium/plus...).
// Cấp quyền dưới TẤT CẢ key phổ biến này để phủ tối đa mà không cần script riêng cho từng app
// (tránh xung đột endpoint vì mọi app RC đều đi qua cùng handler này).
const GENERIC_ENTITLEMENT_KEYS = [
  "pro", "premium", "plus", "Pro", "Premium", "Plus", "vip", "VIP",
  "unlimited", "standard", "gold", "Gold", "lifetime", "all_access",
  "premium_access", "pro_access", "isPremium", "premiumUser",
  "member", "membership", "svip", "vip_access", "full_access",
  "premium_yearly", "premium_lifetime", "unlimited_access", "paid", "Unlock"
];

// ========= Unified Constants (CRITICAL: dates MUST match) ========= //
const EXPIRES    = "9999-07-18T10:10:14Z";
const PURCHASED  = "2005-07-18T10:10:14Z";
const MGMT_URL   = "https://apps.apple.com/account/subscriptions";

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
// Detect app từ User-Agent
const match = Object.keys(mapping).find(e => uaDecoded.includes(e) || ua.includes(e));
let prodKey = "locket_1600_1y";
let entKeys;
if (match) {
  // App có trong mapping -> cấp đúng entitlement key riêng (GIỮ NGUYÊN hành vi Locket Gold)
  const [ent, prod] = mapping[match];
  if (prod) prodKey = prod;
  entKeys = (match === 'Locket') ? ['Gold', 'gold'] : [ent || "pro"];
} else {
  // App RC khác -> cấp quyền dưới nhiều entitlement key phổ biến (phủ nhiều app hot)
  entKeys = GENERIC_ENTITLEMENT_KEYS;
}

// Generate pseudo-unique transaction ID dựa trên prodKey hash
var txHash = 210000000000000;
for (var i = 0; i < prodKey.length; i++) txHash += prodKey.charCodeAt(i) * (i + 1) * 7;
var TXID = String(txHash);

// Subscription template - CHỈ chứa các field chuẩn RevenueCat API
var subTemplate = {
    auto_resume_date: null,
    billing_issues_detected_at: null,
    expires_date: EXPIRES,
    grace_period_expires_date: null,
    is_sandbox: false,
    original_purchase_date: PURCHASED,
    ownership_type: "PURCHASED",
    period_type: "normal",
    purchase_date: PURCHASED,
    refunded_at: null,
    store: "app_store",
    store_transaction_id: TXID,
    unsubscribe_detected_at: null
};

// Entitlement template - bao gồm product_plan_identifier cho SDK v5+
var entTemplate = {
    expires_date: EXPIRES,
    grace_period_expires_date: null,
    product_identifier: prodKey,
    product_plan_identifier: prodKey,
    purchase_date: PURCHASED
};

// Đặt management_url ở subscriber level (đúng theo RC API spec, KHÔNG phải trong subscription)
if (!obj.subscriber.management_url) {
  obj.subscriber.management_url = MGMT_URL;
}

// Init các field bắt buộc
obj.subscriber.subscriptions = obj.subscriber.subscriptions || {};
obj.subscriber.entitlements = obj.subscriber.entitlements || {};
obj.subscriber.non_subscriptions = obj.subscriber.non_subscriptions || {};

// Merge subscription (giữ field server có thể thêm mới) thay vì ghi đè cả object
obj.subscriber.subscriptions[prodKey] = Object.assign({}, obj.subscriber.subscriptions[prodKey] || {}, subTemplate);

// Với app chưa map: gia hạn luôn mọi entitlement server đã định nghĩa sẵn (nếu có) -> phủ đúng key riêng của app
if (!match) {
  for (const k of Object.keys(obj.subscriber.entitlements)) {
    obj.subscriber.entitlements[k] = Object.assign({}, obj.subscriber.entitlements[k], {
      expires_date: EXPIRES,
      purchase_date: PURCHASED,
      grace_period_expires_date: null,
      product_identifier: (obj.subscriber.entitlements[k] && obj.subscriber.entitlements[k].product_identifier) || prodKey,
      product_plan_identifier: (obj.subscriber.entitlements[k] && obj.subscriber.entitlements[k].product_plan_identifier) || prodKey
    });
  }
}

// Cấp quyền dưới các entitlement key mục tiêu
for (const k of entKeys) {
  obj.subscriber.entitlements[k] = Object.assign({}, obj.subscriber.entitlements[k] || {}, entTemplate);
}

$done({ body: JSON.stringify(obj) });
}

