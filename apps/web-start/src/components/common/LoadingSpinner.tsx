import { COLORS, TYPOGRAPHY } from '../../config/constants';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ message = 'Loading...', fullScreen = true }: LoadingSpinnerProps) {
  return (
    <div style={{
      minHeight: fullScreen ? '100vh' : 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.gray[50],
      padding: fullScreen ? 0 : '2rem',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          width: '3rem',
          height: '3rem',
          border: `4px solid ${COLORS.gray[200]}`,
          borderTopColor: COLORS.primary[500],
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        {message && (
          <p style={{
            marginTop: '1rem',
            color: COLORS.gray[600],
            fontSize: TYPOGRAPHY.sizes.lg,
          }}>
            {message}
          </p>
        )}
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
