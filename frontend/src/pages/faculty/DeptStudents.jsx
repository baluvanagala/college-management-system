import { useEffect, useState } from 'react'
import api from '../../api/api'

const YEAR_LABELS = { 1: '1st Year', 2: '2nd Year', 3: '3rd Year', 4: '4th Year' }

export default function DeptStudents() {
  const [students, setStudents] = useState([])
  const [year, setYear] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams()
    if (year) params.append('year', year)
    if (search) params.append('search', search)
    api.get(`/students/?${params}`).then(r => {
      setStudents(r.data.results || r.data)
      setLoading(false)
    })
  }, [year, search])

  return (
    <div>
      <div className="page-header">
        <h1>Department Students</h1>
        <p>Students in your department — {students.length} found</p>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <input id="dept-search" className="search-input" placeholder="🔍 Search by name or roll no..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <select id="year-filter" className="filter-select" value={year} onChange={e => setYear(e.target.value)}>
            <option value="">All Years</option>
            {[1,2,3,4].map(y => <option key={y} value={y}>{YEAR_LABELS[y]}</option>)}
          </select>
        </div>

        {loading ? <div className="loading">Loading...</div> : (
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Roll No</th><th>Year</th>
                <th>Mobile</th><th>Blood Group</th><th>Gender</th><th>CGPA</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 && <tr><td colSpan={7} className="empty">No students found</td></tr>}
              {students.map(s => (
                <tr key={s.id}>
                  <td><strong>{s.name}</strong></td>
                  <td style={{ color: 'var(--accent)' }}>{s.roll_no}</td>
                  <td>
                    <span className="badge" style={{ background: 'rgba(108,99,255,0.12)', color: 'var(--accent)', border: '1px solid rgba(108,99,255,0.25)' }}>
                      {YEAR_LABELS[s.year] || s.year}
                    </span>
                  </td>
                  <td>{s.mobile_no || '—'}</td>
                  <td>{s.blood_group || '—'}</td>
                  <td style={{ textTransform: 'capitalize' }}>{s.gender || '—'}</td>
                  <td style={{ fontWeight: 700, color: s.cgpa >= 8 ? '#22c55e' : s.cgpa >= 6 ? '#f59e0b' : '#ef4444' }}>
                    {s.cgpa ?? '—'}
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
