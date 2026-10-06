/*
 * @name: Cake English & Korean Plus Unlock
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/ekaznyra/NguyenNgocAnhTu
 * @date: 2026-10-07
 * @desc: Mở khóa gói Cake Plus (Luyện nói không giới hạn, Video phụ đề song ngữ, Không quảng cáo)
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

  var EXP_ISO = "2099-12-31T23:59:59.000Z";

  // 1. Cấu trúc membership trực tiếp
  if (data.membership && typeof data.membership === 'object') {
    data.membership.type = "PLUS";
    data.membership.status = "ACTIVE";
    data.membership.is_active = true;
    data.membership.started_at = "2024-01-01T00:00:00Z";
    data.membership.expire_at = EXP_ISO;
    data.membership.expired_at = EXP_ISO;
    data.membership.payment_type = "APP_STORE";
    data.membership.auto_renew = true;
  } else if (!data.membership && data.id) {
    data.membership = {
      type: "PLUS",
      status: "ACTIVE",
      is_active: true,
      started_at: "2024-01-01T00:00:00Z",
      expire_at: EXP_ISO,
      expired_at: EXP_ISO,
      payment_type: "APP_STORE",
      auto_renew: true
    };
  }

  // 2. Cấu trúc bọc trong data payload
  if (data.data && typeof data.data === 'object') {
    data.data.is_plus = true;
    data.data.membership = Object.assign({}, data.data.membership || {}, {
      type: "PLUS",
      status: "ACTIVE",
      is_active: true,
      started_at: "2024-01-01T00:00:00Z",
      expire_at: EXP_ISO,
      expired_at: EXP_ISO,
      payment_type: "APP_STORE",
      auto_renew: true
    });
  }

  var out = { body: JSON.stringify(data) };

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
