/*
 * @name: SoundCloud Go+ Unlock (Shadowrocket)
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/ekaznyra/NguyenNgocAnhTu
 * @date: 2026-07-25
 */

var body = $response.body; 
var obj;
try { obj = JSON.parse(body); } catch (e) {}

if (obj) {
  obj.plan = {
    "vendor": "apple",
    "id": "high_tier",
    "manageable": true,
    "plan_upsells": [],
    "plan_id": "go-plus",
    "upsells": [],
    "plan_name": "SoundCloud Go+"
  };

  obj.features = [
    { "name": "offline_sync", "enabled": true },
    { "name": "no_ads", "enabled": true },
    { "name": "high_quality_audio", "enabled": true },
    { "name": "unlimited_tracks", "enabled": true }
  ];

  $done({ body: JSON.stringify(obj) });
} else {
  $done({});
}
