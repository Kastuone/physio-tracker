import { empty, normalize, merge, same } from "./sync-core.js?v=7";
const $ = (id) => document.getElementById(id),
  app = window.fitnessApp,
  BASE = "fitness-cloud-base-v1";
let base = empty(),
  connected = false,
  busy = false,
  timer,
  conflictEtag,
  choicePending = false,
  authVersion = 0,
  retryBlocked = false;
try {
  const raw = localStorage.getItem(BASE);
  if (raw) base = normalize(JSON.parse(raw));
} catch {}
const say = (text) => {
  $("cloud-status").textContent = text;
};
const badge = (text, state) => {
  if (app.canSync()) app.setStatus(text, state);
};
function remember(next) {
  base = normalize(next);
  try {
    localStorage.setItem(BASE, JSON.stringify(base));
  } catch {
    say(
      "Buluta kaydedildi; tarayıcı önbelleği yazılamadı. Dışa aktararak yedekle.",
    );
  }
}
function authUI(value) {
  connected = value;
  $("cloud-login").hidden = value;
  $("cloud-actions").hidden = !value;
}
async function request(path, options = {}) {
  const controller = new AbortController(),
    timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(path, {
      credentials: "same-origin",
      cache: "no-store",
      ...options,
      signal: controller.signal,
    });
    const body = await response.json();
    if (!response.ok) {
      const err = Error(body.error || "Bağlantı kurulamadı.");
      err.status = response.status;
      throw err;
    }
    return body;
  } finally {
    clearTimeout(timeout);
  }
}
const getAt = (obj, path) => path.reduce((p, k) => p?.[k], obj);
function conflictDetails(result, local, remote, etag) {
  choicePending = true;
  badge("Kayıt çakışması", "error");
  conflictEtag = etag;
  $("cloud-conflict").hidden = false;
  $("conflict-list").replaceChildren();
  const labels = {
    kg: "Ağırlık",
    reps: "Tekrar",
    rir: "RIR",
    done: "Tamamlandı",
    note: "Seans notu",
    next: "Ertesi sabah",
    date: "Tarih",
    bike: "Bisiklet",
    physio: "Fizyoterapi",
    reduce: "Azaltılmış setler",
    warmup: "Isınma",
    cooldown: "Seans sonu",
    skipped: "Atlanan seans",
    criteria: "Aşama Kriteri",
  };
  const format = (v) =>
    v === undefined
      ? "Boş / silindi"
      : v === true
        ? "Evet"
        : String(v).slice(0, 100);
  for (const path of result.conflicts) {
    const li = document.createElement("li");
    li.textContent =
      path.map((k) => labels[k] || k).join(" / ") +
      ": Bu cihaz: " +
      format(getAt(local, path)) +
      " · Bulut: " +
      format(getAt(remote, path));
    $("conflict-list").append(li);
  }
  say(
    "Çakışan kayıtlar var. Seçim yapılana kadar değişiklikler bu cihazda korunuyor.",
  );
}
function schedule() {
  clearTimeout(timer);
  if (connected && !choicePending) timer = setTimeout(() => sync(), 1800);
}
async function sync(choice, approvedEtag) {
  if (
    !app.canSync() ||
    !connected ||
    busy ||
    retryBlocked ||
    (choicePending && !choice)
  )
    return;
  busy = true;
  clearTimeout(timer);
  say("Kayıtlar eşitleniyor…");
  badge("Eşitleniyor…", "syncing");
  try {
    for (let attempt = 0; attempt < 3; attempt++) {
      const remote = await request("/api/records"),
        snapshot = normalize(app.getData());
      const applicableChoice =
        choice && remote.etag === approvedEtag ? choice : undefined;
      const result = merge(base, snapshot, remote.data, applicableChoice);
      if (result.conflicts.length && !applicableChoice) {
        conflictDetails(result, snapshot, remote.data, remote.etag);
        return;
      }
      let updatedAt = remote.updatedAt,
        latestEtag = remote.etag;
      if (!same(result.data, remote.data)) {
        try {
          const saved = await request("/api/records", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "X-Fitness-Schema": "4",
            },
            body: JSON.stringify({ data: result.data, etag: remote.etag }),
          });
          updatedAt = saved.updatedAt;
          latestEtag = saved.etag;
        } catch (e) {
          if (e.status === 409) {
            choice = undefined;
            continue;
          }
          throw e;
        }
      }
      const now = normalize(app.getData()),
        pending = merge(snapshot, now, result.data);
      if (!same(now, pending.data) && !app.applyData(pending.data)) {
        say(
          "Bulut okundu ancak bu cihaza yazılamadı. Sayfayı kapatmadan yedek indir.",
        );
        return;
      }
      remember(pending.conflicts.length ? snapshot : result.data);
      choicePending = false;
      $("cloud-conflict").hidden = true;
      if (pending.conflicts.length) {
        conflictDetails(pending, now, result.data, latestEtag);
        return;
      }
      if (!same(pending.data, base)) {
        say("Yeni değişiklikler gönderilmeyi bekliyor…");
        badge("Cihazda · gönderim bekliyor", "syncing");
        schedule();
      } else {
        say(
          "Kayıtlar güncel" +
            (updatedAt
              ? " · " + new Date(updatedAt).toLocaleString("tr-TR")
              : "") +
            ".",
        );
        badge("Bulutla güncel", "synced");
      }
      return;
    }
    retryBlocked = true;
    badge("Eşitleme bekliyor", "error");
    say(
      "Kayıt sürümü doğrulanamadı. Otomatik denemeler durduruldu; yerel kayıtların korunuyor. Şimdi eşitle ile yeniden deneyebilirsin.",
    );
  } catch (e) {
    badge("Cihazda · eşitleme bekliyor", "error");
    if (e.status === 401) {
      authUI(false);
      say(
        "Oturum sona erdi. Eşitlemek için yeniden giriş yap; yerel kayıtların duruyor.",
      );
    } else
      say(
        (e.status ? e.message : "Bağlantı kurulamadı.") +
          " Değişiklikler bu cihazda duruyor; bağlantı geldiğinde yeniden denenecek.",
      );
  } finally {
    busy = false;
  }
}
window.addEventListener("fitness-change", () => {
  if (connected) {
    if (retryBlocked) {
      say(
        "Bu cihazda kaydedildi. Eşitleme bekliyor; Şimdi eşitle ile yeniden dene.",
      );
      return;
    }
    if (!choicePending) {
      say("Bu cihazda kaydedildi; buluta gönderilmeyi bekliyor…");
      badge("Cihazda · gönderim bekliyor", "syncing");
    }
    schedule();
  }
});
$("cloud-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  authVersion++;
  const button = e.target.querySelector("button");
  button.disabled = true;
  say("Giriş yapılıyor…");
  try {
    await request("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: $("access-code").value.trim() }),
    });
    $("access-code").value = "";
    authUI(true);
    choicePending = false;
    retryBlocked = false;
    await sync();
  } catch (err) {
    say(err.status ? err.message : "Giriş için bağlantı kurulamadı.");
  } finally {
    button.disabled = false;
  }
});
$("cloud-refresh").addEventListener("click", () => {
  retryBlocked = false;
  sync();
});
$("keep-local").addEventListener("click", () => sync("local", conflictEtag));
$("keep-remote").addEventListener("click", () => sync("remote", conflictEtag));
$("cloud-logout").addEventListener("click", async () => {
  if (busy) {
    say("Eşitleme bitince çıkış yapabilirsin.");
    return;
  }
  authVersion++;
  try {
    await request("/api/session", { method: "DELETE" });
    authUI(false);
    badge("Cihazda kayıtlı", "local");
    choicePending = false;
    $("cloud-conflict").hidden = true;
    clearTimeout(timer);
    say("Çıkış yapıldı. Bu cihazdaki yerel kayıtlar duruyor.");
  } catch {
    say("Çıkış tamamlanamadı. Bağlantıyı kontrol edip tekrar dene.");
  }
});
window.addEventListener("online", () => {
  retryBlocked = false;
  sync();
});
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") sync();
});
setInterval(() => {
  if (
    document.visibilityState === "visible" &&
    !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)
  )
    sync();
}, 30000);
authUI(false);
badge("Oturum kontrol ediliyor", "syncing");
const initialAuthVersion = authVersion;
try {
  const session = await request("/api/session");
  if (authVersion === initialAuthVersion) {
    authUI(session.authenticated);
    if (connected) await sync();
    else {
      say(
        "İki cihazda aynı kayıtları görmek için kişisel erişim kodunla giriş yap.",
      );
      badge("Cihazda kayıtlı", "local");
    }
  }
} catch (e) {
  if (authVersion === initialAuthVersion) {
    authUI(false);
    badge("Yalnızca bu cihazda", "local");
    say(
      e.status
        ? e.message
        : "Oturum kontrolü tamamlanamadı. Kodunla giriş yapmayı deneyebilirsin; yerel kayıtların duruyor.",
    );
  }
}
