import { useQuery } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';
import { PageLayout } from '../components/common/PageLayout';
import { ROUTES } from '../config/routes';
import { COLORS, TYPOGRAPHY } from '../config/constants';
import { useAuth } from '../contexts/AuthContext';
import { backendFetcher } from '../integrations/fetcher';
import type { User } from '../types/api';

export const Route = createFileRoute('/api-demo')({
  component: ApiDemoPage,
});

function ApiDemoPage() {
  const { currentUserId } = useAuth();

  const { data: currentUser } = useQuery({
    queryKey: ['user', currentUserId],
    queryFn: backendFetcher<User>(`/users/${currentUserId}`),
  });

  return (
    <PageLayout currentUser={currentUser}>
      {/* Header */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem',
        }}
      >
        <h1
          style={{
            fontSize: TYPOGRAPHY.sizes['4xl'],
            fontWeight: TYPOGRAPHY.weights.bold,
            color: COLORS.gray[900],
            marginBottom: '1rem',
          }}
        >
          Frontend-Backend Integration Demo
        </h1>
        <p
          style={{
            color: COLORS.gray[600],
            lineHeight: 1.6,
            marginBottom: '1rem',
          }}
        >
          This page demonstrates the connection between the TanStack Start frontend and NestJS backend API.
          All pages use <strong>TanStack Query (React Query)</strong> to retrieve data from the backend
          with automatic <strong>caching, loading states, and error handling</strong>.
        </p>
        <div
          style={{
            backgroundColor: COLORS.primary[100],
            border: `1px solid ${COLORS.primary[200]}`,
            borderRadius: '0.5rem',
            padding: '1rem',
            marginTop: '1rem',
          }}
        >
          <p
            style={{
              fontSize: TYPOGRAPHY.sizes.sm,
              color: COLORS.primary[700],
              margin: 0,
            }}
          >
            <strong>Backend API:</strong>{' '}
            <code
              style={{
                backgroundColor: 'rgba(0,0,0,0.1)',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                fontFamily: 'monospace',
              }}
            >
              {import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}
            </code>
            <br />
            <strong>Frontend:</strong> TanStack Start with Vite
          </p>
        </div>
      </div>

      {/* Demo Pages */}
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {/* Dashboard Demo */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: `2px solid ${COLORS.success[600]}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '1rem',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: TYPOGRAPHY.sizes['2xl'],
                  fontWeight: TYPOGRAPHY.weights.bold,
                  color: COLORS.success[600],
                  marginBottom: '0.5rem',
                }}
              >
                🏠 Dashboard
              </h2>
              <p
                style={{
                  color: COLORS.gray[600],
                  fontSize: TYPOGRAPHY.sizes.sm,
                  marginBottom: '0.5rem',
                }}
              >
                <strong>Route:</strong>{' '}
                <code
                  style={{
                    backgroundColor: COLORS.gray[100],
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontFamily: 'monospace',
                    fontSize: TYPOGRAPHY.sizes.sm,
                  }}
                >
                  /
                </code>
              </p>
              <p
                style={{
                  color: COLORS.gray[600],
                  fontSize: TYPOGRAPHY.sizes.sm,
                }}
              >
                <strong>API Endpoints:</strong>{' '}
                <code
                  style={{
                    backgroundColor: COLORS.gray[100],
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontFamily: 'monospace',
                    fontSize: TYPOGRAPHY.sizes.sm,
                  }}
                >
                  GET /users/:id, GET /courses
                </code>
              </p>
            </div>
            <span
              style={{
                backgroundColor: COLORS.success[500],
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: TYPOGRAPHY.sizes.xs,
                fontWeight: TYPOGRAPHY.weights.semibold,
              }}
            >
              TANSTACK QUERY
            </span>
          </div>
          <p
            style={{
              color: COLORS.gray[700],
              marginBottom: '1.5rem',
              lineHeight: 1.6,
            }}
          >
            Fetches user profile and enrolled courses using React Query with automatic caching.
          </p>
          <Link
            to={ROUTES.home}
            style={{
              display: 'inline-block',
              backgroundColor: COLORS.success[600],
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: TYPOGRAPHY.weights.semibold,
              transition: 'background-color 0.2s',
            }}
          >
            View Dashboard →
          </Link>
        </div>

        {/* Courses Demo */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: `2px solid ${COLORS.primary[500]}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '1rem',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: TYPOGRAPHY.sizes['2xl'],
                  fontWeight: TYPOGRAPHY.weights.bold,
                  color: COLORS.primary[500],
                  marginBottom: '0.5rem',
                }}
              >
                📚 Courses Catalog
              </h2>
              <p
                style={{
                  color: COLORS.gray[600],
                  fontSize: TYPOGRAPHY.sizes.sm,
                  marginBottom: '0.5rem',
                }}
              >
                <strong>Route:</strong>{' '}
                <code
                  style={{
                    backgroundColor: COLORS.gray[100],
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontFamily: 'monospace',
                    fontSize: TYPOGRAPHY.sizes.sm,
                  }}
                >
                  /courses
                </code>
              </p>
              <p
                style={{
                  color: COLORS.gray[600],
                  fontSize: TYPOGRAPHY.sizes.sm,
                }}
              >
                <strong>API Endpoint:</strong>{' '}
                <code
                  style={{
                    backgroundColor: COLORS.gray[100],
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontFamily: 'monospace',
                    fontSize: TYPOGRAPHY.sizes.sm,
                  }}
                >
                  GET /courses
                </code>
              </p>
            </div>
            <span
              style={{
                backgroundColor: COLORS.success[500],
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: TYPOGRAPHY.sizes.xs,
                fontWeight: TYPOGRAPHY.weights.semibold,
              }}
            >
              TANSTACK QUERY
            </span>
          </div>
          <p
            style={{
              color: COLORS.gray[700],
              marginBottom: '1.5rem',
              lineHeight: 1.6,
            }}
          >
            Fetches all courses from the database with enrollment counts and course details.
          </p>
          <Link
            to={ROUTES.courses}
            style={{
              display: 'inline-block',
              backgroundColor: COLORS.primary[500],
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: TYPOGRAPHY.weights.semibold,
              transition: 'background-color 0.2s',
            }}
          >
            View Courses →
          </Link>
        </div>

        {/* Users Demo */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: `2px solid ${COLORS.purple[500]}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '1rem',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: TYPOGRAPHY.sizes['2xl'],
                  fontWeight: TYPOGRAPHY.weights.bold,
                  color: COLORS.purple[500],
                  marginBottom: '0.5rem',
                }}
              >
                👥 Users Directory
              </h2>
              <p
                style={{
                  color: COLORS.gray[600],
                  fontSize: TYPOGRAPHY.sizes.sm,
                  marginBottom: '0.5rem',
                }}
              >
                <strong>Route:</strong>{' '}
                <code
                  style={{
                    backgroundColor: COLORS.gray[100],
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontFamily: 'monospace',
                    fontSize: TYPOGRAPHY.sizes.sm,
                  }}
                >
                  /users
                </code>
              </p>
              <p
                style={{
                  color: COLORS.gray[600],
                  fontSize: TYPOGRAPHY.sizes.sm,
                }}
              >
                <strong>API Endpoint:</strong>{' '}
                <code
                  style={{
                    backgroundColor: COLORS.gray[100],
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontFamily: 'monospace',
                    fontSize: TYPOGRAPHY.sizes.sm,
                  }}
                >
                  GET /users
                </code>
              </p>
            </div>
            <span
              style={{
                backgroundColor: COLORS.success[500],
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: TYPOGRAPHY.sizes.xs,
                fontWeight: TYPOGRAPHY.weights.semibold,
              }}
            >
              TANSTACK QUERY
            </span>
          </div>
          <p
            style={{
              color: COLORS.gray[700],
              marginBottom: '1.5rem',
              lineHeight: 1.6,
            }}
          >
            Fetches all users with role-based filtering and enrollment information.
          </p>
          <Link
            to={ROUTES.users}
            style={{
              display: 'inline-block',
              backgroundColor: COLORS.purple[500],
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: TYPOGRAPHY.weights.semibold,
              transition: 'background-color 0.2s',
            }}
          >
            View Users →
          </Link>
        </div>
      </div>

      {/* Technical Details */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          marginTop: '2rem',
        }}
      >
        <h3
          style={{
            fontSize: TYPOGRAPHY.sizes.xl,
            fontWeight: TYPOGRAPHY.weights.bold,
            color: COLORS.gray[900],
            marginBottom: '1rem',
          }}
        >
          ✅ Technical Implementation
        </h3>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            color: COLORS.gray[600],
          }}
        >
          <li
            style={{
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'flex-start',
            }}
          >
            <span
              style={{
                color: COLORS.success[500],
                marginRight: '0.5rem',
                fontWeight: TYPOGRAPHY.weights.bold,
              }}
            >
              ✓
            </span>
            <span>
              <strong>TanStack Query</strong> for all data fetching with automatic caching and background refetching
            </span>
          </li>
          <li
            style={{
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'flex-start',
            }}
          >
            <span
              style={{
                color: COLORS.success[500],
                marginRight: '0.5rem',
                fontWeight: TYPOGRAPHY.weights.bold,
              }}
            >
              ✓
            </span>
            <span>
              <strong>TanStack Router</strong> with file-based routing and type-safe navigation
            </span>
          </li>
          <li
            style={{
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'flex-start',
            }}
          >
            <span
              style={{
                color: COLORS.success[500],
                marginRight: '0.5rem',
                fontWeight: TYPOGRAPHY.weights.bold,
              }}
            >
              ✓
            </span>
            <span>
              <strong>Shared components</strong> (LoadingSpinner, ErrorMessage, PageLayout)
            </span>
          </li>
          <li
            style={{
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'flex-start',
            }}
          >
            <span
              style={{
                color: COLORS.success[500],
                marginRight: '0.5rem',
                fontWeight: TYPOGRAPHY.weights.bold,
              }}
            >
              ✓
            </span>
            <span>
              <strong>Design tokens</strong> (centralized COLORS and TYPOGRAPHY constants)
            </span>
          </li>
          <li
            style={{
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'flex-start',
            }}
          >
            <span
              style={{
                color: COLORS.success[500],
                marginRight: '0.5rem',
                fontWeight: TYPOGRAPHY.weights.bold,
              }}
            >
              ✓
            </span>
            <span>
              <strong>Type-safe routes</strong> using ROUTES constants
            </span>
          </li>
          <li
            style={{
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'flex-start',
            }}
          >
            <span
              style={{
                color: COLORS.success[500],
                marginRight: '0.5rem',
                fontWeight: TYPOGRAPHY.weights.bold,
              }}
            >
              ✓
            </span>
            <span>
              <strong>Environment variables</strong> for API URL configuration (VITE_BACKEND_URL)
            </span>
          </li>
          <li
            style={{
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'flex-start',
            }}
          >
            <span
              style={{
                color: COLORS.success[500],
                marginRight: '0.5rem',
                fontWeight: TYPOGRAPHY.weights.bold,
              }}
            >
              ✓
            </span>
            <span>
              <strong>Automatic retry logic</strong> with exponential backoff for backend spin-up
            </span>
          </li>
        </ul>
      </div>
    </PageLayout>
  );
}
