/*
 * @name: Duolingo Super / Duolingo Max Unlock
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/ekaznyra/NguyenNgocAnhTu
 * @date: 2026-10-07
 * @desc: Mở khóa Super Duolingo & Duolingo Max (Vô hạn tim, Không quảng cáo, Duolingo Max AI)
 */

(function () {
  'use strict';

  var res = typeof $response !== 'undefined' ? $response : null;
  var body = (res && res.body) ? res.body : '';

  if (!body || typeof body !== 'string') {
    if (typeof $done !== 'undefined') $done({});
    return;
  }

  var data;
  try {
    data = JSON.parse(body);
  } catch (e) {
    if (typeof $done !== 'undefined') $done({});
    return;
  }

  if (!data || typeof data !== 'object') {
    if (typeof $done !== 'undefined') $done({});
    return;
  }

  var EXP_TS_MS = 4102444800000; // 2100-01-01

  // 1. Cấp cờ thành viên Super / Max
  data.hasPlus = true;
  data.hasSuper = true;
  data.hasPremium = true;
  data.isSubscribed = true;
  data.plus_membership = true;
  data.gold_subscription = true;
  data.tier = "plus";
  data.adsEnabled = false;
  data.superObserver = false;
  data.superDuoFeatureStatus = "AVAILABLE";

  // 2. Vô hạn Hearts (Máu/Tim không bao giờ hết)
  if (!data.health || typeof data.health !== 'object') {
    data.health = {};
  }
  data.health.unlimited = true;
  data.health.eligibleForFreeRefill = true;
  data.health.hearts = 5;
  data.health.maxHearts = 5;

  // 3. Gems & Lingots (Đá quý & bánh quy dồi dào)
  if (typeof data.gems === 'number' && data.gems < 99999) {
    data.gems = 99999;
  }
  if (typeof data.lingots === 'number' && data.lingots < 9999) {
    data.lingots = 9999;
  }

  // 4. Streak Freeze bảo vệ chuỗi ngày học
  if (typeof data.streakFreeze === 'number' && data.streakFreeze < 2) {
    data.streakFreeze = 2;
  }

  // 5. Tracking Properties (Bypass kiểm tra telemetry phía client)
  if (!data.trackingProperties || typeof data.trackingProperties !== 'object') {
    data.trackingProperties = {};
  }
  data.trackingProperties.has_plus = true;
  data.trackingProperties.has_super = true;
  data.trackingProperties.is_subscribed = true;
  data.trackingProperties.gold_subscription = true;

  // 6. Active Subscriptions
  if (Array.isArray(data.subscriptions)) {
    data.subscriptions.push({
      id: "sub_duolingo_max_2099",
      tier: "plus",
      status: "ACTIVE",
      autoRenew: true,
      period: "ANNUAL",
      expiresAt: EXP_TS_MS
    });
  }

  var out = { body: JSON.stringify(data) };

  // Cache-bust: Tránh App Store/Client cache response cũ (ngăn 304 Not Modified)
  try {
    var h = (res && res.headers) ? Object.assign({}, res.headers) : {};
    h["Cache-Control"] = "no-store, no-cache, must-revalidate";
    h["Pragma"] = "no-cache";
    delete h["ETag"];
    delete h["etag"];
    delete h["If-None-Match"];
    delete h["if-none-match"];
    out.headers = h;
  } catch (e) {}

  if (typeof $done !== 'undefined') $done(out);
})();
