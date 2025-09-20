import Link from 'next/link';
import Navigation from '../../_components/Navigation';
import { getCourseById, getCurrentUser, getUserRole } from '../../_lib/mockData';

interface CourseLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function CourseLayout({ children, params }: CourseLayoutProps) {
  const resolvedParams = await params;
  const course = getCourseById(parseInt(resolvedParams.id));
  const currentUser = getCurrentUser();
  const userRole = getUserRole(currentUser.id, parseInt(resolvedParams.id));

  if (!course) {
    return (
      <>
        <Navigation />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Course not found</h1>
          <p>The course you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </>
    );
  }

  const isActive = (path: string) => {
    // This would use usePathname in a real app, but for SSR we'll make it simple
    return false; // Will be enhanced in client components
  };

  return (
    <>
      <Navigation />
      
      {/* Course Header */}
      <div style={{
        backgroundColor: '#1e40af',
        color: 'white',
        padding: '1.5rem 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          {/* Breadcrumb */}
          <div style={{ 
            marginBottom: '1rem',
            fontSize: '0.875rem',
            opacity: 0.9
          }}>
            <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>
              Dashboard
            </Link>
            <span style={{ margin: '0 0.5rem' }}>›</span>
            <span>{course.code}</span>
          </div>
          
          {/* Course Info */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end'
          }}>
            <div>
              <h1 style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                marginBottom: '0.25rem'
              }}>
                {course.code}: {course.title}
              </h1>
              <p style={{ opacity: 0.9 }}>
                {course.instructor} • {course.semester}
              </p>
            </div>
            
            <div style={{
              fontSize: '0.875rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '0.25rem 0.75rem',
              borderRadius: '1rem',
              textTransform: 'capitalize'
            }}>
              {userRole}
            </div>
          </div>
        </div>
      </div>

      {/* Course Navigation Tabs */}
      <div style={{
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <nav style={{
            display: 'flex',
            gap: '2rem'
          }}>
            <Link 
              href={`/course/${resolvedParams.id}`}
              style={{
                padding: '1rem 0',
                color: '#374151',
                textDecoration: 'none',
                borderBottom: '2px solid transparent',
                fontWeight: 500
              }}
            >
              Overview
            </Link>
            
            <Link 
              href={`/course/${resolvedParams.id}/assignments`}
              style={{
                padding: '1rem 0',
                color: '#374151',
                textDecoration: 'none',
                borderBottom: '2px solid transparent',
                fontWeight: 500
              }}
            >
              Assignments
            </Link>
            
            <Link 
              href={`/course/${resolvedParams.id}/grades`}
              style={{
                padding: '1rem 0',
                color: '#374151',
                textDecoration: 'none',
                borderBottom: '2px solid transparent',
                fontWeight: 500
              }}
            >
              Grades
            </Link>
            
            <Link 
              href={`/course/${resolvedParams.id}/reflections`}
              style={{
                padding: '1rem 0',
                color: '#374151',
                textDecoration: 'none',
                borderBottom: '2px solid transparent',
                fontWeight: 500
              }}
            >
              Reflections
            </Link>

            {/* Role-based navigation - only show submission review for TAs and Professors */}
            {(userRole === 'ta' || userRole === 'professor') && (
              <Link 
                href={`/course/${resolvedParams.id}/submissions`}
                style={{
                  padding: '1rem 0',
                  color: '#374151',
                  textDecoration: 'none',
                  borderBottom: '2px solid transparent',
                  fontWeight: 500
                }}
              >
                Submissions
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        {children}
      </div>
    </>
  );
}