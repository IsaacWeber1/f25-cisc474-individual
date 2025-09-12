import Navigation from './_components/Navigation';
import CourseCard from './_components/CourseCard';
import { getCurrentUser, getCoursesByUser } from './_lib/mockData';

export default function Dashboard() {
  const currentUser = getCurrentUser();
  const userCourses = getCoursesByUser(currentUser.id);

  return (
    <>
      <Navigation />
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
