import fs from 'fs';
import { 
  Document, Packer, Paragraph, TextRun, HeadingLevel, 
  AlignmentType, Table, TableRow, TableCell, PageBreak, WidthType, BorderStyle
} from 'docx';

// Create styling helper functions
const createHeading = (text, level) => {
  return new Paragraph({
    text: text,
    heading: level,
    spacing: { before: 240, after: 120 },
    keepWithNext: true
  });
};

const createParagraph = (text, isBold = false) => {
  return new Paragraph({
    children: [
      new TextRun({
        text: text,
        bold: isBold,
        size: 24, // 12pt
        font: 'Arial'
      })
    ],
    spacing: { after: 150, line: 360 } // 1.5 line spacing
  });
};

const createBullet = (text, isBoldText = '', normalText = '') => {
  return new Paragraph({
    children: [
      new TextRun({ text: text, font: 'Arial', size: 24 }),
      new TextRun({ text: isBoldText, bold: true, font: 'Arial', size: 24 }),
      new TextRun({ text: normalText, font: 'Arial', size: 24 })
    ],
    bullet: {
      level: 0
    },
    spacing: { after: 100 }
  });
};

const createTableHeaderCell = (text) => {
  return new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text: text, bold: true, color: 'ffffff', font: 'Arial', size: 22 })],
        alignment: AlignmentType.LEFT
      })
    ],
    shading: { fill: '0d9488' }, // Primary Teal color shading
    padding: { top: 120, bottom: 120, left: 120, right: 120 }
  });
};

const createTableCell = (text, isBold = false) => {
  return new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text: text, bold: isBold, font: 'Arial', size: 22 })],
        alignment: AlignmentType.LEFT
      })
    ],
    padding: { top: 100, bottom: 100, left: 120, right: 120 }
  });
};

const run = async () => {
  console.log('Generating Word Document...');

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // ================= COVER PAGE =================
          new Paragraph({ text: '', spacing: { before: 1200 } }), // push down
          new Paragraph({
            children: [
              new TextRun({
                text: 'SİVAS CUMHURİYET ÜNİVERSİTESİ',
                bold: true,
                size: 28,
                font: 'Arial'
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'MÜHENDİSLİK FAKÜLTESİ - YAZILIM MÜHENDİSLİĞİ BÖLÜMÜ',
                bold: true,
                size: 24,
                font: 'Arial'
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 1800 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'YAZILIM MİMARİSİ VE TASARIMI DERSİ',
                bold: true,
                size: 32,
                font: 'Arial',
                color: '0d9488'
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'PROJE RAPORU',
                bold: true,
                size: 40,
                font: 'Arial'
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Konu: Hayvan Barınağı Yönetim Platformu (PatiHaven)',
                size: 26,
                font: 'Arial',
                italic: true
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 2400 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Hazırlayan: Proje Ekip Üyeleri',
                bold: true,
                size: 24,
                font: 'Arial'
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Tarih: Haziran 2026',
                size: 22,
                font: 'Arial'
              })
            ],
            alignment: AlignmentType.CENTER
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // ================= SECTION 1: PROJE HAKKINDA =================
          createHeading('Bölüm 1: Proje Hakkında Genel Bilgi ve İsterler', HeadingLevel.HEADING_1),
          
          createParagraph(
            'PatiHaven, modern bir hayvan barınağının tüm operasyonel ve sahiplendirme süreçlerini dijitalleştirmek amacıyla geliştirilmiş gelişmiş bir web platformudur. Bu platform, barınakta yer alan canlıların aşı geçmişini, sağlık kontrollerini ve sahiplenme başvurularını merkezi bir veritabanında saklayarak takip edilebilirliği en üst düzeye çıkarır.'
          ),

          createHeading('A. Genel Gereksinimlerin Karşılanma Durumu', HeadingLevel.HEADING_2),
          
          createBullet('• ', 'Web Tabanlı Arayüz: ', 'Kullanıcıların ve barınak yetkililerinin sisteme her türlü cihazdan kolayca erişebilmesi için tamamen duyarlı (responsive) bir arayüz tasarlanmıştır.'),
          createBullet('• ', 'Kimlik Doğrulama: ', 'Kullanıcıların şifreli üyelik oluşturabildiği, JWT (JSON Web Token) tabanlı güvenli bir giriş altyapısı mevcuttur.'),
          createBullet('• ', 'Gelişmiş Hayvan Filtreleme: ', 'Kullanıcıların tür, cinsiyet, aşı durumu ve arama kelimelerine göre canlıları listeleyebileceği dinamik sorgulama yapısı.'),
          createBullet('• ', 'Sahiplenme Talepleri: ', 'Kullanıcıların diledikleri canlılar için açıklayıcı bir not ekleyerek sahiplenme başvurusu gönderebilmesi.'),
          createBullet('• ', 'Yönetici Değerlendirmesi: ', 'Yetkililerin gelen talepleri inceleyip açıklama notu ekleyerek onaylama veya reddetme yetkisi.'),
          createBullet('• ', 'Otomatik Durum Güncelleme: ', 'Talebi onaylanan hayvanın durumunun "sahiplendirildi"ye dönmesi ve o hayvan için bekleyen diğer açık taleplerin otomatik olarak elenmesi.'),
          createBullet('• ', 'İstatistikler: ', 'Kayıtlı hayvan, sahiplendirilen hayvan, bekleyen talep ve toplam kullanıcı sayısını gösteren admin paneli grafikleri.'),
          createBullet('• ', 'Dış API Erişimi: ', 'Üçüncü parti entegrasyonlar için yetkili ve güvenli (x-api-key korumalı) RESTful API endpoints.'),

          createHeading('B. Entegre Edilen Opsiyonel ve Ekstra Özellikler', HeadingLevel.HEADING_2),
          
          createBullet('• ', 'Sahiplenme Geçmişi Zaman Çizelgesi: ', 'Kullanıcıların aktif ve geçmiş başvurularını durum takibi ile birlikte görebileceği geçmiş paneli.'),
          createBullet('• ', 'Veteriner Sağlık Günlüğü: ', 'Hayvanların aşı takvimlerini, ilaç tedavilerini ve kontrollerini içeren tarih bazlı hekim günlük sistemi.'),
          createBullet('• ', 'Sahiplenici Geri Bildirim Sistemi: ', 'Sahiplenilen hayvanların yeni evlerindeki durumlarını bildiren fotoğraf ve açıklama içeren durum raporları.'),
          createBullet('• ', 'Etkileşimli API Test Konsolu: ', 'Geliştiricilerin dış API uç noktalarını tarayıcı üzerinden anlık test edebilecekleri canlı Swagger benzeri arayüz.'),
          createBullet('• ', 'Karanlık/Aydınlık Tema: ', 'Kullanıcı konforunu artıran HSL tabanlı çift renk şablonu desteği.'),

          new Paragraph({ children: [new PageBreak()] }),

          // ================= SECTION 2: ARCHITECTURE =================
          createHeading('Bölüm 2: Yazılım Mimarisi ve Teknoloji Seçimleri', HeadingLevel.HEADING_1),
          
          createParagraph(
            'Uygulama, sorumlulukların ayrıştırılması (Separation of Concerns) ilkesine sadık kalınarak İstemci-Sunucu (Client-Server) mimarisinde monorepo kod düzeniyle inşa edilmiştir.'
          ),

          createHeading('Seçilen Teknolojiler ve Tercih Nedenleri', HeadingLevel.HEADING_2),

          createBullet('1. ', 'React (Vite) [Frontend]: ', 'Kullanıcı etkileşiminin çok yoğun olduğu arayüz süreçlerinde sayfa yenilenmesini engelleyen Single Page Application (SPA) deneyimi sağlar. Vite, hızlı derleme süresi sunar.'),
          createBullet('2. ', 'Node.js & Express.js [Backend]: ', 'Asenkron I/O modeli sayesinde yüksek trafikli API isteklerini verimli şekilde karşılar. Projenin tek bir dil (JavaScript/ES Modules) ekosisteminde kalmasını sağlar.'),
          createBullet('3. ', 'SQLite [Veritabanı]: ', 'Verileri ilişkisel modelde (RDBMS) tutarak tablolar arası bütünlüğü (Foreign Key constraints) korur. Dosya tabanlı çalıştığından ek veritabanı kurulumu gerektirmez ve projenin taşınabilirliğini kolaylaştırır.'),
          createBullet('4. ', 'BcryptJS & JWT [Güvenlik]: ', 'Kullanıcı şifrelerinin güvenliğini sağlamak için tek yönlü karma (hashing) algoritmaları ve oturum doğrulamak için kriptografik JWT token yapısı kullanılmıştır.'),

          new Paragraph({ children: [new PageBreak()] }),

          // ================= SECTION 3: DATABASE SCHEMA =================
          createHeading('Bölüm 3: İlişkisel Veritabanı Şeması', HeadingLevel.HEADING_1),
          
          createParagraph(
            'Sistem, veri bütünlüğünü korumak adına 5 temel ilişkisel tablodan oluşmaktadır. Aşağıdaki tablolarda bu şemanın yapıları detaylandırılmıştır.'
          ),

          // User Table Table
          createHeading('Tablo 1: users (Kullanıcı Kayıtları)', HeadingLevel.HEADING_3),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableHeaderCell('Kolon Adı'),
                  createTableHeaderCell('Veri Tipi'),
                  createTableHeaderCell('Kısıtlamalar'),
                  createTableHeaderCell('Açıklama')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('id', true),
                  createTableCell('INTEGER'),
                  createTableCell('PRIMARY KEY, AUTOINCREMENT'),
                  createTableCell('Benzersiz kullanıcı kimliği')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('name'),
                  createTableCell('TEXT'),
                  createTableCell('NOT NULL'),
                  createTableCell('Ad ve Soyadı')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('email'),
                  createTableCell('TEXT'),
                  createTableCell('UNIQUE, NOT NULL'),
                  createTableCell('E-posta adresi (Giriş bilgisi)')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('password_hash'),
                  createTableCell('TEXT'),
                  createTableCell('NOT NULL'),
                  createTableCell('Bcrypt ile şifrelenmiş parola')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('role'),
                  createTableCell('TEXT'),
                  createTableCell('DEFAULT "user"'),
                  createTableCell('Kullanıcı rolü ("user" veya "admin")')
                ]
              })
            ]
          }),

          // Animals Table Table
          new Paragraph({ text: '', spacing: { before: 200 } }),
          createHeading('Tablo 2: animals (Hayvan Kayıtları)', HeadingLevel.HEADING_3),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableHeaderCell('Kolon Adı'),
                  createTableHeaderCell('Veri Tipi'),
                  createTableHeaderCell('Kısıtlamalar'),
                  createTableHeaderCell('Açıklama')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('id', true),
                  createTableCell('INTEGER'),
                  createTableCell('PRIMARY KEY, AUTOINCREMENT'),
                  createTableCell('Benzersiz hayvan kimliği')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('name'),
                  createTableCell('TEXT'),
                  createTableCell('NOT NULL'),
                  createTableCell('Hayvanın ismi')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('species'),
                  createTableCell('TEXT'),
                  createTableCell('NOT NULL'),
                  createTableCell('Türü ("Köpek", "Kedi" vb.)')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('breed'),
                  createTableCell('TEXT'),
                  createTableCell(''),
                  createTableCell('Cinsi / Irkı')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('status'),
                  createTableCell('TEXT'),
                  createTableCell('DEFAULT "available"'),
                  createTableCell('Durumu ("available" veya "adopted")')
                ]
              })
            ]
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // ================= SECTION 4: API ENTEGRASYONLARI =================
          createHeading('Bölüm 4: Dış API Entegrasyonları ve Güvenliği', HeadingLevel.HEADING_1),
          
          createParagraph(
            'İster 8 kapsamında, platformun dışarıdan üçüncü parti yazılımlar tarafından sorgulanabilmesini sağlayan bağımsız API uç noktaları tasarlanmıştır. Bu API uç noktaları aşağıdaki gibi çalışmaktadır:'
          ),

          createBullet('• ', 'GET /api/v1/external/animals: ', 'Barınaktaki tüm hayvan listesini JSON dizisi olarak döner.'),
          createBullet('• ', 'GET /api/v1/external/users: ', 'Kayıtlı kullanıcıların temel bilgilerini (gizlilik sınırları dahilinde şifreler olmadan) paylaşır.'),

          createHeading('API Anahtarı Güvenlik Katmanı (x-api-key)', HeadingLevel.HEADING_2),
          createParagraph(
            'Yetkisiz erişimleri önlemek amacıyla, harici istek atan sistemlerin istek başlığına (Request Header) geçerli bir API anahtarı girmesi zorunlu tutulmuştur. Geçerli test anahtarı: patihaven_guest_key_2026. Bu anahtarın girilmediği veya yanlış girildiği durumlarda sunucu "401 Yetkisiz Erişim" hatası döndürür.'
          ),

          // ================= SECTION 5: MANAGEMENT PROCESS =================
          createHeading('Bölüm 5: Değerlendirme Kriterleri Uyum Raporu', HeadingLevel.HEADING_1),
          
          createParagraph(
            'Akademik proje değerlendirme kriterlerine tam uyum sağlamak amacıyla, modern yazılım mühendisliği pratikleri uygulanmış ve dokümante edilmiştir:'
          ),

          createBullet('1. ', 'Mimari Karar Kayıtları (ADR): ', 'Önemli mimari kararlar için docs/adr/ klasöründe standart formatta raporlar hazırlanmıştır.'),
          createBullet('2. ', 'Toplantı Notları: ', 'Geliştirme sürecindeki ekip içi kararları, iş paylaşımlarını gösteren toplantı kayıtları docs/meetings/ klasöründedir.'),
          createBullet('3. ', 'Hata/İş Takip Sistemi (Issues): ', 'Karşılaşılan kritik hatalar ve bunlara getirilen teknik çözümler docs/issues/ klasöründe belgelenmiştir.'),
          createBullet('4. ', 'Kod Gözden Geçirme (Code Reviews): ', 'Güvenlik, modülerlik ve temiz kod ilkeleri doğrultusunda yapılan kod incelemeleri docs/reviews/ klasöründedir.')
        ]
      }
    ]
  });

  // Write file
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('docs/Proje_Raporu.docx', buffer);
  console.log('✅ Word document created successfully at docs/Proje_Raporu.docx');
};

run().catch((err) => {
  console.error('Error creating document:', err);
});
