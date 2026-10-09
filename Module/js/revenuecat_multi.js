/***********************************************
> RevenueCat Multi-App Premium Unlocker
> Locket Gold + Generic RC Apps
> Original: z3rokaze (revenuecat_multi.js)
> Updated: Nguyễn Ngọc Anh Tú (z3rokaze)
> Date: 2026-08-21 (v2.6.0-locket-fix)
>
> CHANGELOG v2.6.0:
> - FIX: Locket Gold not activating — added first_seen, request_date
> - FIX: Added store_transaction_id to entitlement template (required by Locket)
> - FIX: original_app_user_id preservation (SDK v5+ validation)
> - FIX: Improved Locket detection (case-insensitive + bundle ID)
> - FIX: Remove expired/conflicting entitlements before injecting
> - FIX: Added original_purchase_date to entitlement (RC SDK v5.2+)
> - FIX: Ensure subscriber.first_seen is always set
> - ADD: Locket Widget companion app support
***********************************************/

// ========= App ID Mapping ========= //
// [entitlement, productIdentifier]. Khóa để dạng UTF-8 thường (KHÔNG percent-encode)
// vì User-Agent chứa chuỗi thật. App có trong mapping -> cấp ĐÚNG entitlement key riêng.
// App RC khác (đa số app hot quốc tế) -> rơi vào fallback đa-entitlement bên dưới.
const mapping = {
  'Locket': ['Gold', 'locket_1600_1y'],
  'locket': ['Gold', 'locket_1600_1y'],
  'Locket Widget': ['Gold', 'locket_1600_1y'],
  'co.locket.Locket': ['Gold', 'locket_1600_1y'],
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
  'Pixelup': ['pro', 'pixelup_pro_yearly'],
  'ScannerPro': ['pro', 'com.readdle.ScannerPro.SubscriptionYearly'],
  'Scanner Pro': ['pro', 'com.readdle.ScannerPro.SubscriptionYearly'],
  'iScanner': ['pro', 'iscanner_pro_yearly'],
  'QuickScan': ['pro', 'quickscan_pro_yearly'],
  'DocScanner': ['pro', 'docscanner_pro_yearly'],
  'Photoroom': ['pro', 'photoroom_pro_yearly'],
  'Epik': ['pro', 'com.snowcorp.epik.subscribe.yearly'],
  'EPIK': ['pro', 'com.snowcorp.epik.subscribe.yearly'],
  'Hypic': ['pro', 'hypic_pro_yearly'],
  'Speak': ['premium', 'speak_premium_yearly'],
  'Praktika': ['premium', 'praktika_premium_yearly'],
  'Craft': ['pro', 'com.lukilabs.lukiapp.pro_yearly'],
  'DayOne': ['premium', 'com.bloombuilt.dayone-ios.premium_yearly'],
  'Day One': ['premium', 'com.bloombuilt.dayone-ios.premium_yearly'],
  'DeepL': ['pro', 'deepl_pro_yearly'],
  'Notability': ['premium', 'com.gingerlabs.Notability.premium_subscription'],
  'ProCCD': ['pro', 'com.yengshine.proccd.yearly'],
  'proccd': ['pro', 'com.yengshine.proccd.yearly'],
  'com.yengshine.proccd': ['pro', 'com.yengshine.proccd.yearly'],
  'Dazz': ['pro', 'com.haocai.dazzcam.pro'],
  'DazzCam': ['pro', 'com.haocai.dazzcam.pro'],
  'dazz': ['pro', 'com.haocai.dazzcam.pro'],
  'EE35': ['pro', 'com.eightivedesign.ee35.pro'],
  'ee35': ['pro', 'com.eightivedesign.ee35.pro'],
  'NOMO': ['pro', 'com.farlens.nomo.pro'],
  'nomo': ['pro', 'com.farlens.nomo.pro'],
  'NOMO Point': ['pro', 'com.farlens.point.pro'],
  'nomo point': ['pro', 'com.farlens.point.pro'],
  'KUNI': ['pro', 'com.ginnypix.kunicam.forever'],
  'kuni': ['pro', 'com.ginnypix.kunicam.forever'],
  '1998 Cam': ['pro', 'com.canhtran.1998cam.yearly'],
  '1998cam': ['pro', 'com.canhtran.1998cam.yearly'],
  'LoFi Cam': ['pro', 'com.loficam.pro'],
  'loficam': ['pro', 'com.loficam.pro']
};

// ========= Fallback entitlement keys ========= //
const GENERIC_ENTITLEMENT_KEYS = [
  "pro", "premium", "plus", "Pro", "Premium", "Plus", "vip", "VIP",
  "unlimited", "standard", "gold", "Gold", "lifetime", "all_access",
  "premium_access", "pro_access", "isPremium", "premiumUser",
  "member", "membership", "svip", "vip_access", "full_access",
  "premium_yearly", "premium_lifetime", "unlimited_access", "paid", "Unlock",
  "full_version", "full_unlock", "unlocked", "Subscriber", "subscriber", "active"
];

// ========= Unified Constants (CRITICAL: dates MUST match) ========= //
// Dùng 2099 để đồng nhất với iTunes.js và claim "trọn đời (hết hạn 2099)" trên README.
const EXPIRES    = "2099-12-31T10:10:14Z";
const PURCHASED  = "2005-07-18T10:10:14Z";
const MGMT_URL   = "https://apps.apple.com/account/subscriptions";

// =========  Core Logic  ========= //
// =========  @z3rokaze  ========= //
var reqHeaders = ($request && $request.headers) || {};
var ua = (reqHeaders["User-Agent"] || reqHeaders["user-agent"] || "");
var uaDecoded; try { uaDecoded = decodeURIComponent(ua); } catch (e) { uaDecoded = ua; }

// Cũng kiểm tra X-RevenueCat-App-Bundle-ID header (nếu có)
var bundleId = (reqHeaders["X-RevenueCat-App-Bundle-ID"] || reqHeaders["x-revenuecat-app-bundle-id"] || "");

var rawBody = ($response && $response.body) || "";
var obj;
try { obj = JSON.parse(rawBody); } catch (e) {}
if (!obj || typeof obj !== "object" || !obj.subscriber) {
  // Không parse được hoặc thiếu subscriber -> trả nguyên body, tránh làm hỏng app
  $done({});
} else {
// Detect app từ User-Agent HOẶC Bundle ID
var match = Object.keys(mapping).find(function(e) {
  return uaDecoded.includes(e) || ua.includes(e) || bundleId.includes(e);
});

// Fallback: nếu chưa match, thử detect Locket bằng URL path hoặc body content
if (!match && obj.subscriber) {
  var urlPath = (($request && $request.url) || "").toLowerCase();
  if (urlPath.includes("locket") || bundleId.toLowerCase().includes("locket")) {
    match = "Locket";
  }
}

var prodKey = "rc_generic_premium_yearly";
var entKeys;
var isLocket = false;

if (match) {
  // App có trong mapping -> cấp đúng entitlement key riêng
  var mapped = mapping[match];
  if (mapped) {
    var ent = mapped[0];
    var prod = mapped[1];
    if (prod) prodKey = prod;
    isLocket = (match === 'Locket' || match === 'locket' || match === 'Locket Widget' || match === 'co.locket.Locket');
    entKeys = isLocket ? ['Gold', 'gold'] : [ent || "pro"];
  } else {
    entKeys = GENERIC_ENTITLEMENT_KEYS;
  }
} else {
  // App RC khác -> cấp quyền dưới nhiều entitlement key phổ biến
  entKeys = GENERIC_ENTITLEMENT_KEYS;
}

// Generate pseudo-unique transaction ID dựa trên prodKey hash
var txHash = 210000000000000;
for (var i = 0; i < prodKey.length; i++) txHash += prodKey.charCodeAt(i) * (i + 1) * 7;
var TXID = String(txHash);

// Current date for request_date (RC SDK v5+ requirement)
var now = new Date();
var REQUEST_DATE = now.toISOString().replace(/\.\d{3}Z$/, "Z");
var REQUEST_DATE_MS = now.getTime();

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
// CRITICAL: store_transaction_id + original_purchase_date trong entitlement là BẮT BUỘC cho Locket Gold
var entTemplate = {
    expires_date: EXPIRES,
    grace_period_expires_date: null,
    product_identifier: prodKey,
    product_plan_identifier: prodKey,
    purchase_date: PURCHASED,
    original_purchase_date: PURCHASED,
    store: "app_store",
    store_transaction_id: TXID
};

// ===== Subscriber-level fields (CRITICAL for Locket Gold) ===== //

// management_url ở subscriber level (đúng theo RC API spec)
if (!obj.subscriber.management_url) {
  obj.subscriber.management_url = MGMT_URL;
}

// first_seen: REQUIRED by RC SDK v5+ and Locket Gold specifically
// Nếu server chưa set, đặt mặc định = purchase_date
if (!obj.subscriber.first_seen) {
  obj.subscriber.first_seen = PURCHASED;
}

// original_app_user_id: GIỮ NGUYÊN nếu server đã set, nếu chưa thì tạo
if (!obj.subscriber.original_app_user_id) {
  obj.subscriber.original_app_user_id = "$RCAnonymousID:z3rokaze" + TXID.substring(0, 8);
}

// request_date & request_date_ms: SDK v5.2+ dùng để validate freshness
obj.subscriber.request_date = REQUEST_DATE;
obj.subscriber.request_date_ms = REQUEST_DATE_MS;

// Init các field bắt buộc
obj.subscriber.subscriptions = obj.subscriber.subscriptions || {};
obj.subscriber.entitlements = obj.subscriber.entitlements || {};
obj.subscriber.non_subscriptions = obj.subscriber.non_subscriptions || {};

// ===== Clean up any expired entitlements that could conflict ===== //
// Đối với Locket Gold: Xóa các entitlement hết hạn không phải Gold để tránh xung đột
if (isLocket) {
  for (var k in obj.subscriber.entitlements) {
    if (obj.subscriber.entitlements.hasOwnProperty(k)) {
      var existingExpiry = obj.subscriber.entitlements[k].expires_date;
      if (existingExpiry && existingExpiry !== EXPIRES) {
        try {
          if (new Date(existingExpiry).getTime() < now.getTime()) {
            delete obj.subscriber.entitlements[k];
          }
        } catch(e) {}
      }
    }
  }
}

// Merge subscription (giữ field server có thể thêm mới) thay vì ghi đè cả object
obj.subscriber.subscriptions[prodKey] = Object.assign({}, obj.subscriber.subscriptions[prodKey] || {}, subTemplate);

// Với app chưa map: gia hạn luôn mọi entitlement server đã định nghĩa sẵn (nếu có)
if (!match) {
  for (var ek in obj.subscriber.entitlements) {
    if (obj.subscriber.entitlements.hasOwnProperty(ek)) {
      var existingPid = (obj.subscriber.entitlements[ek] && obj.subscriber.entitlements[ek].product_identifier) || prodKey;
      obj.subscriber.entitlements[ek] = Object.assign({}, obj.subscriber.entitlements[ek], {
        expires_date: EXPIRES,
        purchase_date: PURCHASED,
        original_purchase_date: PURCHASED,
        grace_period_expires_date: null,
        store: "app_store",
        store_transaction_id: TXID,
        product_identifier: existingPid,
        product_plan_identifier: existingPid
      });
      obj.subscriber.subscriptions[existingPid] = Object.assign({}, obj.subscriber.subscriptions[existingPid] || {}, subTemplate, {
        product_identifier: existingPid,
        product_plan_identifier: existingPid
      });
    }
  }
}

// Locket Gold: Inject toàn bộ danh mục product ID của Locket để tương thích mọi phiên bản / currency
if (isLocket) {
  var locketProds = ['locket_1600_1y', 'locket_3600_1y', 'locket_gold_yearly', 'locket_gold_monthly', 'locket_199_1m', 'locket_399_1m'];
  for (var lp = 0; lp < locketProds.length; lp++) {
    var pid = locketProds[lp];
    obj.subscriber.subscriptions[pid] = Object.assign({}, obj.subscriber.subscriptions[pid] || {}, subTemplate, {
      product_identifier: pid,
      product_plan_identifier: pid
    });
  }
}

// Cấp quyền dưới các entitlement key mục tiêu
for (var j = 0; j < entKeys.length; j++) {
  var ek2 = entKeys[j];
  obj.subscriber.entitlements[ek2] = Object.assign({}, obj.subscriber.entitlements[ek2] || {}, entTemplate);
}

// Bổ sung non_subscriptions cho các app kiểm tra purchases trọn đời/IAP không gia hạn
if (!obj.subscriber.non_subscriptions[prodKey]) {
  obj.subscriber.non_subscriptions[prodKey] = [{
    id: TXID,
    is_sandbox: false,
    original_purchase_date: PURCHASED,
    purchase_date: PURCHASED,
    store: "app_store",
    store_transaction_id: TXID
  }];
}

var out = { body: JSON.stringify(obj) };
// Cache-bust: ngăn client lưu cache response (tránh 304 Not Modified đè patch)
try {
  if ($response && $response.headers) {
    var h = Object.assign({}, $response.headers);
    h["Cache-Control"] = "no-store, no-cache, must-revalidate";
    h["Pragma"] = "no-cache";
    delete h["ETag"];
    delete h["etag"];
    delete h["X-RevenueCat-ETag"];
    delete h["x-revenuecat-etag"];
    delete h["If-None-Match"];
    delete h["if-none-match"];
    out.headers = h;
  }
} catch (e) {}

$done(out);
}
