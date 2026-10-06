/*
 * @name: Calm Premium Unlock (Shadowrocket)
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/ekaznyra/NguyenNgocAnhTu
 * @date: 2026-07-25
 */

var obj;
try { obj = JSON.parse($response.body); } catch (e) {}

if (!obj || typeof obj !== "object") {
    $done({});
} else {
    obj.is_lifetime = true;
    obj.valid = true;
    obj.expires = "2099-12-31T23:59:59.000Z";
    obj.is_free = false;
    obj.subscription_plan = obj.subscription_plan || "com.calm.yearly.trial.one_week.usd_50";
    obj.has_ever_done_free_trial = true;
    obj.in_free_trial_window = false;
    obj.is_renewable = true;
    obj.will_renew = true;
    if (obj.user && typeof obj.user === "object") {
        obj.user.is_lifetime = true;
        obj.user.valid = true;
        obj.user.expires = "2099-12-31T23:59:59.000Z";
        obj.user.is_free = false;
    }
    $done({ body: JSON.stringify(obj) });
}
