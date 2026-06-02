# PatiHaven Projesi - Ekip Toplantı Notları

Bu belgede, Hayvan Barınağı Yönetim Platformu projesinin geliştirilmesi sırasında gerçekleştirilen planlama, tasarım ve kod gözden geçirme toplantılarının kayıtları yer almaktadır.

---

## 📅 Toplantı 1: Gereksinim Analizi ve Mimari Tasarım Hizalanması
* **Tarih:** 2026-05-10  
* **Katılımcılar:** Proje Ekip Üyeleri  
* **Gündem:** Proje isterlerinin analizi, veri tabanı şemasının çizilmesi ve mimari yaklaşıma karar verilmesi.  

### Kararlar ve Notlar:
1. **İsterlerin Netleştirilmesi:** Sahiplenme sürecinin kullanıcı tarafında talep gönderme, admin tarafında ise değerlendirme akışıyla yapılması netleştirildi.
2. **Mimari:** Express + SQLite + React monorepo yapısı kararlaştırıldı.
3. **Ekstra Özellik:** Projenin akademik değerini artırmak amacıyla barınak yetkililerine özel "Sağlık Günlüğü" ve sahiplenici kullanıcılar için "Durum Raporlama" özelliklerinin opsiyonel olmaktan çıkarılıp sisteme tam olarak entegre edilmesine karar verildi.
4. **Görev Dağılımı:**
   - DB tasarımı ve Backend rotaları.
   - Frontend arayüz tasarımı, CSS şablonları ve API entegrasyonu.
   - Raporlama ve ADR dokümantasyonu.

---

## 📅 Toplantı 2: Veritabanı Entegrasyonu ve API Geliştirme İncelemesi
* **Tarih:** 2026-05-20  
* **Katılımcılar:** Proje Ekip Üyeleri  
* **Gündem:** Backend rotalarının yazılması, SQLite tablolarının ilişkisel durumları ve dış entegrasyon API'si (İster 8).  

### Kararlar ve Notlar:
1. **Dış API Güvenliği:** Dışarıdan erişime açık olan kullanıcı ve hayvan listeleme endpoints için basit ama etkili bir API Anahtarı (`x-api-key`) doğrulaması yapılması kararlaştırıldı. API anahtarı olarak `patihaven_guest_key_2026` kullanılacak.
2. **Durum Değişiklikleri:** Sahiplenme talebi onaylandığında ilgili hayvanın durumunun tetikleyici veya veritabanı işlemi sırasında otomatik olarak `'adopted'` yapılması ve diğer açık taleplerin reddedilmesi mantığı backend tarafında uygulandı.
3. **Sorun Tespiti:** JWT token süre aşımı durumlarında frontend tarafında otomatik çıkış yapılması için interceptor mantığı tartışıldı.

---

## 📅 Toplantı 3: Arayüz Parlatma, Raporlama ve Final Kontrolleri
* **Tarih:** 2026-06-01  
* **Katılımcılar:** Proje Ekip Üyeleri  
* **Gündem:** Arayüzün responsive testleri, HSL karanlık tema geçişleri, REPORT.md dosyasının hazırlanması ve Word belgesi üretici betiğin doğrulanması.  

### Kararlar ve Notlar:
1. **Tema Tasarımı:** Kullanıcının karanlık modu seçmesi durumunda bunu `localStorage` üzerinde kaydedip sayfa yenilense dahi durumun korunması sağlandı.
2. **Word Raporu:** Proje tesliminde kullanılmak üzere hocaya sunulacak olan `.docx` raporunun içerik kalitesi denetlendi. `generate-report.js` betiğinin sorunsuz çalıştığı onaylandı.
3. **Teslim Öncesi Test:** Admin ve standart kullanıcı girişleri, başvuru akışı ve durum güncellemeleri başarıyla simüle edildi.
