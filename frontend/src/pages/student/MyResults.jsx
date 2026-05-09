import { useEffect, useState } from 'react'
import api from '../../api/api'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts'

export default function MyResults() {
  const [semesters, setSemesters] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/semesters/').then(r => {
      setSemesters(r.data.results || r.data)
      setLoading(false)
    })
  }, [])

  const sorted = [...semesters].sort((a,b) => a.sem_no - b.sem_no)
  const chartData = sorted.map(s => ({ name: `Sem ${s.sem_no}`, GPA: s.gpa }))
  const cgpa = semesters.length ? (semesters.reduce((a,b) => a + b.gpa, 0) / semesters.length).toFixed(2) : null
  const gpaColor = (g) => g >= 8 ? '#22c55e' : g >= 6 ? '#f59e0b' : '#ef4444'
  const grade = (g) => g >= 9 ? 'O' : g >= 8 ? 'A+' : g >= 7 ? 'A' : g >= 6 ? 'B+' : g >= 5 ? 'B' : 'F'

  if (loading) return <div className="loading">Loading results...</div>

  return (
    <div>
      <div className="page-header">
        <h1>My Semester Results</h1>
        <p>Your academic performance across all semesters</p>
      </div>

      {semesters.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📊</div>
          <div style={{ color: 'var(--text-secondary)' }}>No semester results available yet</div>
        </div>
      ) : (
        <>
          {/* CGPA Summary */}
          {cgpa && (
            <div className="card" style={{ maxWidth: 340, marginBottom: 24, textAlign: 'center', padding: '28px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Overall CGPA</div>
              <div style={{ fontSize: '3.5rem', fontWeight: 900, color: gpaColor(cgpa), lineHeight: 1 }}>{cgpa}</div>
              <div style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Grade: <strong style={{ color: gpaColor(cgpa) }}>{grade(cgpa)}</strong>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Sem cards */}
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[1,2,3,4].map(n => {
                  const sem = sorted.find(s => s.sem_no === n)
                  return (
                    <div key={n} className="card" style={{ textAlign: 'center', padding: '20px 16px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 6 }}>SEMESTER {n}</div>
                      {sem ? (
                        <>
                          <div style={{ fontSize: '2rem', fontWeight: 800, color: gpaColor(sem.gpa) }}>{sem.gpa}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>Grade: {grade(sem.gpa)}</div>
                        </>
                      ) : (
                        <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>—</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Chart */}
            <div className="card">
              <div className="card-title">GPA Trend</div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: '#8b8fa8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0,10]} tick={{ fill: '#8b8fa8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#1a1d2e', border: '1px solid #222540', borderRadius: 8, color: '#f0f0ff' }} />
                  <ReferenceLine y={6} stroke="rgba(239,68,68,0.3)" strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="GPA" stroke="#6C63FF" strokeWidth={3} dot={{ fill: '#00D4FF', r: 6 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
