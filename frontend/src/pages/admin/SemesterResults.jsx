import { useEffect, useState } from 'react'
import api from '../../api/api'

const YEAR_LABELS = { 1: '1st Year', 2: '2nd Year', 3: '3rd Year', 4: '4th Year' }
export default function SemesterResults() {
  const [students, setStudents] = useState([])
  const [departments, setDepartments] = useState([])
  const [selected, setSelected] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [yearFilter, setYearFilter] = useState('')
  const [semesters, setSemesters] = useState([])
  const [form, setForm] = useState({ student: '', sem_no: '', gpa: '' })
  const [msg, setMsg] = useState({ text: '', type: '' })

  useEffect(() => {
    api.get('/departments/').then(r => setDepartments(r.data.results || r.data))
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    if (deptFilter) params.append('department', deptFilter)
    if (yearFilter) params.append('year', yearFilter)
    api.get(`/students/?${params}`).then(r => setStudents(r.data.results || r.data))
  }, [deptFilter, yearFilter])

  const loadSemesters = (studentId) => {
    setSelected(studentId)
    setForm(f => ({ ...f, student: studentId }))
    if (studentId) {
      api.get(`/semesters/?student=${studentId}`).then(r => setSemesters(r.data.results || r.data))
    } else {
      setSemesters([])
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setMsg({ text: '', type: '' })
    try {
      await api.post('/semesters/', { student: form.student, sem_no: parseInt(form.sem_no), gpa: parseFloat(form.gpa) })
      setMsg({ text: 'Result added!', type: 'success' })
      loadSemesters(form.student)
      setForm(f => ({ ...f, sem_no: '', gpa: '' }))
    } catch (err) {
      setMsg({ text: JSON.stringify(err.response?.data || 'Error'), type: 'error' })
    }
  }

  const handleDelete = async (id) => {
    await api.delete(`/semesters/${id}/`)
    loadSemesters(selected)
  }

  const gpaColor = (g) => g >= 8 ? '#22c55e' : g >= 6 ? '#f59e0b' : '#ef4444'

  return (
    <div>
      <div className="page-header">
        <h1>Semester Results</h1>
        <p>View and manage student semester GPA records</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24, alignItems: 'stretch' }}>
        {/* Left: select student + add form */}
        <div className="form-card" style={{ maxWidth: '100%', margin: 0 }}>
          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 20 }}>
            <div className="form-group">
              <label className="form-label">Filter Department</label>
              <select className="form-select" value={deptFilter} onChange={e => { setDeptFilter(e.target.value); setSelected(''); setSemesters([]) }}>
                <option value="">All Departments</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Filter Year</label>
              <select className="form-select" value={yearFilter} onChange={e => { setYearFilter(e.target.value); setSelected(''); setSemesters([]) }}>
                <option value="">All Years</option>
                {[1,2,3,4].map(y => <option key={y} value={y}>{YEAR_LABELS[y]}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 24, padding: '16px', background: 'rgba(0,0,0,0.02)', borderRadius: 12, border: '1px solid #eee' }}>
            <label className="form-label" style={{ color: 'var(--primary)', fontWeight: 800 }}>Select Student</label>
            <select id="sem-student" className="form-select" style={{ borderColor: 'var(--primary)' }} value={selected} onChange={e => loadSemesters(e.target.value)}>
              <option value="">Choose a student...</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.roll_no})</option>)}
            </select>
          </div>

          {selected && (
            <form onSubmit={handleAdd}>
              <div className="card-title">Add / Update Semester</div>
              <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="form-group">
                  <label className="form-label">Semester No *</label>
                  <select id="sem-no" className="form-select" required value={form.sem_no} onChange={e => setForm(f => ({ ...f, sem_no: e.target.value }))}>
                    <option value="">Select</option>
                    {[1,2,3,4].map(n => <option key={n} value={n}>Semester {n}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">GPA (0–10) *</label>
                  <input id="sem-gpa" type="number" step="0.01" min="0" max="10" className="form-input" required
                    value={form.gpa} onChange={e => setForm(f => ({ ...f, gpa: e.target.value }))} placeholder="e.g. 8.5" />
                </div>
              </div>
              {msg.text && <div className={msg.type === 'success' ? 'form-success' : 'form-error'}>{msg.text}</div>}
              <div className="form-actions" style={{ marginTop: 16 }}>
                <button id="add-sem-btn" type="submit" className="btn btn-primary">➕ Add Result</button>
              </div>
            </form>
          )}
        </div>

        {/* Right: semester list */}
        <div className="table-wrapper" style={{ margin: 0, padding: 32 }}>
          <div className="card-title">Semester History</div>
          {semesters.length === 0
            ? <div className="empty">{selected ? 'No results yet' : 'Select a student to view results'}</div>
            : (
              <table>
                <thead><tr><th>Semester</th><th>GPA</th><th>Date</th><th>Action</th></tr></thead>
                <tbody>
                  {[...semesters].sort((a,b) => a.sem_no - b.sem_no).map(s => (
                    <tr key={s.id}>
                      <td>Semester {s.sem_no}</td>
                      <td style={{ color: gpaColor(s.gpa), fontWeight: 700, fontSize: '1rem' }}>{s.gpa}</td>
                      <td>{new Date(s.created_at).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }
        </div>
      </div>
    </div>
  )
}
