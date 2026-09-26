import { BlobPreconditionFailedError } from "@vercel/blob";
import { authenticated, sameOrigin, jsonBody, reply } from "../lib/auth.js";
import { normalize, empty } from "../public/sync-core.js";
import { readRecordBlob, writeRecordBlob } from "../lib/record-store.js";
export default async function handler(req, res) {
  if (!authenticated(req))
    return reply(res, 401, { error: "Kayıtlar için giriş yap." });
  if (!["GET", "PUT"].includes(req.method))
    return reply(res, 405, { error: "Yöntem desteklenmiyor." });
  if (!process.env.BLOB_READ_WRITE_TOKEN)
    return reply(res, 503, { error: "Özel kayıt deposu henüz hazır değil." });
  if (req.method === "PUT" && req.headers["x-fitness-schema"] !== "2")
    return reply(res, 426, {
      error: "Uygulama güncellendi. Kayıtlarını korumak için sayfayı yenile.",
    });
  if (req.method === "PUT" && !sameOrigin(req))
    return reply(res, 403, { error: "Bu adresten kayıt yapılamaz." });
  let input;
  if (req.method === "PUT")
    try {
      input = await jsonBody(req);
      input.data = normalize(input.data);
      if (
        input.etag !== null &&
        (typeof input.etag !== "string" || input.etag.length > 200)
      )
        throw Error();
    } catch {
      return reply(res, 400, { error: "Kayıt biçimi geçersiz." });
    }
  try {
    if (req.method === "GET") {
      const result = await readRecordBlob();
      if (!result) return reply(res, 200, { data: empty(), etag: null });
      const stored = JSON.parse(await new Response(result.stream).text());
      return reply(res, 200, {
        data: normalize(stored.data),
        etag: result.blob.etag,
        updatedAt: stored.updatedAt,
      });
    }
    if (input.etag === null) {
      const existing = await readRecordBlob();
      if (existing)
        return reply(res, 409, {
          error: "Başka cihaz ilk kaydı oluşturdu. Yeniden eşitle.",
        });
    }
    const result = await writeRecordBlob(input.data, input.etag);
    return reply(res, 200, result);
  } catch (err) {
    if (
      err instanceof BlobPreconditionFailedError ||
      err?.constructor?.name === "BlobAlreadyExistsError"
    )
      return reply(res, 409, {
        error: "Başka cihaz yeni bir kayıt yaptı. Yeniden eşitle.",
      });
    if (req.method === "PUT" && input?.etag === null)
      try {
        // Handle a concurrent first writer without ever allowing a blind overwrite.
        const existing = await readRecordBlob();
        if (existing)
          return reply(res, 409, {
            error: "Başka cihaz ilk kaydı oluşturdu. Yeniden eşitle.",
          });
      } catch {}
    console.error("Fitness storage request failed:", err?.name);
    return reply(res, 503, {
      error: "Buluta şu an ulaşılamıyor. Bu cihazdaki kayıtlar korunuyor.",
    });
  }
}
