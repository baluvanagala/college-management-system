import { useEffect, useState } from 'react'
import api from '../../api/api'

export default function MyFees() {
  const [fees, setFees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/fees/').then(r => {
      setFees(r.data.results || r.data)
      setLoading(false)
    })
  }, [])

  return (
    <div>
      <div className="page-header">
        <h1>My Fee Status</h1>
        <p className="subtitle">Track your tuition fees and payment history</p>
      </div>

      <div className="table-wrapper">
        {loading ? <div className="loading">Loading fee details...</div> : (
          <table>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Total Payable</th>
                <th>Amount Paid</th>
                <th>Outstanding Balance</th>
                <th>Last Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {fees.length === 0 && <tr><td colSpan={6} className="empty">No fee records found for your account.</td></tr>}
              {fees.map(f => (
                <tr key={f.id}>
                  <td><strong>FEE-{f.id.toString().padStart(4, '0')}</strong></td>
                  <td>${Number(f.total_amount).toLocaleString()}</td>
                  <td>${Number(f.paid_amount).toLocaleString()}</td>
                  <td style={{ color: f.balance > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 700 }}>
                    ${Number(f.balance).toLocaleString()}
                  </td>
                  <td>{f.payment_date || 'N/A'}</td>
                  <td><span className={`badge badge-${f.status}`}>{f.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card glass-card" style={{ marginTop: 24, maxWidth: 600 }}>
        <h4 style={{ marginBottom: 12 }}>💡 Note to Student</h4>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          If there are any discrepancies in your fee records, please visit the accounts department or contact the administrator with your payment receipt.
        </p>
      </div>
    </div>
  )
}
