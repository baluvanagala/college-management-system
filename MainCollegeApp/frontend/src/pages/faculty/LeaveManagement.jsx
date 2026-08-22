import { useEffect, useState } from 'react'
import api from '../../api/api'

export default function LeaveManagement() {
  const [leaves, setLeaves] = useState([])
  const [filter, setFilter] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  const fetchLeaves = (showLoading = true) => {
    if (showLoading) {
      setLoading(true)
      setError('')
    }
    api.get('/leaves/')
      .then(r => {
        setLeaves(r.data.results || r.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load leave requests. Please ensure your faculty profile is set up.')
        setLoading(false)
      })
  }
  useEffect(() => {
    setTimeout(() => fetchLeaves(false), 0)
  }, [])

  const handleAction = async (id, action) => {
    setMsg('')
    setError('')
    try {
      await api.post(`/leaves/${id}/${action}/`)
      setMsg(`Leave ${action}d successfully`)
      fetchLeaves()
    } catch {
      setError(`Error trying to ${action} leave.`)
    }
  }

  const displayed = filter === 'all' ? leaves : leaves.filter(l => l.status === filter)

  return (
    <div>
      <div className="page-header">
        <h1>Leave Management</h1>
        <p>Approve or reject leave requests from your department students</p>
      </div>

      {msg && <div className="form-success" style={{ marginBottom: 16 }}>{msg}</div>}
      {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="table-wrapper">
        <div className="table-toolbar">
          {['pending','approved','rejected','all'].map(f => (
            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>{f}</button>
          ))}
        </div>

        {loading ? <div className="loading">Loading...</div> : (
          <table>
            <thead>
              <tr>
                <th>Student</th><th>Reason</th><th>From</th><th>To</th>
                <th>Applied</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 && <tr><td colSpan={7} className="empty">No {filter} leave requests</td></tr>}
              {displayed.map(l => (
                <tr key={l.id}>
                  <td><strong>{l.student_name}</strong> <br/><small style={{color:'var(--text-secondary)'}}>{l.student_username}</small></td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.reason}</td>
                  <td>{l.from_date}</td>
                  <td>{l.to_date}</td>
                  <td>{new Date(l.created_at).toLocaleDateString()}</td>
                  <td><span className={`badge badge-${l.status}`}>{l.status}</span></td>
                  <td>
                    {l.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button id={`approve-${l.id}`} className="btn btn-success btn-sm" onClick={() => handleAction(l.id, 'approve')}>✅ Approve</button>
                        <button id={`reject-${l.id}`} className="btn btn-danger btn-sm" onClick={() => handleAction(l.id, 'reject')}>❌ Reject</button>
                      </div>
                    )}
                    {l.status !== 'pending' && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Processed</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
