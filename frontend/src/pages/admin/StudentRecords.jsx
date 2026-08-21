import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/api'
import './StudentRecords.css';


const YEAR_LABELS = { 1: '1st Year', 2: '2nd Year', 3: '3rd Year', 4: '4th Year' }

export default function StudentRecords() {
  const [students, setStudents] = useState([])
  const [departments, setDepartments] = useState([])
  const [search, setSearch] = useState('')
  const [year, setYear] = useState('')
  const [dept, setDept] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchStudents = () => {
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (year) params.append('year', year)
    if (dept) params.append('department', dept)
    api.get(`/students/?${params}`).then(r => {
      setStudents(r.data.results || r.data)
      setLoading(false)
    })
  }

  useEffect(() => {
    api.get('/departments/').then(r => setDepartments(r.data.results || r.data))
  }, [])

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchStudents()
    }, 400)
    return () => clearTimeout(delay)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, year, dept])

  const handleDelete = async (id) => {
    if (!confirm('Delete this student?')) return
    await api.delete(`/students/${id}/`)
    fetchStudents()
  }

  return (
    <div className="student-records-page">
      <div className="page-header">
        <div className="header-title">
          <h1>Student Records</h1>
          <p className="subtitle">{students.length} students found</p>
          <Link to="/admin/students/add" className="btn btn-primary add-std-btn">
          <span className="btn-icon">＋ Add Student</span> 
        </Link>
        </div>
        
      </div>

      <div className="table-wrapper table-records" >
        <div className="table-toolbar" >
          <div className="search-box">
            <input 
              id="student-search" 
              className="search-input" 
              placeholder="Search by name or roll number..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
          <select className="filter-select" value={year} onChange={e => setYear(e.target.value)}>
            <option value="">All Years</option>
            {[1,2,3,4].map(y => <option key={y} value={y}>{YEAR_LABELS[y]}</option>)}
          </select>
          <select className="filter-select" value={dept} onChange={e => setDept(e.target.value)}>
            <option value="">All Departments</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>


        {loading ? <div className="loading">Loading...</div> : (
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Roll No</th><th>Department</th><th>Year</th>
                <th>Mobile</th><th>Action</th>
                {/* <th>User Linked</th> */}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 && <tr><td colSpan={9} className="empty">No students found</td></tr>}
              {students.map(s => (
                <tr key={s.id}>
                  
                  <td><strong>{s.name}</strong></td>
                  <td >{s.roll_no}</td>
                  <td>{s.department_name || s.department}</td>
                  <td>{YEAR_LABELS[s.year] || 'N/A'}</td>
                  <td>{s.mobile_no || 'N/A'}</td>
                  {/* <td>{s.user ? <span style={{color: 'var(--success)'}}>✅ Yes</span> : <span style={{color: 'var(--danger)'}}>❌ No</span>}</td> */}
                  
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link to={`/admin/students/edit/${s.id}`} className="btn btn-outline btn-sm" style={{ padding: '6px 10px', fontSize: '0.8rem' }}>✏️</Link>
                      <button className="btn btn-danger btn-sm" style={{ padding: '6px 10px', fontSize: '0.8rem' }} onClick={() => handleDelete(s.id)}>🗑️</button>
                    </div>
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
