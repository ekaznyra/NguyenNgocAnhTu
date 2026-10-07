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

console.log('\n== KẾT QUẢ: ' + pass + ' PASS / ' + fail + ' FAIL ==');
process.exit(fail === 0 ? 0 : 1);
