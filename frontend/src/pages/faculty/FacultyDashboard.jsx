import { useEffect, useState } from 'react'
import api from '../../api/api'
import StatCard from '../../components/StatCard'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const YEAR_LABELS = { 1: '1st Year', 2: '2nd Year', 3: '3rd Year', 4: '4th Year' }
const COLORS = ['#ff00a0', '#ff8c00', '#10b981', '#f59e0b']

export default function FacultyDashboard() {
  const [stats, setStats] = useState(null)
  const [students, setStudents] = useState([])
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionMsg, setActionMsg] = useState('')

  const fetchData = () => {
    Promise.all([
      api.get('/dashboard/'),
      api.get('/students/'),
      api.get('/leaves/')
    ]).then(([statsRes, studentsRes, leavesRes]) => {
      setStats(statsRes.data)
      setStudents(studentsRes.data.results || studentsRes.data)
      setLeaves((leavesRes.data.results || leavesRes.data).filter(l => l.status === 'pending'))
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const handleLeaveAction = async (id, action) => {
    try {
      await api.post(`/leaves/${id}/${action}/`)
      setActionMsg(`Leave ${action}d successfully`)
      fetchData()
      setTimeout(() => setActionMsg(''), 3000)
    } catch {
      setActionMsg('Error processing leave action')
    }
  }

  if (loading) return <div className="loading" style={{color: '#666'}}>Loading dashboard...</div>
  if (!stats) return <div className="loading" style={{color: '#666'}}>Error loading stats</div>

  const yearData = (stats.year_wise || []).map(d => ({
    name: YEAR_LABELS[d.year] || `Year ${d.year}`,
    count: d.count
  }))
  const leaveData = (stats.leave_stats || []).map(d => ({ name: d.status, value: d.count }))

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {stats.profile_pic ? (
          <img src={stats.profile_pic} alt="" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent)' }} />
        ) : (
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: 'white', border: '3px solid var(--accent)' }}>
            {stats.name?.[0] || 'F'}
          </div>
        )}
        <div>
          <h1 style={{color: 'var(--text-primary)'}}>Faculty Dashboard</h1>
          <p style={{color: 'var(--text-secondary)'}}>Overview of your department: {students[0]?.department_name || 'My Department'}</p>
        </div>
      </div>

      {actionMsg && <div className={actionMsg.includes('Error') ? 'form-error' : 'form-success'} style={{ marginBottom: 16 }}>{actionMsg}</div>}

      <div className="stats-grid">
        <StatCard label="Dept Students" value={stats.total_students} icon="🎓" color="#ff00a0" />
        <StatCard label="Pending Leaves" value={stats.pending_leaves} icon="📝" color="#f59e0b" />
      </div>

      <div className="charts-row">
        <div className="card glass-card">
          <div className="card-title">Students by Year</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={yearData} barSize={36}>
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ background: '#fff', border: '1px solid #ddd', borderRadius: 8, color: '#333' }} />
              <Bar dataKey="count" fill="url(#fbarGrad)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="fbarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff00a0" /><stop offset="100%" stopColor="#ff8c00" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card glass-card">
          <div className="card-title">Leave Status Overview</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={leaveData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={{fontSize: 10, fill: '#666'}}>
                {leaveData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: '#64748b' }} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ddd', borderRadius: 8, color: '#333' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>


      <div className="charts-row" style={{ marginTop: '24px' }}>
        <div className="card" style={{ flex: 2 }}>
          <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Student Leave Requests</span>
            <a href="/faculty/leaves" style={{ fontSize: '0.8rem', color: 'var(--accent)', textDecoration: 'none' }}>View All →</a>
          </div>
          <div className="table-wrapper" style={{ border: 'none', padding: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Student</th><th>Reason</th><th>From</th><th>To</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {leaves.slice(0, 5).map(l => (
                  <tr key={l.id}>
                    <td>
                      <strong>{l.student_name}</strong>
                      <br/>
                      <small style={{color:'var(--text-secondary)'}}>{l.student_username || 'N/A'}</small>
                    </td>
                    <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                      {l.reason}
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>{l.from_date}</td>
                    <td style={{ fontSize: '0.8rem' }}>{l.to_date}</td>
                    <td>
                      <span className={`badge badge-${l.status}`} style={{ fontSize: '0.7rem' }}>
                        {l.status}
                      </span>
                    </td>
                    <td>
                      {l.status === 'pending' && (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn btn-success btn-sm" style={{ padding: '4px 10px', fontSize: '1rem' }} onClick={() => handleLeaveAction(l.id, 'approve')} title="Approve">✔</button>
                          <button className="btn btn-danger btn-sm" style={{ padding: '4px 10px', fontSize: '1rem' }} onClick={() => handleLeaveAction(l.id, 'reject')} title="Reject">✘</button>
                        </div>
                      )}
                      {l.status !== 'pending' && (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 500 }}>
                          {l.status === 'approved' ? '✅' : '❌'} {l.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {leaves.length === 0 && <tr><td colSpan="6" className="empty" style={{ padding: '30px' }}>No pending leave requests found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card" style={{ flex: 1 }}>
          <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Top Students</span>
            <a href="/faculty/students" style={{ fontSize: '0.8rem', color: 'var(--accent)', textDecoration: 'none' }}>All →</a>
          </div>
          <div className="table-wrapper" style={{ border: 'none', padding: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>CGPA</th>
                </tr>
              </thead>
              <tbody>
                {students.sort((a,b) => (b.cgpa||0) - (a.cgpa||0)).slice(0, 5).map(s => (
                  <tr key={s.id}>
                    <td><div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{s.name}</div></td>
                    <td style={{ fontWeight: 700, color: s.cgpa >= 8 ? '#22c55e' : '#f59e0b', fontSize: '0.85rem' }}>{s.cgpa ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
