'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getCurrentUser } from '../_lib/mockData';

export default function Navigation() {
  const pathname = usePathname();
  const currentUser = getCurrentUser();

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
          <span style={{ fontSize: '0.875rem' }}>
            Welcome, <span style={{ fontWeight: 600 }}>{currentUser.name}</span>
          </span>
          <span style={{
            fontSize: '0.75rem',
            backgroundColor: '#1d4ed8',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            textTransform: 'capitalize'
          }}>
            {currentUser.role}
          </span>
        </div>
      </div>
    </nav>
  );
}