// Harness test spotify.js — giả lập engine proxy (Surge/QX/Loon style)
const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(
  path.join(__dirname, "..", "Module", "js", "spotify.js"),
  "utf-8"
);

function run(requestUrl, responseBody, responseHeaders) {
  let doneArg = null;
  const sandbox = {
    $request: { url: requestUrl },
    $response: { body: responseBody, headers: responseHeaders || {} },
    $done: (arg) => { doneArg = arg; },
    console,
  };
  // nạp script với globals đã mock
  const fn = new Function(
    "$request", "$response", "$done", "console",
    src
  );
  fn(sandbox.$request, sandbox.$response, sandbox.$done, console);
  return doneArg; // {body, headers} hoặc {}
}

let pass = 0, fail = 0;
function check(name, cond, extra) {
  if (cond) { pass++; console.log("  PASS  " + name); }
  else { fail++; console.log("  FAIL  " + name + (extra ? "  -> " + extra : "")); }
}

console.log("== spotify.js unit test ==");

// 1. Free /v1/me có restrictions -> premium + xoá restrictions + cache-bust
{
  const inBody = JSON.stringify({
    product: "free", type: "user",
    restrictions: [{ type: "podcast", catalogues: ["spotify"] }],
  });
  const out = run("https://api.spotify.com/v1/me", inBody, { ETag: "W/\"abc\"", "Content-Type": "application/json" });
  const b = JSON.parse(out.body);
  check("v1/me: product=premium", b.product === "premium", out.body);
  check("v1/me: type=premium", b.type === "premium", out.body);
  check("v1/me: restrictions cleared", Array.isArray(b.restrictions) && b.restrictions.length === 0, out.body);
  check("v1/me: Cache-Control=no-store", out.headers && out.headers["Cache-Control"] === "no-store");
  check("v1/me: ETag removed", out.headers && out.headers["ETag"] === undefined);
}

// 2. /v1/me premium sẵn, không restrictions -> giữ premium, vẫn cache-bust
{
  const inBody = JSON.stringify({ product: "premium", type: "premium" });
  const out = run("https://api.spotify.com/v1/me", inBody, { ETag: "W/\"x\"" });
  const b = JSON.parse(out.body);
  check("v1/me(premium): không đổi product", b.product === "premium");
  check("v1/me(premium): có cache-bust", out.headers && out.headers["Cache-Control"] === "no-store");
}

// 3. /v1/me không có product/type/restrictions -> fail-safe giữ nguyên
{
  const inBody = JSON.stringify({ id: "user123", display_name: "Test" });
  const out = run("https://api.spotify.com/v1/me", inBody, {});
  check("v1/me(fail-safe): pass-through $done({})", Object.keys(out).length === 0, JSON.stringify(out));
}

// 4. identity/v3/me -> type=premium
{
  const inBody = JSON.stringify({ type: "user", id: "abc" });
  const out = run("https://spclient.wg.spotify.com/identity/v3/me", inBody, { ETag: "W/\"y\"" });
  const b = JSON.parse(out.body);
  check("identity/v3/me: type=premium", b.type === "premium", out.body);
  check("identity/v3/me: cache-bust", out.headers && out.headers["Cache-Control"] === "no-store");
}

// 5. URL không phải spotify -> fail-safe (không đổi dù có product)
{
  const inBody = JSON.stringify({ product: "free", type: "user" });
  const out = run("https://api.example.com/v1/me", inBody, {});
  check("non-spotify: pass-through $done({})", Object.keys(out).length === 0, JSON.stringify(out));
}

// 6. JSON hỏng -> không crash, $done({})
{
  const out = run("https://api.spotify.com/v1/me", "{not json", {});
  check("malformed JSON: không crash", out !== null && Object.keys(out).length === 0, JSON.stringify(out));
}

// 7. body không phải object (array) -> fail-safe
{
  const out = run("https://api.spotify.com/v1/me", "[1,2,3]", {});
  check("non-object body: fail-safe", out !== null && Object.keys(out).length === 0, JSON.stringify(out));
}

console.log("\n== KẾT QUẢ: " + pass + " PASS / " + fail + " FAIL ==");
process.exit(fail === 0 ? 0 : 1);
