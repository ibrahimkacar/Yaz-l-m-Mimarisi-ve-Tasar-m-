import bcryptjs from 'bcryptjs';
import { dbGet, dbRun } from './db/database.js';

export const seedDb = async () => {
  // Check if we already have users. If yes, skip seeding.
  const userCheck = await dbGet('SELECT COUNT(*) as count FROM users');
  if (userCheck.count > 0) {
    console.log('Database already has data. Skipping seed.');
    return;
  }

  console.log('Seeding initial data...');

  // 1. Hash Passwords
  const salt = await bcryptjs.genSalt(10);
  const adminHash = await bcryptjs.hash('admin123', salt);
  const userHash = await bcryptjs.hash('user123', salt);

  // 2. Insert Users
  const adminId = (await dbRun(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    ['Barınak Yöneticisi', 'admin@patihaven.com', adminHash, 'admin']
  )).lastID;

  const userId1 = (await dbRun(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    ['Ahmet Yılmaz', 'ahmet@patihaven.com', userHash, 'user']
  )).lastID;

  const userId2 = (await dbRun(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    ['Ayşe Demir', 'ayse@patihaven.com', userHash, 'user']
  )).lastID;

  // 3. Insert Animals
  // We use reliable Unsplash image links for pets
  const animals = [
    {
      name: 'Karabaş',
      species: 'Köpek',
      breed: 'Sivas Kangalı',
      age: 3,
      gender: 'Erkek',
      vaccination_status: 'Tamamlandı',
      health_notes: 'Çok sağlıklı, enerjik. Günlük yürüyüşleri sever.',
      status: 'available',
      image_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600'
    },
    {
      name: 'Pamuk',
      species: 'Kedi',
      breed: 'Ankara Kedisi',
      age: 2,
      gender: 'Dişi',
      vaccination_status: 'Kısmi',
      health_notes: 'Sol gözünde hafif bir kuruluk var, günlük damla kullanıyor.',
      status: 'available',
      image_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600'
    },
    {
      name: 'Maviş',
      species: 'Kuş',
      breed: 'Muhabbet Kuşu',
      age: 1,
      gender: 'Erkek',
      vaccination_status: 'Yok',
      health_notes: 'Oldukça neşeli, sürekli ötüyor ve konuşmaya hevesli.',
      status: 'available',
      image_url: 'https://images.unsplash.com/photo-1552728089-57bdde30ebd3?auto=format&fit=crop&q=80&w=600'
    },
    {
      name: 'Çakıl',
      species: 'Köpek',
      breed: 'Golden Retriever',
      age: 4,
      gender: 'Dişi',
      vaccination_status: 'Tamamlandı',
      health_notes: 'Çocuklarla arası mükemmel. Temel itaat eğitimleri var.',
      status: 'adopted', // Seeded as adopted to show statistics & adoption history
      image_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600'
    },
    {
      name: 'Duman',
      species: 'Kedi',
      breed: 'British Shorthair',
      age: 1,
      gender: 'Erkek',
      vaccination_status: 'Tamamlandı',
      health_notes: 'Aşıları tam. Kısırlaştırıldı. Sakin karakterli.',
      status: 'available',
      image_url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=600'
    },
    {
      name: 'Gofret',
      species: 'Köpek',
      breed: 'Corgi',
      age: 2,
      gender: 'Erkek',
      vaccination_status: 'Kısmi',
      health_notes: 'Arka sol bacağında eski bir kırık iyileşmiş durumda, hafif aksama yapabiliyor.',
      status: 'available',
      image_url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600'
    },
    {
      name: 'Badem',
      species: 'Tavşan',
      breed: 'Hollanda Cüce Tavşanı',
      age: 1,
      gender: 'Dişi',
      vaccination_status: 'Tamamlandı',
      health_notes: 'Havuç yemeyi çok seviyor. Oldukça oyuncu ve uysal.',
      status: 'available',
      image_url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=600'
    }
  ];

  const animalIds = [];
  for (const animal of animals) {
    const id = (await dbRun(
      `INSERT INTO animals (name, species, breed, age, gender, vaccination_status, health_notes, status, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        animal.name,
        animal.species,
        animal.breed,
        animal.age,
        animal.gender,
        animal.vaccination_status,
        animal.health_notes,
        animal.status,
        animal.image_url
      ]
    )).lastID;
    animalIds.push({ name: animal.name, id });
  }

  // 4. Insert Mock Adoption Requests
  // Request for Karabaş by Ahmet Yılmaz (Pending)
  const karabasId = animalIds.find(a => a.name === 'Karabaş').id;
  await dbRun(
    'INSERT INTO adoption_requests (user_id, animal_id, status, request_note, admin_note) VALUES (?, ?, ?, ?, ?)',
    [
      userId1,
      karabasId,
      'pending',
      'Bahçeli evim var, Karabaş ile birlikte bol bol koşabiliriz. Ona harika bir yuva sunmak istiyorum.',
      null
    ]
  );

  // Request for Çakıl by Ayşe Demir (Approved -> makes Çakıl status adopted)
  const cakilId = animalIds.find(a => a.name === 'Çakıl').id;
  const approvedReqId = (await dbRun(
    'INSERT INTO adoption_requests (user_id, animal_id, status, request_note, admin_note) VALUES (?, ?, ?, ?, ?)',
    [
      userId2,
      cakilId,
      'approved',
      'Apartman dairesinde yaşıyorum ama günde 3 kez dışarı çıkarabilirim. Golden cinsi köpekleri çok seviyorum.',
      'Kullanıcı ile yüz yüze görüşüldü, evi köpek bakımı için uygun görüldü. Onaylandı.'
    ]
  )).lastID;

  // 5. Insert Mock Health Logs
  await dbRun(
    'INSERT INTO health_logs (animal_id, note, recorded_by) VALUES (?, ?, ?)',
    [karabasId, 'Kuduz aşısı yapıldı.', 'Veteriner Hakan Kaya']
  );
  await dbRun(
    'INSERT INTO health_logs (animal_id, note, recorded_by) VALUES (?, ?, ?)',
    [karabasId, 'İç-dış parazit aşıları yenilendi.', 'Veteriner Hakan Kaya']
  );
  await dbRun(
    'INSERT INTO health_logs (animal_id, note, recorded_by) VALUES (?, ?, ?)',
    [cakilId, 'Yıllık genel kontrolü tamamlandı.', 'Veteriner Hakan Kaya']
  );

  // 6. Insert Mock Animal Report (Feedback from Ayşe Demir about Çakıl)
  await dbRun(
    `INSERT INTO animal_reports (adoption_request_id, user_id, animal_id, report_text, health_status)
     VALUES (?, ?, ?, ?, ?)`,
    [
      approvedReqId,
      userId2,
      cakilId,
      'Çakıl yeni evine çok hızlı alıştı. İlk günlerde biraz çekingen davransa da şimdi evin neşesi oldu. Mamalarını düzenli yiyor.',
      'healthy'
    ]
  );

  console.log('Seed completed successfully!');
};
