// Unit tests for duolingo.js, cake.js, and quizlet.js
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

console.log('== Education Suite Unit Tests ==');

// 1. Duolingo
{
  const input = {
    hasPlus: false,
    hasSuper: false,
    tier: 'none',
    health: { hearts: 1, maxHearts: 5, unlimited: false },
    gems: 50,
    lingots: 10,
    streakFreeze: 0,
    subscriptions: []
  };
  const out = runScript('duolingo.js', { url: 'https://api.duolingo.com/2017-06-30/users/12345' }, { body: JSON.stringify(input) });
  const res = JSON.parse(out.body);
  check('duolingo: hasPlus is true', res.hasPlus === true, out.body);
  check('duolingo: hasSuper is true', res.hasSuper === true, out.body);
  check('duolingo: tier is plus', res.tier === 'plus', out.body);
  check('duolingo: health is unlimited', res.health.unlimited === true && res.health.hearts === 5, out.body);
  check('duolingo: gems boosted', res.gems >= 99999, out.body);
  check('duolingo: streakFreeze set', res.streakFreeze >= 2, out.body);
  check('duolingo: subscription added', res.subscriptions.length > 0 && res.subscriptions[0].status === 'ACTIVE', out.body);
  check('duolingo: cache-bust headers', out.headers && out.headers['Cache-Control'] === 'no-store, no-cache, must-revalidate', JSON.stringify(out.headers));
}

// 2. Cake
{
  const input = {
    id: 'user_123',
    membership: {
      type: 'FREE',
      status: 'EXPIRED',
      is_active: false
    }
  };
  const out = runScript('cake.js', { url: 'https://api.mycake.me/v1/users/me' }, { body: JSON.stringify(input) });
  const res = JSON.parse(out.body);
  check('cake: membership type is PLUS', res.membership.type === 'PLUS', out.body);
  check('cake: membership is active', res.membership.is_active === true, out.body);
  check('cake: membership status is ACTIVE', res.membership.status === 'ACTIVE', out.body);
  check('cake: cache-bust headers', out.headers && out.headers['Cache-Control'] === 'no-store, no-cache, must-revalidate', JSON.stringify(out.headers));
}

// 3. Quizlet
{
  const input = {
    responses: [
      {
        models: {
          user: [
            {
              username: 'testuser',
              is_plus: false,
              is_premium: false,
              self_study_subscription_type: 0
            }
          ]
        }
      }
    ]
  };
  const out = runScript('quizlet.js', { url: 'https://quizlet.com/webapi/3.4/users/test' }, { body: JSON.stringify(input) });
  const res = JSON.parse(out.body);
  const u = res.responses[0].models.user[0];
  check('quizlet: is_plus is true', u.is_plus === true, out.body);
  check('quizlet: is_premium is true', u.is_premium === true, out.body);
  check('quizlet: self_study_subscription_type is 2 (Plus)', u.self_study_subscription_type === 2, out.body);
  check('quizlet: cache-bust headers', out.headers && out.headers['Cache-Control'] === 'no-store, no-cache, must-revalidate', JSON.stringify(out.headers));
}

console.log('\n== KẾT QUẢ: ' + pass + ' PASS / ' + fail + ' FAIL ==');
process.exit(fail === 0 ? 0 : 1);
