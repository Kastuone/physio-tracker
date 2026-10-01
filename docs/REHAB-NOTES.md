# Faz 2 referansı ve uygulama sınırları

Araştırma tarihi: 29 Eylül 2026.

Kaynak: kullanıcının sunduğu antrenör listesi. Fotoğraf ve fotoğraftaki kişisel bilgiler depoya eklenmez. Faz 2 başlığı 6–12 hafta; leg curl 3×12, alçak basamak step-up 3×10, tek ayak denge 3×30 saniye, bisiklet 15 dakika. Kullanıcı leg press 3×12 ve glute bridge 3×15 olarak netleştirdi. Yük, sıklık, hareket aralığı ve basamak yüksekliği belirtilmemiş. Belirtilmeyen teknik ayrıntılar uygulamada açıkça işaretlenir.

Bu aktarım klinik onay anlamına gelmez. Kullanıcı seçili seansa Faz 2 kayıt alanlarını ekleyebilir. Ağırlıklar boş başlar; set tamamlanması kullanıcı girişine bağlıdır. Önceki bisiklet yasağı ifadesi hatalıydı ve kaldırıldı. Günlük 15 dakika kullanıcı tercihidir. Salı/Perşembe/Cumartesi salon programına göre yerleşim taslağıdır; klinik sıklık önerisi değildir. Greft türüne özgü leg curl zamanlaması ve yük tedavi ekibiyle teyit edilmeli. Profesyonel sporcu videolarından yeni hareket aktarılmadı; Maddison video bağlantısı sağlandı ancak erişim hatası nedeniyle içeriği değerlendirilemedi.

## Araştırma

- [Aspetar ACL rehberi](https://www.aspetar.com/en/professionals/aspetar-clinical-guidelines/recommendations-on-rehabilitation-after-aclr): ilerleme bireysel değerlendirme, iyileşme için gerekli süre ve işlevsel ölçütlerle yönlendirilir. Evde yapılan program da kişiye özel planlanıp izlenmelidir.
- [Ohio State hamstring autograft protokolü](https://medicine.osu.edu/-/media/files/medicine/departments/sports-medicine/medical-professionals/knee-ankle-and-foot/acl-reconstruction-hamstrings-autograft_2023.pdf): ilk 8 hafta izotonik dirençli hamstring egzersizini kısıtlar; takvim ilerlemesi tek başına uygunluk göstermez. Bu protokol uygulama kullanıcısı için reçete olarak alınmamıştır.

## Veri ve doğrulama

Kayıt anahtarı ve Blob yolu korunur. Şema sürüm 3 oldu; normalize v1/v2/v3 okuyabilir. Yeni `rehab` seans alanı, bacak hareket kimlikleri ve `seconds` set alanı eklendi. API, eski istemcilerin bacak verilerini silmesini önlemek için yalnızca `X-Fitness-Schema: 3` ile yazma kabul eder. API ve arayüz birlikte yayınlanmalı. Yeni üç set tercihi mevcut `setCounts`, ayakta varyantlar `alts`, diz takibi `note` alanlarına kaydedilir. Eski hareket adları ve tamamlanmış setler değiştirilmez. Özel set sayısı olan seanslarda azaltma için set − kullanılabilir.

27 otomatik test geçti. Yeni bacak akışı kilo/tekrar ve saniye girişi, set ekleme/çıkarma, yeniden yükleme, geçmiş ve hacim hesabı açısından test edildi. Eski istemcilerin 426 ile engellenmesi ve eşzamanlı üst/bacak kaydı birleştirme doğrulandı. Yeni test boş seans hazırlama, geçmiş kaydı değiştirmeme, yeniden yükleme ve diz takip notunu doğrular. Testler kurgusal veri ve sahte ağ yanıtları kullanır; canlı kişisel kayıtlar, fiziksel telefon klavyesi ve canlı iki cihaz eşitlemesi bu güncellemede test edilmedi. Bu güncellemenin görsel tarayıcı testi yapılmadı.
