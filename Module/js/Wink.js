/*
 * @name: Wink VIP Unlock
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/ekaznyra/NguyenNgocAnhTu
 * @date: 2026-07-21
 */

var body = $response.body;
if (!body) {
    $done({});
} else {
    try {
        var obj = JSON.parse(body);
        const farFuture = 32662137600; // 2099-12-31

        const vipObj = {
            "vip_type": 1,
            "vip_status": 1,
            "status": 1,
            "in_trial": 0,
            "expiry": farFuture,
            "expire_time": farFuture,
            "expire_date": "2099-12-31 23:59:59",
            "is_vip": true,
            "is_auto_renew": true,
            "product_id": "com.meitu.wink.vip.year",
            "type": 1
        };

        if (obj.data) {
            if (Array.isArray(obj.data.vip_info)) {
                obj.data.vip_info = [vipObj];
            } else if (typeof obj.data.vip_info === "object") {
                obj.data.vip_info = vipObj;
            } else {
                obj.data.vip_info = [vipObj];
            }
            obj.data.is_vip = true;
            obj.data.vip_type = 1;
            obj.data.vip_status = 1;
            obj.data.expire_time = farFuture;
        }

        if (obj.vip_info) {
            if (Array.isArray(obj.vip_info)) {
                obj.vip_info = [vipObj];
            } else {
                obj.vip_info = vipObj;
            }
        }
        obj.is_vip = true;
        obj.vip_status = 1;

        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        $done({});
    }
}
