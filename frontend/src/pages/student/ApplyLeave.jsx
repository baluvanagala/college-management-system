import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/api'
import { useAuth } from '../../context/useAuth'

export default function ApplyLeave() {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [form, setForm] = useState({ reason: '', from_date: '', to_date: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!auth?.student_id) {
      setTimeout(() => setError('You do not have a student profile associated with your account.'), 0)
      return
    }
    api.get(`/students/${auth.student_id}/`).then(r => setStudent(r.data)).catch(() => setError('Failed to load your student profile.'))
  }, [auth?.student_id])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    if (!auth?.student_id) { setError('Missing student profile ID'); return }
    if (form.to_date < form.from_date) { setError('End date must be after start date'); return }
    setLoading(true)
    try {
      await api.post('/leaves/', {
        student: auth.student_id,
        reason: form.reason,
        from_date: form.from_date,
        to_date: form.to_date
      })
      setSuccess('Leave application submitted successfully!')
      setTimeout(() => navigate('/student/leaves'), 1200)
    } catch (err) {
      const msg = err.response?.data ? JSON.stringify(err.response.data) : 'Error submitting leave'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const days = form.from_date && form.to_date
    ? Math.max(0, (new Date(form.to_date) - new Date(form.from_date)) / 86400000) + 1
    : 0

  return (
    <div>
      <div className="page-header">
        <h1>Apply for Leave</h1>
        <p>Submit a leave request to your faculty</p>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        {student && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24, padding: '12px 16px', background: 'rgba(108,99,255,0.08)', borderRadius: 8, border: '1px solid rgba(108,99,255,0.2)' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white' }}>
              {student.name?.[0]}
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>{student.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{student.roll_no} · {student.department_name}</div>
            </div>
          </div>
        )}

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">From Date *</label>
            <input id="leave-from" type="date" className="form-input" required
              value={form.from_date} onChange={e => set('from_date', e.target.value)}
              min={new Date().toISOString().split('T')[0]} />
          </div>
          <div className="form-group">
            <label className="form-label">To Date *</label>
            <input id="leave-to" type="date" className="form-input" required
              value={form.to_date} onChange={e => set('to_date', e.target.value)}
              min={form.from_date || new Date().toISOString().split('T')[0]} />
          </div>
          {days > 0 && (
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <div style={{ padding: '8px 14px', background: 'rgba(0,212,255,0.08)', borderRadius: 6, color: 'var(--accent-2)', fontSize: '0.85rem', border: '1px solid rgba(0,212,255,0.2)' }}>
                📅 Duration: <strong>{days} day{days !== 1 ? 's' : ''}</strong>
              </div>
            </div>
          )}
          <div className="form-group full">
            <label className="form-label">Reason *</label>
            <textarea id="leave-reason" className="form-textarea" required rows={4}
              value={form.reason} onChange={e => set('reason', e.target.value)}
              placeholder="Describe your reason for leave..." />
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        <div className="form-actions">
          <button id="submit-leave-btn" type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : '✍️ Submit Leave'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/student/leaves')}>Cancel</button>
        </div>
      </form>
    </div>
  )
}
