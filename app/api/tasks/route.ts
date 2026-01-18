import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const tasksPath = path.join(process.cwd(), 'data', 'tasks.json');

async function readTasks() {
  try {
    const raw = await fs.readFile(tasksPath, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

async function writeTasks(tasks: any[]) {
  await fs.mkdir(path.dirname(tasksPath), { recursive: true });
  await fs.writeFile(tasksPath, JSON.stringify(tasks, null, 2), 'utf-8');
}

function getAuthToken(req: Request) {
  const auth = req.headers.get('authorization') || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

export async function GET() {
  const tasks = await readTasks();
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const title = String(body.title || '').trim();
  if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 });

  const tasks = await readTasks();
  const task = { id: Date.now().toString(), title, completed: false, createdAt: new Date().toISOString() };
  tasks.unshift(task);
  await writeTasks(tasks);
  return NextResponse.json(task, { status: 201 });
}

export async function PATCH(req: Request) {
  const body = await req.json().catch(() => ({}));
  const id = String(body.id || '');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const tasks = await readTasks();
  const idx = tasks.findIndex((t: any) => t.id === id);
  if (idx === -1) return NextResponse.json({ error: 'not found' }, { status: 404 });

  tasks[idx] = { ...tasks[idx], ...body };
  await writeTasks(tasks);
  return NextResponse.json(tasks[idx]);
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  let tasks = await readTasks();
  const before = tasks.length;
  tasks = tasks.filter((t: any) => t.id !== id);
  if (tasks.length === before) return NextResponse.json({ error: 'not found' }, { status: 404 });
  await writeTasks(tasks);
  return NextResponse.json({ success: true });
}
