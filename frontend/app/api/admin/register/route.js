// Admin registration API route

import { randomBytes, randomUUID, scrypt } from 'node:crypto';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { promisify } from 'node:util';


const hashPassword = promisify(scrypt);

export async function POST(request) {
  let form;

  try {
    form = await request.json();
  } catch {
    return Response.json({ error: 'Invalid form data.' }, { status: 400 });
  }

  const fullName = typeof form?.fullName === 'string' ? form.fullName.trim() : '';
  const organization = typeof form?.organization === 'string' ? form.organization.trim() : '';
  const email = typeof form?.email === 'string' ? form.email.trim().toLowerCase() : '';
  const password = typeof form?.password === 'string' ? form.password : '';

  if (
    !fullName || fullName.length > 100 ||
    !organization || organization.length > 150 ||
    email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    password.length < 8 || password.length > 128
  ) {
    return Response.json(
      { error: 'Enter valid details and use a password between 8 and 128 characters.' },
      { status: 400 },
    );
  }

  let db;

  try {
    const communityId = `C360-${randomUUID()}`;
    const salt = randomBytes(16).toString('hex');
    const hash = await hashPassword(password, salt, 64);

    db = new DatabaseSync(path.join(process.cwd(), 'eventrix.db'));
    db.exec(`
      CREATE TABLE IF NOT EXISTS admins (
        community_id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        organization TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_salt TEXT NOT NULL,
        password_hash TEXT NOT NULL
      )
    `);

    const result = db.prepare(`
      INSERT INTO admins (
        community_id, full_name, organization, email, password_salt, password_hash
      )
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(email) DO NOTHING
    `).run(communityId, fullName, organization, email, salt, hash.toString('hex'));

    if (result.changes === 0) {
      return Response.json({ error: 'This email is already registered.' }, { status: 409 });
    }

    return Response.json({ communityId }, { status: 201 });
  } catch (error) {
    console.error('Admin registration failed:', error);
    return Response.json({ error: 'Could not save the account.' }, { status: 500 });
  } finally {
    db?.close();
  }
}