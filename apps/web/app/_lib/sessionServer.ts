import { cookies } from 'next/headers';

// Server-side session management using cookies
export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('currentUserId')?.value || null;
}

export async function setSessionUserId(userId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('currentUserId', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('currentUserId');
}