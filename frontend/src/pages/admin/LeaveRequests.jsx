import { useEffect, useState } from 'react'
import api from '../../api/api'

export default function LeaveRequests() {
  const [leaves, setLeaves] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  const fetchLeaves = () => {
    api.get('/leaves/').then(r => {
      setLeaves(r.data.results || r.data)
      setLoading(false)
    })
  }
  useEffect(() => { fetchLeaves() }, [])

  const displayed = filter === 'all' ? leaves : leaves.filter(l => l.status === filter)

  return (
    <div>
      <div className="page-header">
        <h1>Leave Requests</h1>
        <p>All student leave applications across departments</p>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          {['all','pending','approved','rejected'].map(f => (
            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>{f}</button>
          ))}
        </div>
        {loading ? <div className="loading">Loading...</div> : (
          <table>
            <thead>
              <tr>
                <th>Student</th><th>Reason</th><th>From</th><th>To</th>
                <th>Applied On</th><th>Status</th><th>Approved By</th>
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 && <tr><td colSpan={7} className="empty">No leave requests found</td></tr>}
              {displayed.map(l => (
                <tr key={l.id}>
                  <td><strong>{l.student_name}</strong> <br/><small style={{color:'var(--text-secondary)'}}>{l.student_username}</small></td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.reason}</td>
                  <td>{l.from_date}</td>
                  <td>{l.to_date}</td>
                  <td>{new Date(l.created_at).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge badge-${l.status}`}>{l.status}</span>
                  </td>
                  <td>{l.approved_by || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
