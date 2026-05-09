import { useEffect, useState } from 'react'
import api from '../../api/api'
import { useAuth } from '../../context/useAuth'
import './StudentProfile.css'

const YEAR_LABELS = { 1: '1st Year', 2: '2nd Year', 3: '3rd Year', 4: '4th Year' }

export default function StudentProfile() {
  const { auth } = useAuth()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!auth?.student_id) {
      setTimeout(() => {
        setError('No student profile found for this user. Please contact admin.')
        setLoading(false)
      }, 0)
      return
    }
    api.get(`/students/${auth.student_id}/`)
      .then(r => {
        setStudent(r.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Error fetching student profile.')
        setLoading(false)
      })
  }, [auth?.student_id])

  if (loading) return <div className="loading">Loading profile...</div>
  if (error) return <div className="card" style={{ margin: '20px', textAlign: 'center', padding: '40px' }}><p className="form-error">{error}</p></div>
  if (!student) return <div className="loading">No student data</div>

  const fields = [
    { label: 'Full Name: ', value: student.name },
    { label: 'Roll Number: ', value: student.roll_no },
    { label: 'Department: ', value: student.department_name },
    { label: 'Year: ', value: YEAR_LABELS[student.year] },
    { label: 'Username: ', value: auth.username },
    { label: 'Mobile: ', value: student.mobile_no },
    { label: 'Date of Birth: ', value: student.dob },
    { label: 'Blood Group: ', value: student.blood_group },
    { label: 'Gender: ', value: student.gender },
    { label: 'CGPA: ', value: student.cgpa },
    { label: 'Guardian Name: ', value: student.guardian_name },
    { label: 'Guardian Contact: ', value: student.guardian_contact },
    { label: 'Address: ', value: student.address },
  ]

  return (
    <div>
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Your student profile information</p>
      </div>

      <div className="profile-grid">
        <div className="profile-avatar-card">
          <div className="profile-avatar">
            {student.profile_pic ? (
              <img src={student.profile_pic} alt={student.name} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
            ) : (
              student.name?.[0]?.toUpperCase()
            )}
          </div>
          <div>
            <div className="profile-name">{student.name}</div>
            <div className="profile-role">Student</div>
            <div style={{ marginTop: 16, color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.8 }}>
              <div>🎓 {YEAR_LABELS[student.year]}</div>
              <div>🏢 {student.department_name}</div>
              <div>📋 {student.roll_no}</div>
              {student.cgpa > 0 && (
                <div style={{ marginTop: 8 }}>
                  <span style={{
                    color: student.cgpa >= 8 ? '#22c55e' : student.cgpa >= 6 ? '#f59e0b' : '#ef4444',
                    fontWeight: 700, fontSize: '1.1rem'
                  }}>
                    CGPA: {student.cgpa}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="profile-info-card">
          <div className="card-title">Personal Information</div>
          <div className="profile-fields">
            {fields.map(f => (
              <div className="profile-field" key={f.label} style={f.label === 'Address: ' ? { gridColumn: '1/-1' } : {}}>
                <label>{f.label}</label>
                <span>{f.value || '—'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
 