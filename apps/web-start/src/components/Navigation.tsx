import { Link, useRouterState } from '@tanstack/react-router';
import type { User } from '../types/api';

interface NavigationProps {
  currentUser: User | null;
}

export default function Navigation({ currentUser }: NavigationProps) {
  const router = useRouterState();
  const pathname = router.location.pathname;

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav
      style={{
        backgroundColor: '#2563eb',
        color: 'white',
        padding: '1rem',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
          }}
        >
          <Link
            to="/"
            style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            LMS
          </Link>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link
              to="/"
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '0.25rem',
                backgroundColor: isActive('/') ? '#1d4ed8' : 'transparent',
                color: 'white',
                textDecoration: 'none',
                transition: 'background-color 0.2s',
              }}
            >
              Dashboard
            </Link>

            <Link
              to="/courses"
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '0.25rem',
                backgroundColor: isActive('/courses')
                  ? '#1d4ed8'
                  : 'transparent',
                color: 'white',
                textDecoration: 'none',
                transition: 'background-color 0.2s',
              }}
            >
              Courses
            </Link>

            <Link
              to="/profile"
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '0.25rem',
                backgroundColor: isActive('/profile')
                  ? '#1d4ed8'
                  : 'transparent',
                color: 'white',
                textDecoration: 'none',
                transition: 'background-color 0.2s',
              }}
            >
              Profile
            </Link>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          {currentUser ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span style={{ fontSize: '0.875rem' }}>{currentUser.name}</span>
            </div>
          ) : (
            <span style={{ fontSize: '0.875rem' }}>Not logged in</span>
          )}
        </div>
      </div>
    </nav>
  );
}
