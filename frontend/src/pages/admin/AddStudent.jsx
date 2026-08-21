import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/api'

export default function AddStudent() {
  const [departments, setDepartments] = useState([])
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({
    name: '', roll_no: '', year: '', department: '', user: '',
    mobile_no: '', dob: '', blood_group: '', gender: '',
    address: '', guardian_name: '', guardian_contact: '',
    username: '', password: '', profile_pic: null
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/departments/').then(r => setDepartments(r.data.results || r.data))
    api.get('/users/').then(r => setUsers((r.data.results || r.data).filter(u => u.role === 'student')))
  }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    
    if (!form.name || !form.roll_no || !form.department || !form.year) {
      setError('Please fill in all required fields')
      return
    }
    
    try {
      await api.post('/students/', toFormData(form))
      setSuccess('Student added successfully!')
      setTimeout(() => navigate('/admin/students'), 1200)
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
        setError(JSON.stringify(errorData) || 'Error adding student')
      }
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Add Student</h1>
        <p>Register a new student in the system</p>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input id="s-name" className="form-input" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Student full name" />
          </div>
          <div className="form-group">
            <label className="form-label">Roll Number *</label>
            <input id="s-roll" className="form-input" required value={form.roll_no} onChange={e => set('roll_no', e.target.value)} placeholder="e.g. CS2024001" />
          </div>
          <div className="form-group">
            <label className="form-label">Department *</label>
            <select id="s-dept" className="form-select" required value={form.department} onChange={e => set('department', e.target.value)}>
              <option value="">Select Department</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Year *</label>
            <select id="s-year" className="form-select" required value={form.year} onChange={e => set('year', e.target.value)}>
              <option value="">Select Year</option>
              {[1,2,3,4].map(y => <option key={y} value={y}>{['1st','2nd','3rd','4th'][y-1]} Year</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">User Account</label>
            <select id="s-user" className="form-select" value={form.user} onChange={e => set('user', e.target.value)}>
              <option value="">Select User (optional)</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Mobile No</label>
            <input className="form-input" value={form.mobile_no} onChange={e => set('mobile_no', e.target.value)} placeholder="+91 XXXXXXXXXX" />
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
            <input className="form-input" value={form.guardian_name} onChange={e => set('guardian_name', e.target.value)} placeholder="Guardian full name" />
          </div>
          <div className="form-group">
            <label className="form-label">Guardian Contact</label>
            <input className="form-input" value={form.guardian_contact} onChange={e => set('guardian_contact', e.target.value)} placeholder="Guardian mobile" />
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
          <div className="form-group full">
            <label className="form-label">Address</label>
            <textarea className="form-textarea" value={form.address} onChange={e => set('address', e.target.value)} placeholder="Full address" />
          </div>
        </div>
        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}
        <div className="form-actions">
          <button id="add-student-btn" type="submit" className="btn btn-primary">✅ Add Student</button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin/students')}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

// Helper to convert form state to FormData
const toFormData = (obj) => {
  const fd = new FormData();
  Object.keys(obj).forEach(k => {
    if (obj[k] !== null && obj[k] !== '') fd.append(k, obj[k])
  });
  return fd;
}
