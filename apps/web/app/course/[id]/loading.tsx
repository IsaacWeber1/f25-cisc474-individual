export default function Loading() {
  return (
    <div style={{
      padding: '2rem 0'
    }}>
      {/* Skeleton Header */}
      <div style={{
        marginBottom: '2rem'
      }}>
        <div style={{
          height: '2rem',
          backgroundColor: '#f3f4f6',
          borderRadius: '0.25rem',
          marginBottom: '0.5rem',
          width: '60%'
        }} />
        <div style={{
          height: '1rem',
          backgroundColor: '#f3f4f6',
          borderRadius: '0.25rem',
          width: '40%'
        }} />
      </div>
      
      {/* Skeleton Content Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            padding: '1.5rem'
          }}>
            <div style={{
              height: '1.5rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '0.25rem',
              marginBottom: '1rem',
              width: '70%'
            }} />
            <div style={{
              height: '1rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '0.25rem',
              marginBottom: '0.5rem',
              width: '100%'
            }} />
            <div style={{
              height: '1rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '0.25rem',
              width: '80%'
            }} />
          </div>
        ))}
      </div>
    </div>
  );
}