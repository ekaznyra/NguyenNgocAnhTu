// Comprehensive Functional Test Suite for Standalone scripts in Module/js
const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;

function check(title, condition, details) {
  if (condition) {
    pass++;
    console.log('  PASS  ' + title);
  } else {
    fail++;
    console.log('  FAIL  ' + title + ' -> ' + details);
  }
}

function runScript(filename, req, res) {
  let doneArg = null;
  const code = fs.readFileSync(path.join(__dirname, '..', 'Module', 'js', filename), 'utf8');
  const fn = new Function('$request', '$response', '$done', 'console', code);
  fn(
    req,
    res,
    (arg) => { doneArg = arg; },
    { log: () => {}, warn: () => {}, error: () => {} }
  );
  return doneArg;
}

console.log('== Standalone Scripts Comprehensive Functional Suite ==');

// 1. AlightMotion.js
{
  const out = runScript('AlightMotion.js', { url: 'https://us-central1-alight-creative.cloudfunctions.net/getAccountStatusAndLicenses' }, { body: '{}' });
  const b = JSON.parse(out.body);
  const lic = b.result && b.result.licenses;
  check('AlightMotion: licenses injected', lic && lic.length > 0 && lic[0].valid === true, out ? out.body : 'null');
}

// 2. BeautyPlus.js
{
  const out = runScript('BeautyPlus.js', { url: 'https://api.mr.pixocial.com/v1/manual_unlock' }, { body: '{"data":{}}' });
  const b = JSON.parse(out.body);
  check('BeautyPlus: vip_expires_date set', b.vip_expires_date > 0, out ? out.body : 'null');
}

// 3. busuu.js
{
  const out = runScript('busuu.js', { url: 'https://api.busuu.com/users/me' }, { body: JSON.stringify({ user: { id: 1, premium: false } }) });
  const b = JSON.parse(out.body);
  check('busuu: premium=true', b.user && b.user.premium === true && b.user.subscription_type === 'premium_plus', out ? out.body : 'null');
}

// 4. calm.js
{
  const out = runScript('calm.js', { url: 'https://api.calm.com/me' }, { body: JSON.stringify({ is_lifetime: false, user: { is_lifetime: false } }) });
  const b = JSON.parse(out.body);
  check('calm: is_lifetime=true', b.is_lifetime === true && b.user && b.user.is_lifetime === true, out ? out.body : 'null');
}

// 5. camScanner.js
{
  const out = runScript('camScanner.js', { url: 'https://api.intsig.net/purchase/cs/query_prop' }, { body: JSON.stringify({ data: {} }) });
  const b = JSON.parse(out.body);
  check('camScanner: psnl_vip_property injected', b.data && b.data.psnl_vip_property && b.data.psnl_vip_property.vip_type === 'svip', out ? out.body : 'null');
}

// 6. Kinemaster.js
{
  const out = runScript('Kinemaster.js', { url: 'https://api-account.kinemasters.com' }, { body: JSON.stringify({ has_valid_subscription: false }) });
  const b = JSON.parse(out.body);
  check('Kinemaster: has_valid_subscription=true', b.has_valid_subscription === true, out ? out.body : 'null');
}

// 7. oldroll.js
{
  const out = runScript('oldroll.js', { url: 'https://server.yoyiapp.com' }, { body: JSON.stringify({ result: { is_vip: false } }) });
  const b = JSON.parse(out.body);
  check('oldroll: is_vip=true', b.result && b.result.is_vip === true && b.result.vip_type === 'forever', out ? out.body : 'null');
}

// 8. photomath.js
{
  const out = runScript('photomath.js', { url: 'https://lapi.photomath.net/v4/me' }, { body: JSON.stringify({ subscription: { status: 'none' }, tier: { level: 'free' } }) });
  const b = JSON.parse(out.body);
  check('photomath: status=active & genius', b.subscription && b.subscription.status === 'active' && b.tier && b.tier.level === 'genius', out ? out.body : 'null');
}

// 9. Snow.js
{
  const out = runScript('Snow.js', { headers: { 'User-Agent': 'iphoneapp.snow/1.0' } }, { body: JSON.stringify({ result: {} }) });
  const b = JSON.parse(out.body);
  check('Snow: activated=true & products', b.result && b.result.activated === true && b.result.products.length > 0, out ? out.body : 'null');
}

// 10. VSCO.js
{
  const out = runScript('VSCO.js', { url: 'https://vsco.co' }, { body: JSON.stringify({ user_subscription: { is_active: false } }) });
  const b = JSON.parse(out.body);
  check('VSCO: is_active=true', b.user_subscription && b.user_subscription.is_active === true, out ? out.body : 'null');
}

// 11. Wink.js
{
  const out = runScript('Wink.js', { url: 'https://api-sub.meitu.com/vip' }, { body: JSON.stringify({ is_vip: false }) });
  const b = JSON.parse(out.body);
  check('Wink: is_vip=true', b.is_vip === true && b.data && b.data.is_vip === true, out ? out.body : 'null');
}

// 12. wps.js
{
  const out = runScript('wps.js', { url: 'https://account.wps.cn' }, { body: JSON.stringify({ result: 'fail' }) });
  const b = JSON.parse(out.body);
  check('wps: level=88 & vip', b.result === 'ok' && b.level === 88 && b.vip && b.vip.enabled.length === 3, out ? out.body : 'null');
}

// 13. xmind.js
{
  const out = runScript('xmind.js', { url: 'https://www.xmind.net' }, { body: JSON.stringify({ license: { status: 'none' } }) });
  const b = JSON.parse(out.body);
  check('xmind: license.status=sub', b.license && b.license.status === 'sub', out ? out.body : 'null');
}

// 14. djay.js
{
  const out = runScript('djay.js', { url: 'https://app.algoriddim.com' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('djay: pro yearly in_app injected', b.receipt && b.receipt.in_app[0].product_id === 'com.algoriddim.djay_pro_yearly', out ? out.body : 'null');
}

// 15. emby.js
{
  const out = runScript('emby.js', { url: 'https://mb3admin.com' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('emby: resultCode=GOOD', b.resultCode === 'GOOD' && b.cacheExpirationDays === 999, out ? out.body : 'null');
}

// 16. fimo.js
{
  const out = runScript('fimo.js', { url: 'https://fimo.app' }, { body: JSON.stringify({ user: {} }) });
  const b = JSON.parse(out.body);
  check('fimo: isSubscribe=true', b.user && b.user.isSubscribe === true && b.user.subscribe === 1, out ? out.body : 'null');
}

// 17. funimate.js
{
  const out = runScript('funimate.js', { url: 'https://api.funimate.com' }, { body: JSON.stringify({ user: { is_pro: false } }) });
  const b = JSON.parse(out.body);
  check('funimate: user.is_pro=true', b.user && b.user.is_pro === true && b.user.pro_status === 'active', out ? out.body : 'null');
}

// 18. photoshop.js
{
  const out = runScript('photoshop.js', { url: 'https://lcs-mobile-cops.adobe.io' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('photoshop: PHOTOSHOP_EXPRESS_PREMIUM active', b.mobileProfile && b.mobileProfile.profileStatus === 'PROFILE_AVAILABLE', out ? out.body : 'null');
}

// 19. PicsArt.js
{
  const out = runScript('PicsArt.js', { url: 'https://api.picsart.com/gw-v2/shop/subscription/apple/purchases' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('PicsArt: subscription renewed & pro', b.status === 'success' && b.response[0].status === 'SUBSCRIPTION_RENEWED', out ? out.body : 'null');
}

// 20. darkroom.js
{
  const out = runScript('darkroom.js', { url: 'https://v1.darkroom.co' }, { body: JSON.stringify({ profile: {} }) });
  const b = JSON.parse(out.body);
  check('darkroom: is_subscriber=true', b.profile && b.profile.is_subscriber === true && b.profile.membership_type === 'forever', out ? out.body : 'null');
}

// 21. headspace.js
{
  const out = runScript('headspace.js', { url: 'https://api.prod.headspace.com/user-subscriptions' }, { body: JSON.stringify({ has_subscription: false }) });
  const b = JSON.parse(out.body);
  check('headspace: has_subscription=true', b.has_subscription === true && b.subscriptions && b.subscriptions.length > 0, out ? out.body : 'null');
}

// 22. meitu.js
{
  const out = runScript('meitu.js', { url: 'https://api.xiuxiu.meitu.com' }, { body: JSON.stringify({ is_vip: false }) });
  const b = JSON.parse(out.body);
  check('meitu: is_vip=true & svip', b.is_vip === true && b.vip_info && b.vip_info.vip_type === 'svip', out ? out.body : 'null');
}

// 23. soundcloud.js
{
  const out = runScript('soundcloud.js', { url: 'https://api-mobile.soundcloud.com' }, { body: JSON.stringify({ plan: {} }) });
  const b = JSON.parse(out.body);
  check('soundcloud: plan_id=go-plus', b.plan && b.plan.plan_id === 'go-plus' && b.features && b.features.length > 0, out ? out.body : 'null');
}

// 24. TrueCaller.js
{
  const out = runScript('TrueCaller.js', { url: 'https://premium-none.truecaller.com/v1/subscriptions/status' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('TrueCaller: subscriptionStatus=SUBSCRIBED', b.subscriptionStatus === 'SUBSCRIBED' && b.product && b.product.sku === 'apple_gold_family_yearly_v0', out ? out.body : 'null');
}

// 25. iTunes.js (Dazz Cam verifyReceipt)
{
  const out = runScript('iTunes.js', { headers: { 'User-Agent': 'dazz.camera/1.0' } }, { body: JSON.stringify({ receipt: { bundle_id: 'dazz.camera' } }) });
  const b = JSON.parse(out.body);
  const inApp = b.receipt && b.receipt.in_app;
  check('iTunes: Dazz Cam forever IAP injected', inApp && inApp.length > 0 && inApp[0].product_id === 'com.haocai.dazzcam.forever', out ? out.body : 'null');
}

// 26. iTunes.js (ProCCD verifyReceipt)
{
  const out = runScript('iTunes.js', { headers: { 'User-Agent': 'com.yengshine.proccd/1.0' } }, { body: JSON.stringify({ receipt: { bundle_id: 'com.yengshine.proccd' } }) });
  const b = JSON.parse(out.body);
  const inApp = b.receipt && b.receipt.in_app;
  check('iTunes: ProCCD yearly IAP injected', inApp && inApp.length > 0 && inApp[0].product_id === 'com.yengshine.proccd.yearly', out ? out.body : 'null');
}

// 27. iTunes.js (EE35 Film verifyReceipt)
{
  const out = runScript('iTunes.js', { headers: { 'User-Agent': 'com.eightivedesign.ee35/1.0' } }, { body: JSON.stringify({ receipt: { bundle_id: 'com.eightivedesign.ee35' } }) });
  const b = JSON.parse(out.body);
  const inApp = b.receipt && b.receipt.in_app;
  check('iTunes: EE35 Film lifetime IAP injected', inApp && inApp.length > 0 && inApp[0].product_id === 'com.eightivedesign.ee35.lifetime', out ? out.body : 'null');
}

// 28. iTunes.js (NOMO CAM verifyReceipt)
{
  const out = runScript('iTunes.js', { headers: { 'User-Agent': 'com.farlens.nomo/1.0' } }, { body: JSON.stringify({ receipt: { bundle_id: 'com.farlens.nomo' } }) });
  const b = JSON.parse(out.body);
  const inApp = b.receipt && b.receipt.in_app;
  check('iTunes: NOMO CAM pro IAP injected', inApp && inApp.length > 0 && inApp[0].product_id === 'com.farlens.nomo.pro', out ? out.body : 'null');
}

// 29. iTunes.js (Bazaart verifyReceipt)
{
  const out = runScript('iTunes.js', { headers: { 'User-Agent': 'bazaart/1.0' } }, { body: JSON.stringify({ receipt: { bundle_id: 'bazaart' } }) });
  const b = JSON.parse(out.body);
  const inApp = b.receipt && b.receipt.in_app;
  check('iTunes: Bazaart super VIP injected', inApp && inApp.length > 0 && inApp[0].product_id === 'Bazaart_Super_Three_Months_v4', out ? out.body : 'null');
}

// 30. duolingo.js
{
  const out = runScript('duolingo.js', { url: 'https://duolingo.com/2017-06-30/users/12345' }, { body: JSON.stringify({ id: 12345, username: 'testuser', hasPlus: false }) });
  const b = JSON.parse(out.body);
  check('duolingo: hasPlus=true & health unlimited', b.hasPlus === true && b.health && b.health.unlimited === true, out ? out.body : 'null');
}

// 31. cake.js
{
  const out = runScript('cake.js', { url: 'https://api.mycake.me/membership/me' }, { body: JSON.stringify({ isMember: false, membership: { type: 'NONE', status: 'INACTIVE' } }) });
  const b = JSON.parse(out.body);
  check('cake: membership.type=PLUS & ACTIVE', b.membership && b.membership.type === 'PLUS' && b.membership.status === 'ACTIVE', out ? out.body : 'null');
}

// 32. quizlet.js
{
  const out = runScript('quizlet.js', { url: 'https://quizlet.com/webapi/3.4/users/123456' }, { body: JSON.stringify({ responses: [{ models: { user: [{ id: 123456, is_plus: false, is_premium: false }] } }] }) });
  const b = JSON.parse(out.body);
  const u = b.responses && b.responses[0].models.user[0];
  check('quizlet: is_plus=true & is_premium=true', u && u.is_plus === true && u.is_premium === true, out ? out.body : 'null');
}

// 33. revenuecat_multi.js (Locket Gold)
{
  const out = runScript('revenuecat_multi.js', { headers: { 'User-Agent': 'Locket/1.0' } }, { body: JSON.stringify({ subscriber: { subscriptions: {}, entitlements: {} } }) });
  const b = JSON.parse(out.body);
  check('revenuecat_multi: Locket Gold unlocked', b.subscriber && b.subscriber.entitlements && b.subscriber.entitlements.Gold !== undefined, out ? out.body : 'null');
}

// 34. spotify.js
{
  const out = runScript('spotify.js', { url: 'https://spclient.wg.spotify.com/user-attributes/v1/attributes' }, { body: JSON.stringify({ values: { type: 'free' } }) });
  const b = JSON.parse(out.body);
  check('spotify: user-attributes type=premium', b.values && b.values.type === 'premium', out ? out.body : 'null');
}

console.log('\n== KẾT QUẢ: ' + pass + ' PASS / ' + fail + ' FAIL ==');
process.exit(fail === 0 ? 0 : 1);

