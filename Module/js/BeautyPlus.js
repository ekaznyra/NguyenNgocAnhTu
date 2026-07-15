/*
 * @name: BeautyPlus Premium Unlock
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/ekaznyra/NguyenNgocAnhTu
 * @date: 2026-04-21
 */

var objc;
try { objc = JSON.parse($response.body); } catch (e) { objc = null; }

var url = $request.url;
if (/newbeee-api\.beautyplus\.com\/api\/v1\/asset\/balance/.test(url)) {
    // Endpoint asset/balance: chỉ ép điểm/số dư, giữ nguyên gid/created_at server cấp
    if (!objc || typeof objc !== "object") objc = { "message": "success", "data": {} };
    if (!objc.data || typeof objc.data !== "object") objc.data = {};
    objc.data.points = 999999999;
    objc.data.balance = 999999999;
    objc.data.next_claim = 1;
} else {
    // Endpoint manual_unlock / VIP
    if (!objc || typeof objc !== "object") objc = { "message": "success", "data": {} };
    objc.message = "success";
    objc.vip_expires_date = 4071600000;
}

$done({ body: JSON.stringify(objc) });
