/*
 * Photomath Plus Unlock - ekaznyra (rewrite 2026-06-15)
 * Endpoint: ^https?:\/\/lapi\.photomath\.net\/v4\/me
 *
 * Vì sao viết lại:
 *  - Script gốc (deezertidal/private/poh.js, của 墨鱼手记/ddgksf2013) hardcode toàn
 *    bộ body với subscription.expiry = "2025-01-15" -> đã hết hạn, unlock chết.
 *  - Bản này KHÔNG ghi đè cứng. Nó parse response thật rồi chỉ chỉnh các field
 *    cần thiết (subscription + tier), đặt hạn xa (2099) nên bền hơn khi API đổi.
 *
 * Nguồn tham khảo / để cập nhật khi có bản mới:
 *  - https://raw.githubusercontent.com/deezertidal/private/master/js-backup/Crack/poh.js
 *  - https://github.com/89996462/Quantumult-X  (thư mục ycdz - kiểm tra định kỳ)
 */

let rawBody = ($response && $response.body) || "";
let obj;
try {
  obj = JSON.parse(rawBody);
} catch (e) {
  // Không parse được -> để nguyên response ở cuối (tránh làm hỏng app)
  obj = null;
}

const FAR_FUTURE = "2099-12-31T23:59:59.000Z";
const STARTED = "2021-01-01T00:00:00.000Z";

if (obj && typeof obj === "object") {
  // content có thể nằm ở obj.content (v4/me) - giữ nguyên các field khác
  const c = obj.content && typeof obj.content === "object" ? obj.content : obj;

  // Gói Genius (Plus). Giữ lại giá trị cũ nếu có, chỉ ép các field quyết định quyền.
  const oldSub = (c.subscription && typeof c.subscription === "object") ? c.subscription : {};
  c.subscription = Object.assign({}, oldSub, {
    packageName: oldSub.packageName || "com.microblink.PhotoMath",
    productId: oldSub.productId || "com.microblink.PhotoMath.purchase.genius.one_year",
    orderId: oldSub.orderId || "320000813070599",
    expiry: FAR_FUTURE,
    started: oldSub.started || STARTED,
    autoRenewing: true,
    status: "active",
    inGracePeriod: false
  });

  // Tier "genius" = bản trả phí
  const oldTier = (c.tier && typeof c.tier === "object") ? c.tier : {};
  c.tier = Object.assign({}, oldTier, {
    level: "genius",
    added: oldTier.added || STARTED
  });

  // Một số phiên bản đọc scope/quyền ở mảng scope
  if (Array.isArray(c.scope) && c.scope.indexOf("paid:solution") === -1) {
    c.scope.push("paid:solution");
  }
}

$done(obj && typeof obj === "object" ? { body: JSON.stringify(obj) } : {});
