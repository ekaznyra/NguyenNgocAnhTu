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

        // Wink vip_info_by_group response structure
        const winkVipData = {
            "active_sub_type": 2,
            "account_type": 1,
            "sub_type_name": "续期",
            "active_sub_order_id": "7069961436604422668",
            "trial_period_invalid_time": "",
            "current_order_invalid_time": "32662173600000",
            "active_order_id": "7069961436340181123",
            "limit_type": 0,
            "active_sub_type_name": "续期",
            "use_vip": true,
            "have_valid_contract": true,
            "derive_type_name": "Wink VIP",
            "derive_type": 1,
            "in_trial_period": false,
            "is_vip": true,
            "membership": {
                "id": "4",
                "display_name": "Wink VIP",
                "gid": "1230010086"
            },
            "invalid_time": "32662173600000",
            "sub_type": 2,
            "period_type": 1,
            "contract_status": 1
        };

        if (obj && typeof obj === "object") {
            if (obj.data && typeof obj.data === "object") {
                Object.assign(obj.data, winkVipData);
            } else {
                obj.data = winkVipData;
            }
            obj.is_vip = true;
            obj.use_vip = true;
        }

        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        $done({});
    }
}
