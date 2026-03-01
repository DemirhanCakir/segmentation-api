import Database from 'better-sqlite3';
import { User } from './types';

const db = new Database(':memory:');

// Create the user table
db.exec(`
  CREATE TABLE user (
    id TEXT,
    level INTEGER,
    country TEXT,
    first_session INTEGER,
    last_session INTEGER,
    purchase_amount INTEGER,
    last_purchase_at INTEGER
  )
`);

// Register the custom _now() function
db.function('_now', () => Math.floor(Date.now() / 1000));

// Prepared statements for efficiency
const insertStmt = db.prepare(`
  INSERT INTO user (id, level, country, first_session, last_session, purchase_amount, last_purchase_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const deleteStmt = db.prepare('DELETE FROM user');

export function evaluateSegments(
  user: User,
  segments: Record<string, string>
): Record<string, boolean> {
  // Insert the user data
  insertStmt.run(
    user.id,
    user.level,
    user.country,
    user.first_session,
    user.last_session,
    user.purchase_amount,
    user.last_purchase_at
  );

  try {
    const results: Record<string, boolean> = {};

    for (const [name, rule] of Object.entries(segments)) {
      const query = `SELECT 1 FROM user WHERE ${rule}`;
      try {
        const row = db.prepare(query).get();
        results[name] = row !== undefined;
      } catch (err) {
        // Clean up before throwing
        deleteStmt.run();
        const message = err instanceof Error ? err.message : 'Unknown error';
        throw new Error(`Invalid segment rule "${name}": ${message}`);
      }
    }

    return results;
  } finally {
    // Always clean up the user data
    deleteStmt.run();
  }
}
