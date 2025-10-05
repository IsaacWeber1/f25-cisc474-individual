'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '../_lib/apiClient';
import UserSwitcher from './UserSwitcher';

interface NavigationProps {
  currentUser: User | null;
}

export default function Navigation({ currentUser }: NavigationProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav style={{
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '1rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }}>
          <Link href="/" style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: 'white',
            textDecoration: 'none'
          }}>
            LMS
          </Link>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link 
              href="/" 
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '0.25rem',
                backgroundColor: isActive('/') ? '#1d4ed8' : 'transparent',
                color: 'white',
                textDecoration: 'none',
                transition: 'background-color 0.2s'
              }}
            >
              Dashboard
            </Link>
            
            <Link 
              href="/profile" 
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '0.25rem',
                backgroundColor: isActive('/profile') ? '#1d4ed8' : 'transparent',
                color: 'white',
                textDecoration: 'none',
                transition: 'background-color 0.2s'
              }}
            >
              Profile
            </Link>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {currentUser ? (
            <UserSwitcher currentUser={currentUser} />
          ) : (
            <span style={{ fontSize: '0.875rem' }}>Not logged in</span>
          )}
        </div>
      </div>
    </nav>
  );
}