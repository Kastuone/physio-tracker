# Doğrulama kaydı

## Çalıştırılan kontroller

- Node sözdizimi kontrolü: app.js, sync.js, sync-core.js.
- Node test runner + jsdom: kilo/tekrar girme, tamamlama, düzeltme, günler arasında gezinme, kayıtla yeni uygulama örneği açma, geçmişi inceleme.
- Eklenen üçüncü seti doldurma, çıkarma, yeniden açma ve ekleyerek değerleri geri getirme.
- Tamamlanmış setin kilosunu silince tamamlanmanın geri alınması; negatif girişin kaydedilmemesi.
- Boş geçmiş, taslaklar, üç gün ve tüm gezinme hedefleri, uzun alternatif adı.
- Temsili v1 kayıtların değer, not, tarih, geçmiş bisiklet alanı ve fizyoterapi alanlarıyla korunması.
- Depolama kotası hatası, bozuk JSON, örnek verilerin kişisel kayıtlardan ayrılması.
- Programın ilk hafta, hazır haftalar, cumartesi fizyoterapi ve yorgunluk kombinasyonları.
- Çakışma seçimleri, başarısız PUT, istek sürerken yeni giriş, sınırlı ETag tekrarları, yerel kayıt başarısızlığında birleştirme tabanının korunması.
- İmzalı oturum doğrulaması, origin eşleştirmesi, Blob'un strong ETag ve ifMatch davranışı.

Tüm bu testler yalnızca kurgusal veri ve sahte ağ yanıtları kullanır. Test çıktısı `test-results.txt` dosyasındadır.

## Tamamlanamayan kontroller

Uzak tarayıcı `http://localhost:3000/?demo=1` isteğini `net::ERR_BLOCKED_BY_CLIENT` hatasıyla engelledi. Görsel tarayıcı testi veya ekran görüntüsü alınamadı. Bu kısıt için farklı bir ağ yolu denenmedi. Canlı Vercel/Blob kayıtları okunmadı ve değiştirilmedi.

## Yayın öncesi tarayıcı kontrolü

1. `npm ci` ve `npm run dev` çalıştırın; `?demo=1` açın.
2. 1440×900, 390×844, 360×800 ve 320×740 ekranlarda kontrol edin: yatay taşma, uzun hareket adları, alt gezinme, açılan alanlar.
3. Gerçek telefonda ağırlık/tekrar klavyesini açın. Alanın görünür kaldığını, sayısal klavyeyi ve tek elle tamamlama düğmesini deneyin.
4. Bir set girin, tamamlayın, kilosunu düzeltin; üçüncü set ekleyin, çıkarın, geri ekleyin. Gün değiştirip geri dönün ve sayfayı yenileyin.
5. Geçmişte gerçek girilen değerleri, filtreleri ve taslakları kontrol edin. Boş günlüğü ayrı tarayıcı profilinde deneyin.
6. Klavye ile gezinme, görünür odak, ekran okuyucu etiketleri ve işletim sisteminin azaltılmış hareket ayarını kontrol edin.
7. Ağ gecikmesini ve hata yanıtlarını deneyin. Önce yerel kayıt, sonra eşitleme bekliyor, yalnızca başarılı sunucu yanıtında bulutla güncel durumunu doğrulayın.
8. Mevcut Vercel test ortamında iki cihazla giriş yapın; farklı alanların birleştiğini, aynı alanın çakışma gösterdiğini doğrulayın.
9. Yedek indirme/yükleme ve program yazdırmayı deneyin.
10. GitHub ekran görüntülerini yalnızca kurgusal demo ekranından alın: antrenman masaüstü, antrenman mobil, geçmiş. Özel verili ekranları kullanmayın.
