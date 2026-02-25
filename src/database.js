import * as SQLite from 'expo-sqlite';

let db = null;

export async function getDatabase() {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('smart_homework.db');
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS homework (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject TEXT NOT NULL,
      description TEXT NOT NULL,
      dueDate TEXT NOT NULL,
      priority INTEGER NOT NULL DEFAULT 3,
      isCompleted INTEGER NOT NULL DEFAULT 0,
      reminder INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  return db;
}

export async function getAllHomework() {
  const database = await getDatabase();
  const rows = await database.getAllAsync(
    'SELECT * FROM homework ORDER BY isCompleted ASC, priority DESC, dueDate ASC'
  );
  return rows;
}

export async function addHomework(subject, description, dueDate, priority, reminder) {
  const database = await getDatabase();
  const result = await database.runAsync(
    'INSERT INTO homework (subject, description, dueDate, priority, reminder) VALUES (?, ?, ?, ?, ?)',
    [subject, description, dueDate, priority, reminder ? 1 : 0]
  );
  return result.lastInsertRowId;
}

export async function updateHomework(id, subject, description, dueDate, priority, reminder) {
  const database = await getDatabase();
  await database.runAsync(
    `UPDATE homework SET subject = ?, description = ?, dueDate = ?, priority = ?, reminder = ?, updatedAt = datetime('now') WHERE id = ?`,
    [subject, description, dueDate, priority, reminder ? 1 : 0, id]
  );
}

export async function toggleComplete(id, isCompleted) {
  const database = await getDatabase();
  await database.runAsync(
    `UPDATE homework SET isCompleted = ?, updatedAt = datetime('now') WHERE id = ?`,
    [isCompleted ? 1 : 0, id]
  );
}

export async function deleteHomework(id) {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM homework WHERE id = ?', [id]);
}
