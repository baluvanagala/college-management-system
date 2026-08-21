import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/api'

export default function EditStudent() {
  const { id } = useParams()
  const [departments, setDepartments] = useState([])
  const [form, setForm] = useState({
    name: '', roll_no: '', year: '', department: '',
    mobile_no: '', dob: '', blood_group: '', gender: '',
    address: '', guardian_name: '', guardian_contact: '',
    profile_pic: null
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      api.get('/departments/'),
      api.get(`/students/${id}/`)
    ]).then(([deptsRes, studentRes]) => {
      setDepartments(deptsRes.data.results || deptsRes.data)
      const s = studentRes.data
      setForm({
        name: s.name || '',
        roll_no: s.roll_no || '',
        year: s.year || '',
        department: s.department || '',
        mobile_no: s.mobile_no || '',
        dob: s.dob || '',
        blood_group: s.blood_group || '',
        gender: s.gender || '',
        address: s.address || '',
        guardian_name: s.guardian_name || '',
        guardian_contact: s.guardian_contact || '',
        profile_pic: null
      })
      setLoading(false)
    }).catch(() => {
      setError('Could not load student data')
      setLoading(false)
    })
  }, [id])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    try {
      await api.patch(`/students/${id}/`, toFormData(form))
      setSuccess('Student updated successfully!')
      setTimeout(() => navigate('/admin/students'), 1200)
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Error updating student'))
    }
  }

  if (loading) return <div className="loading" style={{color: '#666'}}>Loading student data...</div>

  return (
    <div className="edit-student-page">
      <div className="page-header">
        <div className="header-title">
          <h1>Edit Student</h1>
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
            <label className="form-label">Roll Number *</label>
            <input className="form-input" required value={form.roll_no} onChange={e => set('roll_no', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Department *</label>
            <select className="form-select" required value={form.department} onChange={e => set('department', e.target.value)}>
              <option value="">Select Department</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Year *</label>
            <select className="form-select" required value={form.year} onChange={e => set('year', e.target.value)}>
              <option value="">Select Year</option>
              {[1,2,3,4].map(y => <option key={y} value={y}>{['1st','2nd','3rd','4th'][y-1]} Year</option>)}
            </select>
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
            <label className="form-label">Blood Group</label>
            <select className="form-select" value={form.blood_group} onChange={e => set('blood_group', e.target.value)}>
              <option value="">Select</option>
              {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
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
            <label className="form-label">Guardian Name</label>
            <input className="form-input" value={form.guardian_name} onChange={e => set('guardian_name', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Guardian Contact</label>
            <input className="form-input" value={form.guardian_contact} onChange={e => set('guardian_contact', e.target.value)} />
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
          <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/students')}>Cancel</button>
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
