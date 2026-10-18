# / TRAINING LOG.

Telefonla, gerçek bir antrenmanın ortasında kullanılmak için tasarlanmış kişisel antrenman günlüğü. Sakin yeşil tonları, güçlü tipografi ve düz bir set çizelgesi; odakta kilo, tekrar ve bir sonraki set var.

**Vanilla JavaScript · Vercel Functions · Private Vercel Blob**

## Hızlı başlangıç

Node.js 24 kullanın:

```sh
npm ci
npm run dev
```

`http://localhost:3000` adresini açın. Sunucu yalnızca arayüzü sunar; yerel çalıştırmada bulut açıkmış gibi davranmaz. Kayıtlar tarayıcıda tutulur.

Kişisel veri kullanmadan incelemek için `http://localhost:3000/?demo=1` adresini açın. Örnek görünüm kurgusal verileri ayrı **sessionStorage** anahtarlarında tutar ve buluta bağlanmaz. ZIP içindeki `preview.html` de sunucu gerektirmeyen, yalnızca örnek verili bir önizlemedir.

## Özellikler

- Dört haftalık mevcut program, üç antrenman günü ve mevcut toparlanma/fizyoterapi uyarlamaları.
- Mobil alt gezinme; masaüstünde seans özeti ve dinlenme sayacı.
- Ağırlık, tekrar, RIR ve set tamamlama; anında yerel kayıt.
- Her hareket için **Set ekle / Set çıkar**: 0–20 set. Azaltılan setlerdeki girişler silinmez; tekrar eklenince geri gelir.
- Programdaki set sayısına dönüş; seansa özel değişiklikler egzersiz reçetesini değiştirmez.
- Önceki tamamlanan performans, hareket/hafta filtreleri ve taslakları da içeren geçmiş.
- Toplam hacim açıkça `kg × tekrar` olarak etiketlidir; kuvvet veya klinik iyileşme ölçümü değildir.
- Süresi sayfa değişiminde kaybolmayan dinlenme sayacı.
- JSON yedekleme, kontrollü geri yükleme, program ve kayıt yazdırma.
- Mevcut erişim kodu, imzalı HttpOnly oturum ve özel Blob deposuyla eşitleme.
- Kaydedilemeyen/çakışan/bağlantı bekleyen kayıtlar için açık durum bildirimi.
- Klavye odağı, büyük set düğmeleri, sayısal girişler ve azaltılmış hareket desteği.
- Harici font/CDN isteği yok; Manrope ve Tabler simgeleri uygulamayla sunulur.

## Mevcut Vercel projesini güncelleme

Bu bir altyapı geçişi değildir. Mevcut Vercel projesini, bağlı **private** Blob deposunu ve ortam değişkenlerini koruyun. Projenin aynı alan adında yayınlanması tarayıcıdaki yerel kayıtların erişilebilir kalması için önemlidir.

1. Yayındaki eski uygulamadan JSON yedeğini indirin. Telefon ve bilgisayardaki eşitlenmemiş kayıtları da yedekleyin.
2. Bu kaynak dosyalarını mevcut depoya alın. `.env.local`, `.vercel`, `node_modules` veya kişisel JSON yedeklerini Git'e eklemeyin.
3. Mevcut değişkenleri koruyun: `FITNESS_ACCESS_HASH`, `FITNESS_SESSION_SECRET`, `FITNESS_ORIGIN`, `BLOB_READ_WRITE_TOKEN`.
4. Vercel ayarları: Framework **Other**, output **public**, build command yok, Node **24.x**. `vercel.json` paketle birlikte gelir.
5. API ve arayüzü aynı deployment içinde yayınlayın. Telefon ve bilgisayarda eski sekmeleri yenileyin.
6. Giriş yapıp eşitleyin; eski kayıtların görünmesini ve iki cihazda örnek bir düzeltmenin aktarılmasını doğrulayın.

`FITNESS_ACCESS_HASH`, erişim kodunun SHA-256 hex özetidir. `FITNESS_SESSION_SECRET`, sunucudaki oturum imza anahtarıdır. Değerleri README'ye veya istemciye koymayın. Mevcut kurulumu güncellerken bunları yeniden üretmek gerekmez.

Depo konumu **`fitness/records-v1.json`** olarak kalır. İsmin korunması mevcut kayıtlara aynı yerde erişmek içindir; iç veri şeması sürüm 2'ye yükselmiştir.

## Veri koruma ve sürüm geçişi

- `upper-body-4weeks-v1` yerel kayıt anahtarı korunur.
- İlk yazmadan önce eski yerel içerik `upper-body-4weeks-v1-backup-before-v2` anahtarında korunur.
- Sürüm 1 yedekler sürüm 2'ye okunur. Setler, notlar, tarihler, alternatifler, bisiklet geçmişi ve uyarlamalar korunur.
- Sürüm 2, `setCounts` alanını ve hareket başına 20 seti destekler. Eski istemcilerin bunları kırpmasını önlemek için PUT istekleri `X-Fitness-Schema: 2` ister.
- Eski istemciye doğrudan geri dönmeyin: sürüm 2 kayıtlarını desteklemez. Geri dönüş gerekirse önce her iki cihazın ve bulutun güncel yedeğini alın; v2 destekleyen bir düzeltme yayınlayın.
- Set azaltma, fizyoterapi ve yorgunluk seçenekleri set girişlerini silmez. Plan dışında kalan kayıtlar geçmişte ve yedeklerde durur.
- Kayıt bulunan hareketin alternatif seçimi kilitlenir; böylece eski değerler başka bir harekete aitmiş gibi etiketlenmez. Girişleri boş olan harekette alternatif seçilebilir.
- İçe aktarma öncesinde mevcut içerik `upper-body-4weeks-v1-before-import` anahtarında tutulur.
- Okunamayan kayıtların üzerine yazılmaz. Depolama hatasında açık sayfadaki değerler dışa aktarılabilir; sayfayı kapatmayın.
- Başka sekme aynı günlüğü değiştirirse eski sekmenin yazması durdurulur; yedek alıp yenileyin.
- Ağ yokken **açık sayfa** yerel kayıt yapabilir. İlk yükleme veya tamamen çevrimdışı yeniden açma için service worker desteği yoktur.

Eşitleme mevcut alan bazlı üç yönlü birleştirmeyi ve ETag koşullu yazmayı kullanır. Aynı alan iki cihazda değişirse seçim istenir. Sunucuya yazma tamamlanmadan başarı gösterilmez. İstek sürerken girilen yeni değerler bir sonraki eşitlemeye korunur.

## Programın korunması

Egzersizler ve temel set/tekrar planı `public/program.js` içindedir. Yeni bacak veya rehabilitasyon reçetesi eklenmedi. Önceki konuşmada belirtilen bisiklet kısıtlamasına göre eski bisiklet önerisi kaldırıldı; girilmiş bisiklet süreleri korunur. İlk hafta 2 set / 3–4 RIR; diğer haftaların mevcut toparlanma seçimi, fizyoterapi ve yorgunluk kuralları sürer.

## Doğrulama

```sh
npm run check
npm test
```

Otomatik testler kurgusal veri kullanır. Kayıt biçimi geçişi, tüm program dozları, ek setlerin korunması, giriş/düzeltme/geçmiş akışı, depolama hatası, demo izolasyonu, kimlik doğrulama, ETag güvenliği ve ağ isteği sürerken yapılan değişiklikler kapsanır.

**Test sınırı:** Arayüz davranış testleri jsdom ile çalıştırıldı; gerçek tarayıcı görsel testi değildir. Bu teslim hazırlanırken uzak tarayıcı yerel önizlemeyi `ERR_BLOCKED_BY_CLIENT` ile engelledi. Mobil/masaüstü ekran görüntüleri, gerçek iPhone klavyesi ve canlı iki cihaz eşitlemesi doğrulanamadı. Gerçek kişisel kayıtlar bu kaynak pakette bulunmuyordu; uyumluluk temsili v1 kayıtlarla test edildi. Yayındaki siteye deployment yapılmadı.

`docs/VERIFICATION.md` kalan tarayıcı kontrollerini listeler. GitHub için ekran görüntülerini yalnızca `?demo=1` üzerinden alın; gerçek kayıtlarınızı paylaşmayın. Gerçek görüntüler elde edilmeden README'ye tasarım maketi eklenmedi.

## Dosya yapısı

```text
public/          Arayüz, program, eşitleme, fontlar ve simgeler
api/             Mevcut Vercel oturum ve kayıt uçları
lib/             İmzalı oturum, origin kontrolü ve koşullu Blob yazımı
scripts/dev.mjs  Yerel statik önizleme sunucusu
scripts/preview.mjs  Taşınabilir örnek HTML üretimi
tests/           Veri koruma, uygulama akışı ve eşitleme testleri
docs/            Tasarım profili, doğrulama raporu, üçüncü taraf lisansları
```

Font: Manrope (SIL Open Font License). Simgeler: Tabler (MIT). Lisans metinleri `docs/` dizinindedir.
