// Reusable loading skeleton components for Suspense fallbacks

export function CourseCardSkeleton() {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      border: '1px solid #e5e7eb',
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
    }}>
      <div style={{
        height: '1.5rem',
        backgroundColor: '#e5e7eb',
        borderRadius: '0.25rem',
        marginBottom: '0.75rem',
        width: '60%'
      }} />
      <div style={{
        height: '1rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.25rem',
        marginBottom: '0.5rem'
      }} />
      <div style={{
        height: '1rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.25rem',
        width: '80%'
      }} />
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <main style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1rem'
    }}>
      <div style={{
        height: '2rem',
        backgroundColor: '#e5e7eb',
        borderRadius: '0.25rem',
        marginBottom: '0.5rem',
        width: '40%',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }} />
      <div style={{
        height: '1rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.25rem',
        marginBottom: '2rem',
        width: '60%',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {[1, 2, 3].map((i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </main>
  );
}

export function ProfileSkeleton() {
  return (
    <main style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1rem'
    }}>
      <div style={{
        height: '2rem',
        backgroundColor: '#e5e7eb',
        borderRadius: '0.25rem',
        marginBottom: '2rem',
        width: '30%',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {[1, 2].map((i) => (
          <div
            key={i}
            style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              border: '1px solid #e5e7eb'
            }}
          >
            <div style={{
              height: '1.25rem',
              backgroundColor: '#e5e7eb',
              borderRadius: '0.25rem',
              marginBottom: '1rem',
              width: '50%',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }} />
            {[1, 2, 3].map((j) => (
              <div
                key={j}
                style={{
                  height: '0.875rem',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '0.25rem',
                  marginBottom: '0.5rem',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </main>
  );
}

export function CoursePageSkeleton() {
  return (
    <div>
      <div style={{
        height: '2rem',
        backgroundColor: '#e5e7eb',
        borderRadius: '0.25rem',
        marginBottom: '1rem',
        width: '40%',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              backgroundColor: '#f3f4f6',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              textAlign: 'center',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}
          >
            <div style={{
              height: '2rem',
              backgroundColor: '#e5e7eb',
              borderRadius: '0.25rem',
              marginBottom: '0.5rem'
            }} />
            <div style={{
              height: '0.875rem',
              backgroundColor: '#d1d5db',
              borderRadius: '0.25rem'
            }} />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export function AssignmentsSkeleton() {
  return (
    <div>
      <div style={{
        height: '1.5rem',
        backgroundColor: '#e5e7eb',
        borderRadius: '0.25rem',
        marginBottom: '1.5rem',
        width: '30%',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }} />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '1.5rem'
            }}
          >
            <div style={{
              height: '1.25rem',
              backgroundColor: '#e5e7eb',
              borderRadius: '0.25rem',
              marginBottom: '0.75rem',
              width: '60%',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }} />
            <div style={{
              height: '0.875rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '0.25rem',
              marginBottom: '0.5rem',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }} />
            <div style={{
              height: '0.875rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '0.25rem',
              width: '40%',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }} />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export function GenericLoadingSkeleton() {
  return (
    <div style={{
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{
        display: 'inline-block',
        width: '3rem',
        height: '3rem',
        border: '4px solid #e5e7eb',
        borderTopColor: '#2563eb',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{
        marginTop: '1rem',
        color: '#6b7280',
        fontSize: '1rem'
      }}>
        Loading...
      </p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
