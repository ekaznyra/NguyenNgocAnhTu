/*
 * @name: Djay Pro Premium Unlock
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/ekaznyra/NguyenNgocAnhTu
 * @date: 2026-05-09
 */

var objc;
try { objc = JSON.parse($response.body); } catch (e) {}

var djayPatch = {
    "status": 0,
    "receipt": {
        "receipt_type": "Production",
        "bundle_id": "com.algoriddim.djay-iphone",
        "in_app": [
            {
                "quantity": "1",
                "product_id": "com.algoriddim.djay_pro_yearly",
                "transaction_id": "2000001108724193",
                "original_transaction_id": "2000001108724193",
                "purchase_date": "2024-01-09 02:00:00 Etc/GMT",
                "original_purchase_date": "2024-01-09 02:00:00 Etc/GMT",
                "expires_date": "9999-01-09 02:00:00 Etc/GMT",
                "is_trial_period": "false"
            }
        ]
    },
    "latest_receipt_info": [
        {
            "quantity": "1",
            "product_id": "com.algoriddim.djay_pro_yearly",
            "transaction_id": "2000001108724193",
            "original_transaction_id": "2000001108724193",
            "purchase_date": "2024-01-09 02:00:00 Etc/GMT",
            "original_purchase_date": "2024-01-09 02:00:00 Etc/GMT",
            "expires_date": "9999-01-09 02:00:00 Etc/GMT",
            "is_trial_period": "false"
        }
    ]
};

if (objc && typeof objc === "object") {
    Object.assign(objc, djayPatch);
} else {
    objc = djayPatch;
}

$done({ body: JSON.stringify(objc) });
