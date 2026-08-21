import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/api'

export default function MyLeaves() {
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/leaves/').then(r => {
      setLeaves(r.data.results || r.data)
      setLoading(false)
    })
  }, [])

  const statusIcon = { pending: '⏳', approved: '✅', rejected: '❌' }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1>My Leaves</h1>
          <p>Track all your leave applications</p>
        </div>
        <Link to="/student/leaves/apply" className="btn btn-primary">✍️ Apply Leave</Link>
      </div>

      {loading ? <div className="loading">Loading...</div> : (
        leaves.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: 16 }}>No leave requests yet</div>
            <Link to="/student/leaves/apply" className="btn btn-primary">Apply for Leave</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {leaves.map(l => (
              <div key={l.id} className="card" style={{ padding: '18px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: '1.2rem' }}>{statusIcon[l.status]}</span>
                      <span className={`badge badge-${l.status}`}>{l.status}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        Applied: {new Date(l.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-primary)', marginBottom: 6 }}>{l.reason}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      📅 {l.from_date} → {l.to_date}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {l.approved_by && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {l.status === 'approved' ? 'Approved' : 'Rejected'} by Faculty #{l.approved_by}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
