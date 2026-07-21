/******************************
 * @name: Wink Forever VIP (Original script by Hausd0rff)
 * @author: Hausd0rff / Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/ekaznyra/NguyenNgocAnhTu
 * @date: 2026-07-21
 *******************************/

var body = $response.body;
if (!body) {
    $done({});
} else {
    try {
        var obj = JSON.parse(body);

        // Code gốc giải mã từ script Hausd0rff (2023-05-30)
        obj.data = {
            "active_sub_type": 2,
            "account_type": 1,
            "sub_type_name": "续期",
            "active_sub_order_id": "7069961436604422668",
            "trial_period_invalid_time": "",
            "current_order_invalid_time": "32495529599000",
            "active_order_id": "7069961436340181123",
            "limit_type": 0,
            "active_sub_type_name": "续期",
            "use_vip": true,
            "have_valid_contract": true,
            "derive_type_name": "普通会员",
            "derive_type": 1,
            "in_trial_period": false,
            "is_vip": true,
            "membership": {
                "id": "4",
                "display_name": "Wink会员",
                "gid": "1230010086"
            },
            "invalid_time": "3249550800000",
            "sub_type": 2,
            "period_type": 1,
            "contract_status": 1
        };

        obj.is_vip = true;
        obj.use_vip = true;

        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        $done({});
    }
}
