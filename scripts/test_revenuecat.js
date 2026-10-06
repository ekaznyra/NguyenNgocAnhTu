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
testApp('Generic Fallback', 'RandomApp/1.0', 'pro');

console.log('\n== KẾT QUẢ: ' + pass + ' PASS / ' + fail + ' FAIL ==');
process.exit(fail === 0 ? 0 : 1);
