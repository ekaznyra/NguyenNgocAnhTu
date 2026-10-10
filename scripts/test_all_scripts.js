// Full resilience test harness for all 31 scripts in Module/js
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'Module', 'js');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

console.log(`== Running Resilience Checks on ${files.length} scripts ==`);

let totalPassed = 0;
let totalFailed = 0;
const failures = [];

const scenarios = [
  { name: 'all undefined', req: undefined, res: undefined },
  { name: 'empty objects', req: {}, res: {} },
  { name: 'null body', req: { url: 'https://test.com' }, res: { body: null } },
  { name: 'malformed JSON', req: { url: 'https://test.com' }, res: { body: '{broken' } },
  { name: 'array JSON', req: { url: 'https://test.com' }, res: { body: '[1,2,3]' } },
  { name: 'empty json object', req: { url: 'https://test.com', headers: {} }, res: { body: '{}', headers: {} } }
];

for (const file of files) {
  const code = fs.readFileSync(path.join(dir, file), 'utf8');
  let scriptErrors = 0;

  for (const sc of scenarios) {
    try {
      let doneCalled = false;
      const fn = new Function('$request', '$response', '$done', 'console', code);
      fn(
        sc.req,
        sc.res,
        () => { doneCalled = true; },
        { log: () => {}, warn: () => {}, error: () => {} }
      );
    } catch (e) {
      scriptErrors++;
      failures.push({ file, scenario: sc.name, error: e.message });
    }
  }

  if (scriptErrors === 0) {
    totalPassed++;
    console.log(`  PASS  ${file} (${scenarios.length}/${scenarios.length} scenarios)`);
  } else {
    totalFailed++;
    console.log(`  FAIL  ${file} (${scriptErrors} errors)`);
  }
}

console.log(`\n== KẾT QUẢ: ${totalPassed} SCRIPTS PASS / ${totalFailed} SCRIPTS FAIL ==`);

if (failures.length > 0) {
  console.log('\nChi tiết lỗi:');
  for (const f of failures) {
    console.log(`  - [${f.file}] [${f.scenario}]: ${f.error}`);
  }
  process.exit(1);
} else {
  console.log(`✅ TẤT CẢ ${files.length}/${files.length} SCRIPT ĐẠT ĐỘ BỀN VỮNG NULL-SAFETY 100%`);
  process.exit(0);
}
