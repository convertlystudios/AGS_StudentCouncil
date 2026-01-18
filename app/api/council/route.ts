import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getUserByToken } from '@/lib/auth';

const councilPath = path.join(process.cwd(), 'data', 'council.json');

async function readCouncil() {
  try {
    const raw = await fs.readFile(councilPath, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

async function writeCouncil(data: any[]) {
  await fs.mkdir(path.dirname(councilPath), { recursive: true });
  await fs.writeFile(councilPath, JSON.stringify(data, null, 2), 'utf-8');
}

function getTokenFromHeader(req: Request) {
  const auth = req.headers.get('authorization') || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

async function requireCouncil(req: Request) {
  const token = getTokenFromHeader(req);
  const user = await getUserByToken(token);
  if (!user || user.role !== 'council') {
    return null;
  }
  return user;
}

export async function GET() {
  const list = await readCouncil();
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const user = await requireCouncil(req);
  if (!user) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const value = String(body.value || '').trim();
  if (!value) return NextResponse.json({ error: 'value required' }, { status: 400 });
  const list = await readCouncil();
  if (list.includes(value)) return NextResponse.json({ error: 'exists' }, { status: 409 });
  list.push(value);
  await writeCouncil(list);
  return NextResponse.json({ success: true, value }, { status: 201 });
}

export async function DELETE(req: Request) {
  const user = await requireCouncil(req);
  if (!user) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const url = new URL(req.url);
  const value = url.searchParams.get('value');
  if (!value) return NextResponse.json({ error: 'value required' }, { status: 400 });
  let list = await readCouncil();
  const before = list.length;
  list = list.filter((v: any) => v !== value);
  if (list.length === before) return NextResponse.json({ error: 'not found' }, { status: 404 });
  await writeCouncil(list);
  return NextResponse.json({ success: true });
}
