import { useEffect, useState } from 'react'
import api from '../../api/api'
import StatCard from '../../components/StatCard'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function StudentDashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/dashboard/').then(r => setStats(r.data))
  }, [])

  if (!stats) return <div className="loading" style={{color: '#666'}}>Loading dashboard...</div>
  if (stats.error) return <div className="card glass-card" style={{margin: '20px', textAlign: 'center', padding: '40px'}}><p className="form-error">{stats.error}. Please contact admin.</p></div>

  const chartData = (stats.semester_results || []).map(s => ({ name: `Sem ${s.sem_no}`, GPA: s.gpa }))

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {stats.profile_pic ? (
          <img src={stats.profile_pic} alt="" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent)' }} />
        ) : (
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: 'white', border: '3px solid var(--accent)' }}>
            {stats.name?.[0]}
          </div>
        )}
        <div>
          <h1 style={{color: 'var(--text-primary)'}}>Welcome, {stats.name || 'Student'}</h1>
          <p style={{color: 'var(--text-secondary)'}}>{stats.roll_no ? `${stats.roll_no} | ${stats.department_name}` : 'Your academic overview'}</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Semesters Completed" value={stats.total_semesters} icon="📚" color="#ff00a0" />
        <StatCard label="Fee Status" value={stats.fee_status || 'Pending'} icon="💰" color="#10b981" />
        <StatCard label="Pending Leaves" value={stats.pending_leaves} icon="📝" color="#f59e0b" />
      </div>

      {chartData.length > 0 && (
        <div className="card glass-card" style={{ maxWidth: 520 }}>
          <div className="card-title">My GPA Progress</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="rgba(0,0,0,0.05)" strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0,10]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ddd', borderRadius: 8, color: '#333' }} />
              <Line type="monotone" dataKey="GPA" stroke="#ff00a0" strokeWidth={3} dot={{ fill: '#ff8c00', r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

    </div>
  )
}
