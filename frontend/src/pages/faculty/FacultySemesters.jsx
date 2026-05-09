import { useEffect, useState } from 'react'
import api from '../../api/api'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function FacultySemesters() {
  const [students, setStudents] = useState([])
  const [selected, setSelected] = useState('')
  const [semesters, setSemesters] = useState([])

  useEffect(() => {
    api.get('/students/').then(r => setStudents(r.data.results || r.data))
  }, [])

  const loadSemesters = (id) => {
    setSelected(id)
    if (id) {
      api.get(`/semesters/?student=${id}`).then(r => setSemesters(r.data.results || r.data))
    } else {
      setSemesters([])
    }
  }

  const chartData = [...semesters].sort((a,b) => a.sem_no - b.sem_no).map(s => ({ name: `Sem ${s.sem_no}`, GPA: s.gpa }))
  const gpaColor = (g) => g >= 8 ? '#22c55e' : g >= 6 ? '#f59e0b' : '#ef4444'

  return (
    <div>
      <div className="page-header">
        <h1>Semester Results</h1>
        <p>View semester GPA records of department students</p>
      </div>

      <div className="form-group" style={{ maxWidth: 360, marginBottom: 24 }}>
        <label className="form-label">Select Student</label>
        <select id="fs-student" className="form-select" value={selected} onChange={e => loadSemesters(e.target.value)}>
          <option value="">Choose a student...</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.roll_no})</option>)}
        </select>
      </div>

      {semesters.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Semester</th><th>GPA</th></tr></thead>
              <tbody>
                {[...semesters].sort((a,b) => a.sem_no - b.sem_no).map(s => (
                  <tr key={s.id}>
                    <td>Semester {s.sem_no}</td>
                    <td style={{ color: gpaColor(s.gpa), fontWeight: 700, fontSize: '1.1rem' }}>{s.gpa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <div className="card-title">GPA Trend</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#8b8fa8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0,10]} tick={{ fill: '#8b8fa8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1a1d2e', border: '1px solid #222540', borderRadius: 8, color: '#f0f0ff' }} />
                <Line type="monotone" dataKey="GPA" stroke="#6C63FF" strokeWidth={2.5} dot={{ fill: '#00D4FF', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {selected && semesters.length === 0 && <div className="empty">No semester results yet for this student</div>}
    </div>
  )
}
