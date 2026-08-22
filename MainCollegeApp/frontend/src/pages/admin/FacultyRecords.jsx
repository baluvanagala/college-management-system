import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/api'

export default function FacultyRecords() {
  const [faculty, setFaculty] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchFaculty = () => {
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    api.get(`/faculty/?${params}`).then(r => {
      setFaculty(r.data.results || r.data)
      setLoading(false)
    })
  }

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchFaculty()
    }, 400)
    return () => clearTimeout(delay)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const handleDelete = async (id) => {
    if (!confirm('Delete this faculty member?')) return
    await api.delete(`/faculty/${id}/`)
    fetchFaculty()
  }

  return (
    <div className="faculty-records-page">
      <div className="page-header">
        <div className="header-title">
          <h1>Faculty Records</h1>
          <p className="subtitle">{faculty.length} faculty members</p>
          <Link to="/admin/faculty/add" className="btn btn-primary">
            <span className="btn-icon">＋ Add Faculty</span> 
          </Link>
        </div>
        
      </div>

      <div className="table-wrapper table-records">
        <div className="table-toolbar">

          <div className="search-box">
            <input 
              id="faculty-search" 
              className="search-input" 
              placeholder="Search by name or department..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
        </div>

        {loading ? <div className="loading">Loading...</div> : (
          <table>
            <thead>
              <tr>
                <th>Photo</th><th>Name</th><th>Department</th>
                <th>Qualification</th><th>Specialization</th>
                <th>Experience</th><th>Mobile</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {faculty.length === 0 && <tr><td colSpan={9} className="empty">No faculty found</td></tr>}
              {faculty.map(f => (
                <tr key={f.id}>
                  <td>
                    {f.profile_pic ? (
                      <img src={f.profile_pic} alt="" style={{width: 32, height: 32, borderRadius: '50%', objectFit: 'cover'}} />
                    ) : (
                      <div style={{width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10}}>👤</div>
                    )}
                  </td>
                  <td><strong>{f.name}</strong></td>
                  {/* <td style={{ color: 'var(--accent-2)' }}>{f.username || '—'}</td> */}
                  <td>{f.department_name || f.department}</td>
                  <td>{f.highest_qualification || '—'}</td>
                  <td>{f.specialization || '—'}</td>
                  <td>{f.experience_years ? `${f.experience_years} yrs` : '—'}</td>
                  <td>{f.mobile_no || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link to={`/admin/faculty/edit/${f.id}`} className="btn btn-outline btn-sm" style={{ padding: '6px 10px', fontSize: '0.8rem' }}>✏️</Link>
                      <button className="btn btn-danger btn-sm" style={{ padding: '6px 10px', fontSize: '0.8rem' }} onClick={() => handleDelete(f.id)}>🗑️</button>
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
