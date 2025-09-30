// Client-side session management
export function getStoredUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('currentUserId');
}

export function setStoredUserId(userId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('currentUserId', userId);
}

export function clearStoredUserId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('currentUserId');
}

export function isLoggedIn(): boolean {
  return !!getStoredUserId();
}