import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/api'

export default function AddFaculty() {
  const [departments, setDepartments] = useState([])
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({
    name: '', department: '', user: '', mobile_no: '',
    highest_qualification: '', specialization: '', university: '',
    experience_years: '', blood_group: '', gender: '',
    username: '', password: '', profile_pic: null
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/departments/').then(r => setDepartments(r.data.results || r.data))
    api.get('/users/').then(r => setUsers((r.data.results || r.data).filter(u => u.role === 'faculty')))
  }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    
    if (!form.name || !form.department) {
      setError('Please fill in all required fields')
      return
    }
    
    try {
      const payload = { ...form }
      if (!payload.experience_years) delete payload.experience_years
      if (!payload.user) delete payload.user
      await api.post('/faculty/', toFormData(payload))
      setSuccess('Faculty added successfully!')
      setTimeout(() => navigate('/admin/faculty'), 1200)
    } catch (err) {
      const errorData = err.response?.data || {}
      
      // Handle validation errors in a more user-friendly way
      if (typeof errorData === 'object' && errorData.username) {
        setError(errorData.username)
      } else if (typeof errorData === 'object' && errorData.non_field_errors) {
        setError(errorData.non_field_errors.join(', '))
      } else if (typeof errorData === 'string') {
        setError(errorData)
      } else {
        setError(JSON.stringify(errorData) || 'Error adding faculty')
      }
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Add Faculty</h1>
        <p>Register a new faculty member</p>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input id="f-name" className="form-input" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Faculty full name" />
          </div>
          <div className="form-group">
            <label className="form-label">Department *</label>
            <select id="f-dept" className="form-select" required value={form.department} onChange={e => set('department', e.target.value)}>
              <option value="">Select Department</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">User Account</label>
            <select id="f-user" className="form-select" value={form.user} onChange={e => set('user', e.target.value)}>
              <option value="">Select User (optional)</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Mobile No</label>
            <input className="form-input" value={form.mobile_no} onChange={e => set('mobile_no', e.target.value)} placeholder="+91 XXXXXXXXXX" />
          </div>
          <div className="form-group">
            <label className="form-label">Highest Qualification</label>
            <input className="form-input" value={form.highest_qualification} onChange={e => set('highest_qualification', e.target.value)} placeholder="e.g. Ph.D, M.Tech" />
          </div>
          <div className="form-group">
            <label className="form-label">Specialization</label>
            <input className="form-input" value={form.specialization} onChange={e => set('specialization', e.target.value)} placeholder="e.g. Machine Learning" />
          </div>
          <div className="form-group">
            <label className="form-label">University</label>
            <input className="form-input" value={form.university} onChange={e => set('university', e.target.value)} placeholder="University name" />
          </div>
          <div className="form-group">
            <label className="form-label">Experience (years)</label>
            <input type="number" className="form-input" value={form.experience_years} onChange={e => set('experience_years', e.target.value)} placeholder="e.g. 5" min={0} />
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
            <label className="form-label">Username (Login Account)</label>
            <input className="form-input" value={form.username} onChange={e => set('username', e.target.value)} placeholder="Unique username" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Password" />
          </div>
          <div className="form-group">
            <label className="form-label">Profile Picture</label>
            <input type="file" className="form-input" accept="image/*" onChange={e => set('profile_pic', e.target.files[0])} />
          </div>
        </div>
        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}
        <div className="form-actions">
          <button id="add-faculty-btn" type="submit" className="btn btn-primary">✅ Add Faculty</button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin/faculty')}>Cancel</button>
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
