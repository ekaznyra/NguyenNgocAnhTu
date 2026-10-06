/*
 * Spotify Premium Unlock — self-hosted, JSON-only (no protobuf required)
 * Hoạt động trên TẤT CẢ 8 client proxy (Shadowrocket/LanceX/Egern/Surge/Loon/QX/Stash).
 * Patch các endpoint chứa cờ premium mà KHÔNG cần global `protobuf`:
 *   - https://api.spotify.com/v1/me                  -> product/type = premium
 *   - https://spclient.wg.spotify.com/identity/v3/me -> type = premium
 * Defensive: luôn pass-through (giữ nguyên response gốc) khi gặp lỗi.
 */
(function () {
  var url = ($request && $request.url) || "";
  var body;
  try {
    body = JSON.parse($response.body);
  } catch (e) {
    $done({});
    return;
  }
  if (!body || typeof body !== "object") {
    $done({});
    return;
  }

  var changed = false;

  // api.spotify.com/v1/me : cờ premium chuẩn của app
  if (url.indexOf("api.spotify.com") !== -1 && url.indexOf("/v1/me") !== -1) {
    if ("product" in body || "type" in body) {
      body.product = "premium";
      body.type = "premium";
      changed = true;
    }
    // Xoá restrictions để mở khoá tính năng premium (tải nhạc, chất lượng cao...)
    // chỉ act khi response thật sự có field này (fail-safe).
    if (body.restrictions) {
      body.restrictions = [];
      changed = true;
    }
    // Mở khoá Explicit Content filter (không bị khoá theo vùng)
    if (body.explicit_content && typeof body.explicit_content === "object") {
      body.explicit_content.filter_locked = false;
      changed = true;
    }
    // Hỗ trợ các bản cập nhật endpoint có thuộc tính plan
    if (body.plan && typeof body.plan === "object") {
      body.plan.name = "premium";
      changed = true;
    }
  }

  // spclient .../identity/v3/me : account type
  if (url.indexOf("identity/v3/me") !== -1) {
    if ("type" in body || "product" in body || "id" in body) {
      body.type = "premium";
      if ("product" in body) body.product = "premium";
      changed = true;
    }
  }

  // spclient .../device-capabilities/v1/capabilities : license & HiFi capabilities (Spotify 2026)
  if (url.indexOf("device-capabilities/v1/capabilities") !== -1) {
    body.effective_license = "premium";
    if (!body.supports_hifi || typeof body.supports_hifi !== "object") {
      body.supports_hifi = {};
    }
    body.supports_hifi.fully_supported = true;
    body.supports_hifi.user_eligible = true;
    changed = true;
  }

  // spclient .../user-attributes/v1/attributes : stream quality, ads, mobile playback
  if (url.indexOf("user-attributes") !== -1) {
    if (body.values && typeof body.values === "object") {
      body.values.type = "premium";
      body.values.license = "premium";
      body.values["financial-product"] = "pr:premium,du:12";
      body.values.ads = "false";
      body.values["high-bitrate"] = "true";
      body.values.mobile = "true";
      body.values.can_stream = "true";
      body.values.unlimited = "true";
      body.values["catalogue-exclusive"] = "true";
      body.values["loudness-levels"] = "1";
      changed = true;
    }
  }

  if (changed) {
    var out = { body: JSON.stringify(body) };
    // Cache-bust: ngăn client lưu response premium vào cache (tránh 304 đè patch)
    try {
      if ($response && $response.headers) {
        var h = $response.headers;
        h["Cache-Control"] = "no-store";
        h["Pragma"] = "no-cache";
        if (h["ETag"] !== undefined) delete h["ETag"];
        if (h["etag"] !== undefined) delete h["etag"];
        if (h["If-None-Match"] !== undefined) delete h["If-None-Match"];
        if (h["if-none-match"] !== undefined) delete h["if-none-match"];
        out.headers = h;
      }
    } catch (e) {}
    $done(out);
  } else {
    $done({});
  }
})();
