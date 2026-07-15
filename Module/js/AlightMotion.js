/*
 * @name: Alight Motion Pro Unlock
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/ekaznyra/NguyenNgocAnhTu
 * @date: 2026-04-21
 */

var objc;
try { objc = JSON.parse($response.body); } catch (e) {}

var amResult = {
        "result": "success",
        "msTime": Date.now(),
        "accountCreatedMillis": null,
        "licenses": [
        {
            "benefits": [
                "RemoveWatermark",
                "MemberEffects",
                "ProjectPackageSharing",
                "FutureMemberFeatures",
                "AdvancedEasing",
                "CameraObjects",
                "LayerParenting",
                "CloudStorageLowTier"
            ],
            "type": "subscription",
            "store": "apple_app_store",
            "autoRenewing": true,
            "orderNumber": "300001752007005",
            "productId": "alightcreative.motion.1y_t60_1w",
            "period": "1y",
            "label": null,
            "details": null,
            "expires": 32662137600000,
            "valid": true,
            "linkStatus": "linked-current"
        }
        ],
        "warnings": []
};

if (objc && typeof objc === "object") {
    objc.result = amResult;
} else {
    objc = { "result": amResult };
}

$done({ body: JSON.stringify(objc) });
