import Navigation from './_components/Navigation';
import CourseCard from './_components/CourseCard';
import { getCurrentUser, getCoursesByUser, getDataSourceInfo } from './_lib/dataProvider';
import { redirect } from 'next/navigation';
import { getSessionUserId } from './_lib/sessionServer';

// Dynamic rendering for API calls
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  // Check if user is logged in
  const sessionUserId = await getSessionUserId();
  if (!sessionUserId) {
    redirect('/login');
  }

  // Check if API is configured for production
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (process.env.NODE_ENV === 'production' && (!apiUrl || apiUrl === 'http://localhost:3000')) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          maxWidth: '600px'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#dc2626' }}>
            ⚠️ API Configuration Required
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '1rem', lineHeight: 1.6 }}>
            This application requires a backend API to function. Please configure the
            <code style={{
              backgroundColor: '#f3f4f6',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              margin: '0 0.25rem',
              fontFamily: 'monospace'
            }}>
              NEXT_PUBLIC_API_URL
            </code>
            environment variable in your Vercel project settings.
          </p>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Current: <code style={{ fontFamily: 'monospace' }}>{apiUrl || 'not set'}</code>
          </p>
        </div>
      </div>
    );
  }

  // Parallelize independent API calls
  const [currentUser, dataSource] = await Promise.all([
    getCurrentUser(),
    Promise.resolve(getDataSourceInfo())
  ]);

  const userCourses = await getCoursesByUser(currentUser.id);

  return (
    <>
      <Navigation currentUser={currentUser} />
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            Welcome back, {currentUser.name}!
          </h1>
          <p style={{ color: '#4b5563' }}>
            Here are your courses for this semester.
          </p>
          <div style={{
            marginTop: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: dataSource.source.includes('Supabase') ? '#dcfce7' : '#fef3c7',
            border: `1px solid ${dataSource.source.includes('Supabase') ? '#86efac' : '#fcd34d'}`,
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            color: dataSource.source.includes('Supabase') ? '#15803d' : '#92400e'
          }}>
            📊 Data Source: {dataSource.source}
          </div>
        </div>

        {userCourses.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {userCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '3rem 0'
          }}>
            <div style={{
              backgroundColor: '#f3f4f6',
              borderRadius: '50%',
              width: '6rem',
              height: '6rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <span style={{
                fontSize: '2.25rem',
                color: '#9ca3af'
              }}>📚</span>
            </div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 500,
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              No courses found
            </h3>
            <p style={{ color: '#6b7280' }}>
              You are not enrolled in any courses yet.
            </p>
          </div>
        )}

        <div style={{
          marginTop: '3rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          <div style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '0.5rem',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#1e3a8a',
              marginBottom: '0.5rem'
            }}>
              Quick Actions
            </h3>
            <div>
              <a href="/profile" style={{
                display: 'block',
                color: '#1d4ed8',
                textDecoration: 'none'
              }}>
                Update Profile →
              </a>
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '0.5rem',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#14532d',
              marginBottom: '0.5rem'
            }}>
              Recent Activity
            </h3>
            <p style={{
              color: '#15803d',
              fontSize: '0.875rem'
            }}>
              No recent activity to display.
            </p>
          </div>
          
          <div style={{
            backgroundColor: '#fff7ed',
            border: '1px solid #fed7aa',
            borderRadius: '0.5rem',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#9a3412',
              marginBottom: '0.5rem'
            }}>
              Upcoming Deadlines
            </h3>
            <p style={{
              color: '#c2410c',
              fontSize: '0.875rem'
            }}>
              No upcoming deadlines.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
