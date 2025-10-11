import { Link, useRouterState } from '@tanstack/react-router';
import { ROUTES } from '../config/routes';
import { COLORS } from '../config/constants';
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
        backgroundColor: COLORS.primary[500],
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
            to={ROUTES.home}
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
              to={ROUTES.home}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '0.25rem',
                backgroundColor: isActive(ROUTES.home) ? COLORS.primary[600] : 'transparent',
                color: 'white',
                textDecoration: 'none',
                transition: 'background-color 0.2s',
              }}
            >
              Dashboard
            </Link>

            <Link
              to={ROUTES.courses}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '0.25rem',
                backgroundColor: isActive(ROUTES.courses)
                  ? COLORS.primary[600]
                  : 'transparent',
                color: 'white',
                textDecoration: 'none',
                transition: 'background-color 0.2s',
              }}
            >
              Courses
            </Link>

            <Link
              to={ROUTES.profile}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '0.25rem',
                backgroundColor: isActive(ROUTES.profile)
                  ? COLORS.primary[600]
                  : 'transparent',
                color: 'white',
                textDecoration: 'none',
                transition: 'background-color 0.2s',
              }}
            >
              Profile
            </Link>

            <Link
              to={ROUTES.users}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '0.25rem',
                backgroundColor: isActive(ROUTES.users) ? COLORS.primary[600] : 'transparent',
                color: 'white',
                textDecoration: 'none',
                transition: 'background-color 0.2s',
              }}
            >
              Users
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
