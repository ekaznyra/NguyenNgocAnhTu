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

// 8. device-capabilities/v1/capabilities -> effective_license=premium + supports_hifi (2026 update)
{
  const inBody = JSON.stringify({
    effective_license: "free",
    supports_hifi: { fully_supported: false, user_eligible: false }
  });
  const out = run("https://spclient.wg.spotify.com/device-capabilities/v1/capabilities", inBody, { ETag: "W/\"cap\"" });
  const b = JSON.parse(out.body);
  check("device-capabilities: effective_license=premium", b.effective_license === "premium", out.body);
  check("device-capabilities: supports_hifi=true", b.supports_hifi && b.supports_hifi.fully_supported === true && b.supports_hifi.user_eligible === true, out.body);
  check("device-capabilities: cache-bust", out.headers && out.headers["Cache-Control"] === "no-store");
}

// 9. user-attributes/v1/attributes -> type=premium, high-bitrate=true, ads=false
{
  const inBody = JSON.stringify({
    values: {
      type: "free",
      ads: "true",
      "high-bitrate": "false"
    }
  });
  const out = run("https://spclient.wg.spotify.com/user-attributes/v1/attributes", inBody, { ETag: "W/\"attr\"" });
  const b = JSON.parse(out.body);
  check("user-attributes: type=premium", b.values && b.values.type === "premium", out.body);
  check("user-attributes: high-bitrate=true", b.values && b.values["high-bitrate"] === "true", out.body);
  check("user-attributes: ads=false", b.values && b.values.ads === "false", out.body);
  check("user-attributes: cache-bust", out.headers && out.headers["Cache-Control"] === "no-store");
}

// 10. /v1/me explicit_content filter_locked unlocked
{
  const inBody = JSON.stringify({
    product: "free",
    type: "user",
    explicit_content: { filter_enabled: false, filter_locked: true }
  });
  const out = run("https://api.spotify.com/v1/me", inBody, {});
  const b = JSON.parse(out.body);
  check("v1/me: explicit_content filter_locked=false", b.explicit_content && b.explicit_content.filter_locked === false, out.body);
}

console.log("\n== KẾT QUẢ: " + pass + " PASS / " + fail + " FAIL ==");
process.exit(fail === 0 ? 0 : 1);
