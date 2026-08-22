import { useEffect, useState } from 'react'
import api from '../../api/api'
import { useAuth } from '../../context/useAuth'

export default function FacultyProfile() {
  const { auth } = useAuth()
  const [faculty, setFaculty] = useState(null)

  useEffect(() => {
    api.get(`/faculty/${auth.faculty_id}/`).then(r => setFaculty(r.data))
  }, [auth.faculty_id])

  if (!faculty) return <div className="loading">Loading profile...</div>

  const fields = [
    { label: 'Full Name', value: faculty.name },
    { label: 'Username', value: auth.username },
    { label: 'Department', value: faculty.department_name },
    { label: 'Mobile', value: faculty.mobile_no },
    { label: 'Qualification', value: faculty.highest_qualification },
    { label: 'Specialization', value: faculty.specialization },
    { label: 'University', value: faculty.university },
    { label: 'Experience', value: faculty.experience_years ? `${faculty.experience_years} years` : null },
    { label: 'Blood Group', value: faculty.blood_group },
    { label: 'Gender', value: faculty.gender },
  ]

  return (
    <div>
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Your faculty profile information</p>
      </div>

      <div className="profile-grid">
        <div className="profile-avatar-card">
          <div className="profile-avatar">
            {faculty.profile_pic ? (
              <img src={faculty.profile_pic} alt={faculty.name} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
            ) : (
              faculty.name?.[0]?.toUpperCase()
            )}
          </div>
          <div className="profile-name">{faculty.name}</div>
          <div className="profile-role">Faculty</div>
          <div style={{ marginTop: 16, color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            <div>🏢 {faculty.department_name}</div>
            {faculty.experience_years && <div style={{ marginTop: 6 }}>⏱️ {faculty.experience_years} yrs experience</div>}
          </div>
        </div>

        <div className="profile-info-card">
          <div className="card-title">Personal &amp; Academic Info</div>
          <div className="profile-fields">
            {fields.map(f => (
              <div className="profile-field" key={f.label}>
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
