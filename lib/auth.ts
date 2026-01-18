import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const usersPath = path.join(process.cwd(), 'data', 'users.json');

type StoredUser = { username: string; role?: string };

async function readUsers(): Promise<Record<string, StoredUser>> {
  try {
    const raw = await fs.readFile(usersPath, 'utf-8');
    return JSON.parse(raw || '{}');
  } catch (e) {
    return {};
  }
}

async function writeUsers(data: Record<string, StoredUser>) {
  await fs.mkdir(path.dirname(usersPath), { recursive: true });
  await fs.writeFile(usersPath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function createTokenForUser(username: string, role = 'user') {
  const users = await readUsers();
  const token = crypto.randomBytes(16).toString('hex');
  users[token] = { username, role };
  await writeUsers(users);
  return { token, username, role };
}

export async function getUserByToken(token?: string | null) {
  if (!token) return null;
  const users = await readUsers();
  return users[token] || null;
}

export async function revokeToken(token?: string | null) {
  if (!token) return false;
  const users = await readUsers();
  if (!users[token]) return false;
  delete users[token];
  await writeUsers(users);
  return true;
}
