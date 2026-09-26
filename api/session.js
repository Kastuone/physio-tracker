import {
  authenticated,
  configured,
  verifyCode,
  issueSession,
  setSession,
  sameOrigin,
  jsonBody,
  reply,
} from "../lib/auth.js";
export default async function handler(req, res) {
  if (!configured())
    return reply(res, 503, {
      error: "Giriş hazırlanıyor. Yerel kayıtların korunuyor.",
    });
  if (req.method === "GET")
    return reply(res, 200, { authenticated: authenticated(req) });
  if (!["POST", "DELETE"].includes(req.method))
    return reply(res, 405, { error: "Yöntem desteklenmiyor." });
  if (!sameOrigin(req))
    return reply(res, 403, { error: "Bu adresten giriş yapılamaz." });
  if (req.method === "DELETE") {
    setSession(res, "");
    return reply(res, 200, { authenticated: false });
  }
  try {
    const body = await jsonBody(req, 2000);
    if (!verifyCode(body.code)) {
      await new Promise((r) => setTimeout(r, 350));
      return reply(res, 401, { error: "Erişim kodu geçersiz." });
    }
    setSession(res, issueSession());
    return reply(res, 200, { authenticated: true });
  } catch {
    return reply(res, 400, { error: "Giriş isteği geçersiz." });
  }
}
