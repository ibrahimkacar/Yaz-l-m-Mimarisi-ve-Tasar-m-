# ADR-002: React Frontend ve Express Backend Monorepo Mimari Seçimi

## Durum
Kullanıcı deneyimi akıcı, dinamik ve responsive (duyarlı) olan bir arayüz geliştirilirken; veritabanı işlemlerini, JWT tabanlı oturum doğrulamayı ve harici entegrasyon API'lerini koordine edecek bir backend yapısına ihtiyaç duyulmaktadır.

## Karar
Mimari yapı olarak **React (Vite) + Node.js (Express)** teknolojileriyle kurulmuş tek bir kod deposu (**Monorepo**) tercih edilmiştir.

## Gerekçe
1. **Separation of Concerns (Sorumlulukların Ayrılması):**
   - **Frontend (İstemci):** Sadece kullanıcı arayüzü, form validasyonları ve veri görselleştirme süreçleriyle ilgilenir. Sunucu tarafındaki karmaşadan izoledir.
   - **Backend (Sunucu):** Sadece REST API uç noktaları sunarak yetkilendirme, veri tutarlılığı kuralları ve veritabanı sorgularını koordine eder.
2. **Tek Adımda Çalıştırma Kolaylığı (Monorepo):**
   Kök dizindeki `package.json` dosyasında `concurrently` paketi kullanılarak `npm run dev` komutuyla hem frontend hem de backend dev sunucuları tek tıkla ayağa kaldırılabilmektedir. Bu, geliştirici ve test eden kişi için kullanım kolaylığı sağlar.
3. **Akademik Değerlendirme:**
   Uygulamanın hem client hem de server mimarisini ayrı katmanlarda barındırması, temiz kod (Clean Code) standartları ve mimari tasarım örüntülerine tam uyum sağlamaktadır.

## Sonuçlar
- `/client` klasöründe Vite ve React çalışmaktadır.
- `/server` klasöründe Express API sunucusu çalışmaktadır.
- API bağlantısı `cors` ara katmanı (middleware) ile güvenli bir şekilde sağlanmaktadır.
