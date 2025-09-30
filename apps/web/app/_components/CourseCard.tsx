'use client';

import Link from 'next/link';
import { Course } from '../_lib/dataProvider';
import { useState } from 'react';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Link href={`/course/${course.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        boxShadow: isHovered ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '0.75rem'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#111827'
          }}>
            {course.code}
          </h3>
          <span style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            backgroundColor: '#f3f4f6',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem'
          }}>
            {course.semester}
          </span>
        </div>
        
        <h4 style={{
          fontSize: '1.125rem',
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          {course.title}
        </h4>
        
        <p style={{
          fontSize: '0.875rem',
          color: '#4b5563',
          marginBottom: '0.75rem'
        }}>
          Instructor: {course.instructor}
        </p>
        
        {course.description && (
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {course.description}
          </p>
        )}
        
        <div style={{
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid #f3f4f6'
        }}>
          <span style={{
            color: '#2563eb',
            fontSize: '0.875rem',
            fontWeight: 500
          }}>
            View Course →
          </span>
        </div>
      </div>
    </Link>
  );
}