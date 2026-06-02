# ADR-001: Veritabanı Teknolojisi Olarak SQLite Seçimi

## Durum
Hayvan Barınağı Yönetim Platformu'nun veri kalıcılığı katmanı için bir ilişkisel veritabanı kütüphanesi seçilmesi gerekmektedir. Kullanıcı kayıtları, hayvan profilleri, sahiplenme başvuruları ve veteriner hekim notları gibi yapılandırılmış ilişkisel verilerin saklanması planlanmaktadır.

## Karar
Veritabanı motoru olarak **SQLite** seçilmiştir.

## Gerekçe
1. **Sıfır Yapılandırma (Zero Configuration):** SQLite, harici bir veritabanı sunucusu kurulumu (PostgreSQL veya MySQL gibi) gerektirmeyen, dosya tabanlı bir ilişkisel veritabanıdır. Projenin sunum aşamasında ve farklı test ortamlarında ek kurulum maliyetlerini sıfıra indirir.
2. **Taşınabilirlik:** Veritabanı tek bir dosya (`server/db/shelter.db`) olarak saklandığı için, proje teslim edilirken verilerin taşınması son derece pratiktir.
3. **İlişkisel Bütünlük:** Sahiplenme başvurularının (Foreign Key) kullanıcılar ve hayvanlar tablolarına bağlanması, kaskat silme (Cascade Delete) kuralları ve veri tutarlılığı SQLite tarafından yerel olarak desteklenir.
4. **Hafiflik ve Performans:** Barınak ölçeğinde bir veri setinde yüksek okuma/yazma performansını son derece düşük bellek tüketimiyle gerçekleştirir.

## Sonuçlar
- Sunucu kodunda `sqlite3` npm paketi kullanılarak doğrudan bağlantı kurulmuştur.
- Proje ilk kez çalıştırıldığında tablolar otomatik olarak oluşturulmakta ve `server/mockData.js` yardımıyla varsayılan veriler otomatik yüklenmektedir.
