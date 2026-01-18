import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const users = [
  {
    username: 'admin_sekbid@9',
    passwordHash: bcrypt.hashSync('170845', 10),
    role: 'council',
  },
  {
    username: 'council2',
    passwordHash: bcrypt.hashSync('council-secret-2', 10),
    role: 'council',
  },
];

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const user = users.find(u => u.username === username);
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  return NextResponse.json({
    username: user.username,
    role: user.role,
  });
}