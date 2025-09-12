'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface FilterControlsProps {
  currentType: string;
  currentStatus: string;
  courseId: string;
  userRole: string;
}

export default function FilterControls({ currentType, currentStatus, courseId, userRole }: FilterControlsProps) {
  const pathname = usePathname();
  
  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'file', label: 'File Upload' },
    { value: 'text', label: 'Text Entry' },
    { value: 'reflection', label: 'Reflection' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'graded', label: 'Graded' }
  ];

  const buildFilterUrl = (newType?: string, newStatus?: string) => {
    const params = new URLSearchParams();
    
    const type = newType !== undefined ? newType : currentType;
    const status = newStatus !== undefined ? newStatus : currentStatus;
    
    if (type && type !== 'all') params.set('type', type);
    if (status && status !== 'all') params.set('status', status);
    
    const queryString = params.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
  };

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      padding: '1.5rem'
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2rem',
        alignItems: 'center'
      }}>
        {/* Type Filter */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Assignment Type
          </label>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            {typeOptions.map(option => (
              <Link
                key={option.value}
                href={buildFilterUrl(option.value)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  border: '1px solid',
                  backgroundColor: currentType === option.value ? '#2563eb' : 'white',
                  color: currentType === option.value ? 'white' : '#374151',
                  borderColor: currentType === option.value ? '#2563eb' : '#d1d5db',
                  transition: 'all 0.2s'
                }}
              >
                {option.label}
                {option.value === 'reflection' && ' ✨'}
              </Link>
            ))}
          </div>
        </div>

        {/* Status Filter - Only for students */}
        {userRole === 'student' && (
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Submission Status
            </label>
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}>
              {statusOptions.map(option => (
                <Link
                  key={option.value}
                  href={buildFilterUrl(undefined, option.value)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    border: '1px solid',
                    backgroundColor: currentStatus === option.value ? '#15803d' : 'white',
                    color: currentStatus === option.value ? 'white' : '#374151',
                    borderColor: currentStatus === option.value ? '#15803d' : '#d1d5db',
                    transition: 'all 0.2s'
                  }}
                >
                  {option.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Clear Filters */}
        {(currentType !== 'all' || currentStatus !== 'all') && (
          <div>
            <Link
              href={pathname}
              style={{
                color: '#6b7280',
                fontSize: '0.875rem',
                textDecoration: 'underline',
                fontWeight: 500
              }}
            >
              Clear all filters
            </Link>
          </div>
        )}
      </div>

      {/* Active filters summary */}
      {(currentType !== 'all' || currentStatus !== 'all') && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          backgroundColor: '#f8fafc',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          color: '#4b5563'
        }}>
          <strong>Active filters:</strong>
          {currentType !== 'all' && (
            <span style={{
              marginLeft: '0.5rem',
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              marginRight: '0.5rem'
            }}>
              Type: {currentType}
            </span>
          )}
          {currentStatus !== 'all' && userRole === 'student' && (
            <span style={{
              backgroundColor: '#dcfce7',
              color: '#15803d',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem'
            }}>
              Status: {currentStatus}
            </span>
          )}
        </div>
      )}
    </div>
  );
}