import sqlite3 from 'sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure the db folder exists
const dbDir = join(__dirname);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = join(dbDir, 'shelter.db');
const db = new sqlite3.Database(dbPath);

export const initDb = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 1. Users Table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'user', -- 'user' or 'admin'
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 2. Animals Table
      db.run(`
        CREATE TABLE IF NOT EXISTS animals (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          species TEXT NOT NULL, -- 'dog', 'cat', 'bird', etc.
          breed TEXT,
          age INTEGER,
          gender TEXT, -- 'male', 'female'
          vaccination_status TEXT, -- 'completed', 'partial', 'none'
          health_notes TEXT,
          status TEXT NOT NULL DEFAULT 'available', -- 'available' or 'adopted'
          image_url TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 3. Adoption Requests Table
      db.run(`
        CREATE TABLE IF NOT EXISTS adoption_requests (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          animal_id INTEGER NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
          request_note TEXT,
          admin_note TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE
        )
      `);

      // 4. Animal Condition Reports Table (Optional Feature 3: feedback from adopters)
      db.run(`
        CREATE TABLE IF NOT EXISTS animal_reports (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          adoption_request_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          animal_id INTEGER NOT NULL,
          report_text TEXT NOT NULL,
          health_status TEXT NOT NULL, -- 'healthy', 'needs_vet', 'recovering'
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (adoption_request_id) REFERENCES adoption_requests(id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE
        )
      `);

      // 5. Health & Care Logs Table (Optional Feature 2: notes by staff)
      db.run(`
        CREATE TABLE IF NOT EXISTS health_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          animal_id INTEGER NOT NULL,
          note TEXT NOT NULL,
          recorded_by TEXT NOT NULL, -- Name of the official
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE
        )
      `);
      
      resolve();
    });
  });
};

// Helper wrappers for db queries to make them async/await friendly
export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this); // 'this' contains lastID and changes
    });
  });
};

export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export default db;
