import { ReactNode } from 'react';
import Navigation from '../Navigation';
import type { User } from '../../types/api';

interface PageLayoutProps {
  children: ReactNode;
  currentUser?: User | null;
}

export function PageLayout({ children, currentUser = null }: PageLayoutProps) {
  return (
    <>
      <Navigation currentUser={currentUser} />
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem',
      }}>
        {children}
      </main>
    </>
  );
}
