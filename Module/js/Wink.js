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

        const farFutureMs = "32662173600000";
        const farFutureSec = 32662137600;

        const vipObj = {
            "vip_type": "svip",
            "vip_status": 1,
            "in_trial": 0,
            "expiry": farFutureSec,
            "expire_time": farFutureSec,
            "level_info": { "level": 10, "days": 9999, "end_days": 9999 },
            "is_auto_renew": true,
            "product_id": "com.meitu.wink.vip.yearly",
            "purchase_date": "2024-01-09T02:00:00Z",
            "store": "apple"
        };

        const winkVipData = {
            "active_sub_type": 2,
            "account_type": 1,
            "sub_type_name": "续期",
            "active_sub_order_id": "7069961436604422668",
            "trial_period_invalid_time": "",
            "current_order_invalid_time": farFutureMs,
            "active_order_id": "7069961436340181123",
            "limit_type": 0,
            "active_sub_type_name": "续期",
            "use_vip": true,
            "have_valid_contract": true,
            "derive_type_name": "Wink VIP",
            "derive_type": 1,
            "in_trial_period": false,
            "is_vip": true,
            "vip_type": "svip",
            "vip_status": 1,
            "membership": {
                "id": "4",
                "display_name": "Wink VIP",
                "gid": "1230010086"
            },
            "invalid_time": farFutureMs,
            "expire_time": farFutureSec,
            "expiry": farFutureSec,
            "sub_type": 2,
            "period_type": 1,
            "contract_status": 1,
            "vip_info": vipObj
        };

        if (obj && typeof obj === "object") {
            if (obj.data && typeof obj.data === "object") {
                Object.assign(obj.data, winkVipData);
            } else {
                obj.data = winkVipData;
            }
            obj.is_vip = true;
            obj.use_vip = true;
            obj.vip_type = "svip";
            obj.vip_status = 1;
            obj.vip_info = vipObj;
        }

        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        $done({});
    }
}
