import { NextResponse } from 'next/server';
import { getUserByToken } from '@/lib/auth';

function getTokenFromHeader(req: Request) {
  const auth = req.headers.get('authorization') || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

export async function GET(req: Request) {
  const token = getTokenFromHeader(req);
  const user = await getUserByToken(token);
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  return NextResponse.json({ user });
}
