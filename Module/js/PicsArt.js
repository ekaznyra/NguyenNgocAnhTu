/*
 * @name: PicsArt Gold Unlock
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/ekaznyra/NguyenNgocAnhTu
 * @date: 2026-05-09
 */

let objc = {
    "status": "success",
    "response": [
        {
            "status": "SUBSCRIPTION_RENEWED",
            "is_trial": false,
            "order_id": "2000001108782321",
            "expire_date": 32662137600000,
            "purchase_date": 1704758400000,
            "subscription_id": "com.picsart.studio.subscription_pro_3_yearly",
            "original_order_id": "2000000756285050",
            "plan_meta": {
                "permissions": [
                    "premium_tools_standard",
                    "premium_tools_ai"
                ],
                "auto_renew_product_id": "com.picsart.studio.subscription_mac_tier1_pro_yearly",
                "level": 2000,
                "storage_limit_in_mb": 102400,
                "id": "com.picsart.studio.subscription_pro_3_yearly",
                "frequency": "yearly",
                "type": "renewable",
                "scope_id": "full",
                "product_id": "com.picsart.studio.subscription_pro_3_yearly",
                "tier_id": "pro"
            },
            "limitation": {
                "max_count": 10,
                "limits_exceeded": false
            },
            "is_eligible_for_introductory": false,
            "reason": "ok"
        }
    ]
}

// Handle storages endpoint
if (($request && $request.url || "").includes("/storages")) {
    objc = {
        "status": "success",
        "response": {
            "storages": [
                {
                    "storage_id": "cloud_storage_premium",
                    "storage_limit_in_mb": 102400,
                    "used_storage_in_mb": 0
                }
            ]
        }
    };
}

$done({ body: JSON.stringify(objc) });
