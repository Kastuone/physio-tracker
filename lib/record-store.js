import { get, put } from "@vercel/blob";

export const RECORD_PATH = "fitness/records-v1.json";
export const READ_OPTIONS = {
  access: "private",
  useCache: false,
  headers: { "Accept-Encoding": "identity" },
};

// Compressed HTTP responses can carry a weak W/ ETag. Conditional storage writes
// require the original strong tag, paired with the same body. Never strip W/
// or replace it with a separate head() read: either would lose that guarantee.
export async function readRecordBlob(path = RECORD_PATH, read = get) {
  const result = await read(path, READ_OPTIONS);
  if (result && (!result.blob.etag || result.blob.etag.startsWith("W/")))
    throw Error("Strong record version unavailable");
  return result;
}

export async function writeRecordBlob(
  data,
  etag,
  write = put,
  path = RECORD_PATH,
) {
  const updatedAt = new Date().toISOString();
  const result = await write(path, JSON.stringify({ data, updatedAt }), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: etag !== null,
    ...(etag !== null ? { ifMatch: etag } : {}),
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
  return { etag: result.etag, updatedAt };
}
