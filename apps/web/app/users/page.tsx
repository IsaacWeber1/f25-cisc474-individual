'use client';

import { Suspense } from 'react';
import UsersList from './UsersList';
import Navigation from '../_components/Navigation';

// Loading component for Suspense fallback
function UsersLoading() {
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
        fontSize: '1.125rem'
      }}>
        Loading users from backend API...
      </p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function UsersPage() {
  return (
    <>
      <Navigation currentUser={null} />
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
            User Directory
          </h1>
          <p style={{ color: '#4b5563' }}>
            All users in the system, loaded from the backend API using client-side fetch.
          </p>
          <div style={{
            marginTop: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#dbeafe',
            border: '1px solid #93c5fd',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            color: '#1e40af'
          }}>
            🔄 This page uses <strong>client-side data fetching</strong> with <strong>React Suspense</strong>
          </div>
        </div>

        <Suspense fallback={<UsersLoading />}>
          <UsersList />
        </Suspense>
      </main>
    </>
  );
}
