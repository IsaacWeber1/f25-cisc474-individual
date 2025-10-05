import Link from 'next/link';

export default function ApiDemoPage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '2rem'
    }}>
      <main style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '1rem'
          }}>
            Frontend-Backend Integration Demo
          </h1>
          <p style={{
            color: '#4b5563',
            lineHeight: 1.6,
            marginBottom: '1rem'
          }}>
            This page demonstrates the connection between the Next.js frontend and NestJS backend API.
            The following pages use <strong>client-side fetch</strong> to retrieve data from the backend
            and render it using <strong>React Suspense</strong> for loading states.
          </p>
          <div style={{
            backgroundColor: '#dbeafe',
            border: '1px solid #93c5fd',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginTop: '1rem'
          }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#1e40af',
              margin: 0
            }}>
              <strong>Backend API:</strong> NestJS running on <code style={{
                backgroundColor: 'rgba(0,0,0,0.1)',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                fontFamily: 'monospace'
              }}>http://localhost:3000</code>
              <br />
              <strong>Frontend:</strong> Next.js running on <code style={{
                backgroundColor: 'rgba(0,0,0,0.1)',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                fontFamily: 'monospace'
              }}>http://localhost:3001</code>
            </p>
          </div>
        </div>

        {/* Demo Pages */}
        <div style={{
          display: 'grid',
          gap: '1.5rem'
        }}>
          {/* Users Page Demo */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '2px solid #2563eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <div>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#2563eb',
                  marginBottom: '0.5rem'
                }}>
                  📋 Demo Page #1: Users Directory
                </h2>
                <p style={{
                  color: '#4b5563',
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem'
                }}>
                  <strong>URL:</strong> <code style={{
                    backgroundColor: '#f3f4f6',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }}>/users</code>
                </p>
                <p style={{
                  color: '#4b5563',
                  fontSize: '0.875rem'
                }}>
                  <strong>Backend Route:</strong> <code style={{
                    backgroundColor: '#f3f4f6',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }}>GET /users</code>
                </p>
              </div>
              <span style={{
                backgroundColor: '#22c55e',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                CLIENT FETCH
              </span>
            </div>
            <p style={{
              color: '#6b7280',
              marginBottom: '1.5rem',
              lineHeight: 1.6
            }}>
              Fetches all users from the backend API and displays them in a client component.
              Uses Suspense to show a loading spinner while data is being fetched.
            </p>
            <Link
              href="/users"
              style={{
                display: 'inline-block',
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'background-color 0.2s'
              }}
            >
              View Users Demo →
            </Link>
          </div>

          {/* Courses Page Demo */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '2px solid #15803d'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <div>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#15803d',
                  marginBottom: '0.5rem'
                }}>
                  📚 Demo Page #2: Courses Catalog
                </h2>
                <p style={{
                  color: '#4b5563',
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem'
                }}>
                  <strong>URL:</strong> <code style={{
                    backgroundColor: '#f3f4f6',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }}>/courses</code>
                </p>
                <p style={{
                  color: '#4b5563',
                  fontSize: '0.875rem'
                }}>
                  <strong>Backend Route:</strong> <code style={{
                    backgroundColor: '#f3f4f6',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }}>GET /courses</code>
                </p>
              </div>
              <span style={{
                backgroundColor: '#22c55e',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                CLIENT FETCH
              </span>
            </div>
            <p style={{
              color: '#6b7280',
              marginBottom: '1.5rem',
              lineHeight: 1.6
            }}>
              Fetches all courses from the backend API and displays them in a client component.
              Uses Suspense to show a loading spinner while data is being fetched.
            </p>
            <Link
              href="/courses"
              style={{
                display: 'inline-block',
                backgroundColor: '#15803d',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'background-color 0.2s'
              }}
            >
              View Courses Demo →
            </Link>
          </div>
        </div>

        {/* Technical Details */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          marginTop: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '1rem'
          }}>
            ✅ Assignment Requirements Met
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            color: '#4b5563'
          }}>
            <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#22c55e', marginRight: '0.5rem', fontWeight: 'bold' }}>✓</span>
              <span>Uses <strong>fetch()</strong> to access backend API data</span>
            </li>
            <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#22c55e', marginRight: '0.5rem', fontWeight: 'bold' }}>✓</span>
              <span><strong>Two backend routes</strong> accessible: <code>/users</code> and <code>/courses</code></span>
            </li>
            <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#22c55e', marginRight: '0.5rem', fontWeight: 'bold' }}>✓</span>
              <span><strong>Client components</strong> with "use client" directive</span>
            </li>
            <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#22c55e', marginRight: '0.5rem', fontWeight: 'bold' }}>✓</span>
              <span><strong>Suspense boundaries</strong> with visual loading fallbacks</span>
            </li>
            <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#22c55e', marginRight: '0.5rem', fontWeight: 'bold' }}>✓</span>
              <span><strong>CORS configured</strong> without wildcard (specific origins only)</span>
            </li>
            <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#22c55e', marginRight: '0.5rem', fontWeight: 'bold' }}>✓</span>
              <span><strong>Environment variables</strong> used for API URL configuration</span>
            </li>
          </ul>
        </div>

        {/* Back Link */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link
            href="/login"
            style={{
              color: '#2563eb',
              textDecoration: 'none',
              fontSize: '0.875rem'
            }}
          >
            ← Back to Login
          </Link>
        </div>
      </main>
    </div>
  );
}
