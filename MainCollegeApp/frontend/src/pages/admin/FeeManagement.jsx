import { useEffect, useState } from 'react'
import api from '../../api/api'

export default function FeeManagement() {
  const [fees, setFees] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [formData, setFormData] = useState({ student: '', total_amount: '', paid_amount: '', payment_date: '' })
  const [msg, setMsg] = useState('')

  const fetchFees = () => {
    api.get('/fees/').then(r => {
      setFees(r.data.results || r.data)
      setLoading(false)
    })
  }

  const fetchStudents = () => {
    api.get('/students/').then(r => setStudents(r.data.results || r.data))
  }

  useEffect(() => {
    fetchFees()
    fetchStudents()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/fees/', formData)
      setMsg('Fee record added successfully')
      setFormData({ student: '', total_amount: '', paid_amount: '', payment_date: '' })
      setShowAdd(false)
      fetchFees()
    } catch {
      setMsg('Error adding fee record')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this record?')) return
    await api.delete(`/fees/${id}/`)
    fetchFees()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Fee Management</h1>
          <p className="subtitle">Manage student fee records and payment status</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? 'Cancel' : '＋ Add Fee Record'}
        </button>
      </div>

      {msg && <div className={msg.includes('Error') ? 'form-error' : 'form-success'}>{msg}</div>}

      {showAdd && (
        <div className="form-card animate-fade" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 20 }}>Add New Fee Record</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Student</label>
                <select className="form-select" required value={formData.student} onChange={e => setFormData({...formData, student: e.target.value})}>
                  <option value="">Select Student</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.roll_no})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Total Amount</label>
                <input className="form-input" type="number" required placeholder="e.g. 5000" value={formData.total_amount} onChange={e => setFormData({...formData, total_amount: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Paid Amount</label>
                <input className="form-input" type="number" required placeholder="e.g. 2000" value={formData.paid_amount} onChange={e => setFormData({...formData, paid_amount: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Payment Date</label>
                <input className="form-input" type="date" value={formData.payment_date} onChange={e => setFormData({...formData, payment_date: e.target.value})} />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Save Fee Record</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowAdd(false)}>Discard</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-wrapper">
        {loading ? <div className="loading">Loading records...</div> : (
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Total Amount</th>
                <th>Paid Amount</th>
                <th>Balance</th>
                <th>Payment Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fees.length === 0 && <tr><td colSpan={7} className="empty">No fee records found. Click add to create one.</td></tr>}
              {fees.map(f => (
                <tr key={f.id}>
                  <td><strong>{f.student_name}</strong></td>
                  <td>${Number(f.total_amount).toLocaleString()}</td>
                  <td>${Number(f.paid_amount).toLocaleString()}</td>
                  <td style={{ color: f.balance > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 700 }}>
                    ${Number(f.balance).toLocaleString()}
                  </td>
                  <td>{f.payment_date || 'N/A'}</td>
                  <td><span className={`badge badge-${f.status}`}>{f.status}</span></td>
                  <td>
                    <button className="btn btn-danger btn-sm" style={{ padding: '6px 10px' }} onClick={() => handleDelete(f.id)}>🗑️</button>
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
