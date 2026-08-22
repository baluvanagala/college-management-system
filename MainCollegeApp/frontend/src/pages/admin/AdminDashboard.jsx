import { useEffect, useState } from 'react'
import api from '../../api/api'
import StatCard from '../../components/StatCard'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

const COLORS = ['#ff00a0', '#ff8c00', '#10b981', '#f59e0b', '#ef4444']
const YEAR_LABELS = { 1: '1st Year', 2: '2nd Year', 3: '3rd Year', 4: '4th Year' }

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/dashboard/').then(r => setStats(r.data))
  }, [])

  if (!stats) return <div className="loading" style={{color: '#666'}}>Loading dashboard...</div>

  const yearData = (stats.year_wise || []).map(d => ({
    name: YEAR_LABELS[d.year] || `Year ${d.year}`,
    count: d.count
  }))
  const deptData = (stats.department_wise || []).map(d => ({
    name: d.department__name || 'Unknown',
    count: d.count
  }))
  const feeData = (stats.fee_stats || []).map(d => ({ name: d.status, value: d.count }))

  return (
    <div>
      <div className="page-header" >
        <h1 style={{color: 'var(--text-primary)'}}>Admin Dashboard</h1>
        <p style={{color:'gray'}}>Overview of the entire college system</p>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Students" value={stats.total_students} icon="🎓" color="#ff00a0" />
        <StatCard label="Total Faculty" value={stats.total_faculty} icon="👨‍🏫" color="#ff8c00" />
        <StatCard label="Departments" value={stats.total_departments} icon="🏢" color="#10b981" />
        <StatCard label="Total Fees Collected" value={`$${Number(stats.total_fees_collected || 0).toLocaleString()}`} icon="💰" color="#f59e0b" />
      </div>

      <div className="charts-row">
        <div className="card glass-card">
          <div className="card-title">Students by Year</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={yearData} barSize={36}>
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ background: '#fff', border: '1px solid #ddd', borderRadius: 8, color: '#333' }} />
              <Bar dataKey="count" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff00a0" />
                  <stop offset="100%" stopColor="#ff8c00" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card glass-card">
          <div className="card-title">Students by Department</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deptData} barSize={28}>
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ background: '#fff', border: '1px solid #ddd', borderRadius: 8, color: '#333' }} />
              <Bar dataKey="count" fill="#ff8c00" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card glass-card">
          <div className="card-title">Fee Status Distribution</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={feeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={{fontSize: 10, fill: '#666'}}>
                {feeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: '#64748b' }} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ddd', borderRadius: 8, color: '#333' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

