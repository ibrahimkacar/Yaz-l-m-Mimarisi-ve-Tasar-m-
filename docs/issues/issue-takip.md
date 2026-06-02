# PatiHaven Projesi - Issue / Hata ve Görev Takip Kayıtları

Bu belgede, projenin geliştirilmesi esnasında karşılaşılan teknik sorunlar, kullanıcı geri bildirimleri ve bunların çözüm yolları yer almaktadır.

---

## 📌 Issue #101: Sahiplenme Onayında Hayvan Durumunun Güncellenmemesi
* **Tip:** Hata (Bug)  
* **Öncelik:** Yüksek  
* **Durum:** Çözüldü  
* **Açıklama:** Sahiplenme talebi admin panelinden onaylandığında, `adoption_requests` tablosundaki durum `approved` oluyordu fakat `animals` tablosundaki status hala `available` kalmaya devam ediyordu.  
* **Çözüm:** `server/routes/adoptions.js` içerisindeki onaylama rotasına, onay verildiği anda ilgili hayvanın durumunu `adopted` yapan veritabanı sorgusu (`UPDATE animals SET status = "adopted" WHERE id = ?`) eklendi. Ayrıca o hayvan için bekleyen diğer tüm taleplerin otomatik olarak reddedilmesini sağlayan ek bir sorgu daha eklendi.

---

## 📌 Issue #102: Harici API İsteklerinde CORS Hatası
* **Tip:** Hata (Bug)  
* **Öncelik:** Orta  
* **Durum:** Çözüldü  
* **Açıklama:** Frontend uygulamasının backend servislerine (özellikle dış API test konsoluna) istek yaparken tarayıcıda `Access-Control-Allow-Origin` engeline takılması sorunu.  
* **Çözüm:** Sunucu tarafındaki `server/server.js` dosyasına `cors` ara katmanı (middleware) entegre edildi. Vite varsayılan adresi olan `http://localhost:5173` istekleri için izinler tanımlandı.

---

## 📌 Issue #103: Karanlık Temada Kod Bloklarının Okunabilirliği
* **Tip:** İyileştirme  
* **Öncelik:** Düşük  
* **Durum:** Çözüldü  
* **Açıklama:** API Dokümantasyon sayfasındaki test konsolu karanlık modda çalışırken, JSON çıktılarının arka planla çakışarak gözü yorması sorunu.  
* **Çözüm:** CSS dosyasında konsol alanı için sabit koyu gri arka plan (`#0f172a`) ve mavi-yeşil tonlarında neon yazı rengi (`#38bdf8`) atanarak kontrast oranı artırıldı.

---

## 📌 Issue #104: Sağlık Günlüğü Notlarının Sıralaması
* **Tip:** İyileştirme  
* **Öncelik:** Düşük  
* **Durum:** Çözüldü  
* **Açıklama:** Bir hayvanın detay sayfasındaki veteriner notlarının en eskiden en yeniye doğru görünmesi, güncel notların en altta kalmasına yol açıyordu.  
* **Çözüm:** `server/routes/animals.js` içerisindeki detay çekme sorgusuna `ORDER BY created_at DESC` sıralama ifadesi eklenerek en güncel veteriner notunun en üstte çıkması sağlandı.
