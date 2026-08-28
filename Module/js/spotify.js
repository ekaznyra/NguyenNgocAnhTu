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
  }

  // spclient .../identity/v3/me : account type
  if (url.indexOf("identity/v3/me") !== -1) {
    if ("type" in body || "product" in body || "id" in body) {
      body.type = "premium";
      if ("product" in body) body.product = "premium";
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
        if (h["ETag"] !== undefined) delete h["ETag"];
        if (h["etag"] !== undefined) delete h["etag"];
        out.headers = h;
      }
    } catch (e) {}
    $done(out);
  } else {
    $done({});
  }
})();
