/*
 * @name: Quizlet Plus Unlock
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/ekaznyra/NguyenNgocAnhTu
 * @date: 2026-10-07
 * @desc: Mở khóa Quizlet Plus (Flashcards, Giải thích chuyên sâu, Học Offline, Không quảng cáo)
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

  var EXP_TS_SEC = 4102444800; // 2100-01-01

  // 1. Phản hồi mảng chuẩn của Quizlet webapi/3.4/users/
  if (data.responses && Array.isArray(data.responses)) {
    for (var i = 0; i < data.responses.length; i++) {
      var item = data.responses[i];
      if (item && item.models && item.models.user && Array.isArray(item.models.user)) {
        for (var u = 0; u < item.models.user.length; u++) {
          var userObj = item.models.user[u];
          userObj.is_plus = true;
          userObj.is_premium = true;
          userObj.has_free_trial = false;
          userObj.has_verified_email = true;
          userObj.self_study_subscription_type = 2; // 2 = Quizlet Plus
          userObj.subscription_expiration_date = EXP_TS_SEC;
          userObj.can_create_rich_text = true;
          userObj.can_upload_custom_audio = true;
          userObj.can_upload_custom_images = true;
        }
      }
    }
  }

  // 2. Direct user object fallback
  if (data.is_plus !== undefined || data.username !== undefined) {
    data.is_plus = true;
    data.is_premium = true;
    data.has_free_trial = false;
    data.self_study_subscription_type = 2;
    data.subscription_expiration_date = EXP_TS_SEC;
    data.can_create_rich_text = true;
    data.can_upload_custom_audio = true;
    data.can_upload_custom_images = true;
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
