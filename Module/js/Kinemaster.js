/*
 * @name: KineMaster Pro Unlock
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/ekaznyra/NguyenNgocAnhTu
 * @date: 2026-04-21
 */

var obj;
try { obj = JSON.parse($response.body); } catch (e) {}

if (obj && typeof obj === "object") {
    obj.is_valid_device = true;
    obj.has_valid_subscription = true;
    obj.expiration_date_ms = 4071600000000;
    obj.is_table_resettable = true;
    obj.subscription_product_id = "com.kinemaster.sub.annual.ia2";
    obj.state_code = 0;
} else {
    obj = {
        "is_valid_device": true,
        "has_valid_subscription": true,
        "expiration_date_ms": 4071600000000,
        "is_table_resettable": true,
        "subscription_product_id": "com.kinemaster.sub.annual.ia2",
        "state_code": 0
    };
}

$done({ body: JSON.stringify(obj) });
