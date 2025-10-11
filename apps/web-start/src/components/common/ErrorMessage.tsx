import { COLORS, TYPOGRAPHY } from '../../config/constants';

interface ErrorMessageProps {
  error: Error | unknown;
  title?: string;
  onRetry?: () => void;
}

export function ErrorMessage({
  error,
  title = 'Error Loading Data',
  onRetry,
}: ErrorMessageProps) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.gray[50],
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        maxWidth: '600px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: TYPOGRAPHY.sizes['4xl'],
          marginBottom: '1rem',
          color: COLORS.error[500],
        }}>
          {title}
        </h1>
        <p style={{
          color: COLORS.gray[600],
          marginBottom: '2rem',
        }}>
          {errorMessage}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              backgroundColor: COLORS.primary[500],
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: TYPOGRAPHY.sizes.base,
              fontWeight: TYPOGRAPHY.weights.medium,
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
