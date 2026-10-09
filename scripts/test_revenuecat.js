// Unit test for revenuecat_multi.js
const fs = require('fs');
const path = require('path');
const code = fs.readFileSync(path.join(__dirname, '..', 'Module', 'js', 'revenuecat_multi.js'), 'utf8');

let pass = 0, fail = 0;
function testApp(name, ua, expectedKey) {
  let doneArg = null;
  const sandbox = {
    $request: { url: 'https://api.revenuecat.com/v1/subscribers/test', headers: { 'User-Agent': ua } },
    $response: { body: JSON.stringify({ subscriber: { subscriptions: {}, entitlements: {} } }) },
    $done: (arg) => { doneArg = arg; },
    console
  };
  const fn = new Function('$request', '$response', '$done', 'console', code);
  fn(sandbox.$request, sandbox.$response, sandbox.$done, console);
  const res = JSON.parse(doneArg.body);
  const hasEnt = !!res.subscriber.entitlements[expectedKey];
  if (hasEnt) {
    pass++;
    console.log('  PASS  ' + name + ' -> ' + expectedKey);
  } else {
    fail++;
    console.log('  FAIL  ' + name + ' -> missing ' + expectedKey);
  }
}

console.log('== revenuecat_multi.js unit tests ==');
testApp('Locket Gold', 'Locket/1.0', 'Gold');
testApp('Scanner Pro', 'ScannerPro/7.0', 'pro');
testApp('iScanner', 'iScanner/3.0', 'pro');
testApp('QuickScan', 'QuickScan/2.0', 'pro');
testApp('DocScanner', 'DocScanner/1.0', 'pro');
testApp('Speak English', 'Speak/2.0', 'premium');
testApp('Praktika AI', 'Praktika/1.0', 'premium');
testApp('Craft Docs', 'Craft/2.0', 'pro');
testApp('Day One', 'DayOne/6.0', 'premium');
testApp('DeepL Pro', 'DeepL/4.0', 'pro');
testApp('Notability', 'Notability/14.0', 'premium');
testApp('Epik AI', 'Epik/4.0', 'pro');
testApp('ProCCD Camera', 'ProCCD/2.0', 'pro');
testApp('Dazz Cam', 'DazzCam/3.0', 'pro');
testApp('EE35 Film', 'EE35/1.0', 'pro');
testApp('NOMO CAM', 'NOMO/2.0', 'pro');
testApp('NOMO Point', 'NOMO Point/1.0', 'pro');
testApp('KUNI Cam', 'KUNI/1.0', 'pro');
testApp('1998 Cam', '1998 Cam/1.0', 'pro');
testApp('LoFi Cam', 'LoFi Cam/1.0', 'pro');
testApp('Generic Fallback', 'RandomApp/1.0', 'pro');

// Test 22: Server existing entitlement sync to subscriptions
{
  let doneArg = null;
  const sandbox = {
    $request: { url: 'https://api.revenuecat.com/v1/subscribers/test', headers: { 'User-Agent': 'CustomUnmappedApp/1.0' } },
    $response: {
      headers: { 'ETag': '"123"', 'X-RevenueCat-ETag': '"abc"', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscriber: {
          subscriptions: {},
          entitlements: {
            special_vip: { product_identifier: 'custom_lifetime_tier', expires_date: '2020-01-01T00:00:00Z' }
          }
        }
      })
    },
    $done: (arg) => { doneArg = arg; },
    console
  };
  const fn = new Function('$request', '$response', '$done', 'console', code);
  fn(sandbox.$request, sandbox.$response, sandbox.$done, console);
  const res = JSON.parse(doneArg.body);
  const subOk = res.subscriber.subscriptions['custom_lifetime_tier'] && res.subscriber.subscriptions['custom_lifetime_tier'].expires_date === '2099-12-31T10:10:14Z';
  const entOk = res.subscriber.entitlements['special_vip'] && res.subscriber.entitlements['special_vip'].expires_date === '2099-12-31T10:10:14Z';
  const nonSubOk = res.subscriber.non_subscriptions && Object.keys(res.subscriber.non_subscriptions).length > 0;
  const cacheBustOk = doneArg.headers && doneArg.headers['Cache-Control'] && !doneArg.headers['ETag'] && !doneArg.headers['X-RevenueCat-ETag'];

  if (subOk && entOk) {
    pass++;
    console.log('  PASS  Existing server entitlement synced to subscriptions');
  } else {
    fail++;
    console.log('  FAIL  Existing server entitlement failed to sync');
  }

  if (nonSubOk) {
    pass++;
    console.log('  PASS  non_subscriptions lifetime fallback populated');
  } else {
    fail++;
    console.log('  FAIL  non_subscriptions lifetime fallback missing');
  }

  if (cacheBustOk) {
    pass++;
    console.log('  PASS  Response cache-bust headers & ETag strip');
  } else {
    fail++;
    console.log('  FAIL  Response cache-bust headers missing');
  }
}

console.log('\n== KẾT QUẢ: ' + pass + ' PASS / ' + fail + ' FAIL ==');
process.exit(fail === 0 ? 0 : 1);
