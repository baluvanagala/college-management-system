import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/api'

export default function EditFaculty() {
  const { id } = useParams()
  const [departments, setDepartments] = useState([])
  const [form, setForm] = useState({
    name: '', department: '', mobile_no: '', dob: '', 
    gender: '', address: '', highest_qualification: '',
    specialization: '', experience_years: '',
    profile_pic: null
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      api.get('/departments/'),
      api.get(`/faculty/${id}/`)
    ]).then(([deptsRes, facultyRes]) => {
      setDepartments(deptsRes.data.results || deptsRes.data)
      const f = facultyRes.data
      setForm({
        name: f.name || '',
        department: f.department || '',
        mobile_no: f.mobile_no || '',
        dob: f.dob || '',
        gender: f.gender || '',
        address: f.address || '',
        highest_qualification: f.highest_qualification || '',
        specialization: f.specialization || '',
        experience_years: f.experience_years || '',
        profile_pic: null
      })
      setLoading(false)
    }).catch(() => {
      setError('Could not load faculty data')
      setLoading(false)
    })
  }, [id])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    try {
      await api.patch(`/faculty/${id}/`, toFormData(form))
      setSuccess('Faculty updated successfully!')
      setTimeout(() => navigate('/admin/faculty'), 1200)
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Error updating faculty'))
    }
  }

  if (loading) return <div className="loading" style={{color: '#666'}}>Loading faculty data...</div>

  return (
    <div className="edit-faculty-page">
      <div className="page-header">
        <div className="header-title">
          <h1>Edit Faculty</h1>
          <p className="subtitle">Update details for {form.name}</p>
        </div>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input className="form-input" required value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Department *</label>
            <select className="form-select" required value={form.department} onChange={e => set('department', e.target.value)}>
              <option value="">Select Department</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Highest Qualification</label>
            <input className="form-input" value={form.highest_qualification} onChange={e => set('highest_qualification', e.target.value)} placeholder="e.g. PhD, M.Tech" />
          </div>
          <div className="form-group">
            <label className="form-label">Specialization</label>
            <input className="form-input" value={form.specialization} onChange={e => set('specialization', e.target.value)} placeholder="e.g. Data Science" />
          </div>
          <div className="form-group">
            <label className="form-label">Experience (Years)</label>
            <input type="number" className="form-input" value={form.experience_years} onChange={e => set('experience_years', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Mobile No</label>
            <input className="form-input" value={form.mobile_no} onChange={e => set('mobile_no', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Date of Birth</label>
            <input type="date" className="form-input" value={form.dob} onChange={e => set('dob', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Gender</label>
            <select className="form-select" value={form.gender} onChange={e => set('gender', e.target.value)}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Profile Picture</label>
            <input type="file" className="form-input" accept="image/*" onChange={e => set('profile_pic', e.target.files[0])} />
          </div>
          <div className="form-group full">
            <label className="form-label">Address</label>
            <textarea className="form-textarea" value={form.address} onChange={e => set('address', e.target.value)} />
          </div>
        </div>
        
        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">💾 Save Changes</button>
          <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/faculty')}>Cancel</button>
        </div>
      </form>

    </div>
  )
}

const toFormData = (obj) => {
  const fd = new FormData();
  Object.keys(obj).forEach(k => {
    if (obj[k] !== null && obj[k] !== '') fd.append(k, obj[k])
  });
  return fd;
}
