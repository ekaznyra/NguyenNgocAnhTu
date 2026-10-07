/*
 * Spotify Premium Unlock — Grandmaster Hybrid Engine (Protobuf Binary + JSON Dual-Core)
 * Hoạt động trên TẤT CẢ 8 client proxy (Shadowrocket/LanceX/Egern/Surge/Loon/QX/Stash).
 * Tương thích 100% test contract:
 * - JSON-only endpoints: v1/me, identity/v3/me, device-capabilities, user-attributes
 * - Protobuf binary endpoints: bootstrap/v1/bootstrap, melody/v1/check_license
 * - Cache-Bust: Cache-Control = "no-store", xóa ETag, xóa If-None-Match
 * - Fail-safe: $done({}) khi gặp lỗi hoặc không thay đổi
 */

(function () {
  var url = ($request && $request.url) || "";
  var rawBody = ($response && $response.body) || "";

  // 1. Phân hệ Binary Protobuf (bootstrap / melody)
  var isBootstrap = url.indexOf("/bootstrap/v1/bootstrap") !== -1;
  var isCheckLicense = url.indexOf("/melody/v1/check_license") !== -1;

  if (isBootstrap || isCheckLicense) {
    if (typeof rawBody === "string" && rawBody.length > 0) {
      try {
        var modifiedProto = rawBody
          .replace(/\x04free/g, "\x07premium")
          .replace(/type\x04free/g, "type\x07premium")
          .replace(/\x06client\x04free/g, "\x06client\x07premium");

        if (modifiedProto !== rawBody) {
          var protoHeaders = ($response && $response.headers) ? Object.assign({}, $response.headers) : {};
          protoHeaders["Cache-Control"] = "no-store";
          protoHeaders["Pragma"] = "no-cache";
          delete protoHeaders["ETag"];
          delete protoHeaders["etag"];
          delete protoHeaders["If-None-Match"];
          delete protoHeaders["if-none-match"];
          $done({ body: modifiedProto, headers: protoHeaders });
          return;
        }
      } catch (e) {}
    }
  }

  // 2. Phân hệ JSON
  var body;
  try {
    body = JSON.parse(rawBody);
  } catch (e) {
    $done({});
    return;
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    $done({});
    return;
  }

  var changed = false;

  // 2.1. api.spotify.com/v1/me
  if (url.indexOf("api.spotify.com") !== -1 && url.indexOf("/v1/me") !== -1) {
    if ("product" in body || "type" in body) {
      body.product = "premium";
      body.type = "premium";
      changed = true;
    }
    if (body.restrictions) {
      body.restrictions = [];
      changed = true;
    }
    if (body.explicit_content && typeof body.explicit_content === "object") {
      body.explicit_content.filter_locked = false;
      changed = true;
    }
    if (body.plan && typeof body.plan === "object") {
      body.plan.name = "premium";
      changed = true;
    }
  }

  // 2.2. spclient.wg.spotify.com/identity/v3/me
  if (url.indexOf("identity/v3/me") !== -1) {
    if ("type" in body || "product" in body || "id" in body) {
      body.type = "premium";
      if ("product" in body) body.product = "premium";
      changed = true;
    }
  }

  // 2.3. spclient .../device-capabilities/v1/capabilities
  if (url.indexOf("device-capabilities/v1/capabilities") !== -1) {
    body.effective_license = "premium";
    if (!body.supports_hifi || typeof body.supports_hifi !== "object") {
      body.supports_hifi = {};
    }
    body.supports_hifi.fully_supported = true;
    body.supports_hifi.user_eligible = true;
    changed = true;
  }

  // 2.4. spclient .../user-attributes/v1/attributes
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
    try {
      if ($response && $response.headers) {
        var h = Object.assign({}, $response.headers);
        h["Cache-Control"] = "no-store";
        h["Pragma"] = "no-cache";
        delete h["ETag"];
        delete h["etag"];
        delete h["If-None-Match"];
        delete h["if-none-match"];
        out.headers = h;
      }
    } catch (e) {}
    $done(out);
  } else {
    $done({});
  }
})();
