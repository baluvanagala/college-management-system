export default function StatCard({ label, value, icon, color }) {
  return (
    <div className="stat-card glass-card" style={{ '--card-accent': color || 'var(--accent)' }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <div className="stat-value">{value ?? '—'}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  )
}
