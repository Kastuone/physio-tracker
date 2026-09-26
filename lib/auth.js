import {
  createHash,
  createHmac,
  timingSafeEqual,
  randomBytes,
} from "node:crypto";
export const COOKIE = "__Host-fitness_session";
export function reply(res, status, body) {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.statusCode = status;
  res.end(JSON.stringify(body));
}
export function configured() {
  return (
    !!process.env.FITNESS_ACCESS_HASH && !!process.env.FITNESS_SESSION_SECRET
  );
}
const digest = (s) => createHash("sha256").update(s).digest("hex");
const equal = (a, b) =>
  typeof a === "string" &&
  typeof b === "string" &&
  a.length === b.length &&
  timingSafeEqual(Buffer.from(a), Buffer.from(b));
export function verifyCode(code) {
  return (
    typeof code === "string" &&
    code.length < 200 &&
    equal(digest(code.trim()), process.env.FITNESS_ACCESS_HASH)
  );
}
const sign = (s) =>
  createHmac("sha256", process.env.FITNESS_SESSION_SECRET)
    .update(s)
    .digest("base64url");
export function issueSession() {
  const body = Buffer.from(
    JSON.stringify({
      exp: Date.now() + 30 * 86400000,
      nonce: randomBytes(16).toString("hex"),
    }),
  ).toString("base64url");
  return body + "." + sign(body);
}
export function authenticated(req) {
  if (!configured()) return false;
  try {
    const value = (req.headers.cookie || "")
      .split(";")
      .map((x) => x.trim())
      .find((x) => x.startsWith(COOKIE + "="))
      ?.slice(COOKIE.length + 1);
    if (!value || value.length > 1000) return false;
    const [body, sig, ...extra] = value.split(".");
    if (extra.length || !equal(sig, sign(body))) return false;
    const p = JSON.parse(Buffer.from(body, "base64url").toString());
    return Number.isFinite(p.exp) && p.exp > Date.now();
  } catch {
    return false;
  }
}
export function setSession(res, token) {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${token ? 30 * 86400 : 0}`,
  );
}
export function sameOrigin(req) {
  return (
    req.headers.origin ===
    (process.env.FITNESS_ORIGIN || "https://vercel-fitness-chi.vercel.app")
  );
}
export async function jsonBody(req, max = 512000) {
  if (!String(req.headers["content-type"] || "").startsWith("application/json"))
    throw Error("JSON gerekli.");
  if (Number(req.headers["content-length"] || 0) > max)
    throw Error("İstek çok büyük.");
  if (req.body !== undefined) {
    const text =
      typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    if (Buffer.byteLength(text) > max) throw Error("İstek çok büyük.");
    return JSON.parse(text);
  }
  let text = "";
  for await (const chunk of req) {
    text += chunk.toString();
    if (Buffer.byteLength(text) > max) throw Error("İstek çok büyük.");
  }
  return JSON.parse(text);
}
