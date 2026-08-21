import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import { useAuth } from '../context/useAuth'
import '../pages/Login.css'

export default function LoginModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/login/', form)
      login(res.data)
      const role = res.data.role
      if (role === 'admin') navigate('/admin')
      else if (role === 'faculty') navigate('/faculty')
      else navigate('/student')
      onClose()
    } catch {
      setError('Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay animate-fade" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(10px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
    }}>
      <div className="modal-container" onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 10, right: 10, background: 'transparent',
          border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666', zIndex: 10
        }}>&times;</button>
        
        <div className="login-card glass-card" style={{ 
          boxShadow: '0 25px 60px rgba(0,0,0,0.4)', 
          border: '1px solid rgba(255,255,255,0.3)',
          width: '380px',
          padding: '32px',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.98)'
        }}>
          <div className="login-brand" style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '5px' }}>🏛️</div>
            <h1 className="brand-font" style={{ fontSize: '1.8rem', marginBottom: '2px' }}>EduPortal</h1>
            <p style={{ letterSpacing: '0.5px', opacity: 0.8, fontSize: '0.85rem' }}>Institutional Access Portal</p>
          </div>
          
          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="form-error" style={{marginBottom: '15px', padding: '8px'}}>{error}</div>}
            
            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.7rem', letterSpacing: '1px', marginBottom: '4px' }}>USERNAME</label>
              <input
                id="username"
                className="form-input"
                placeholder="Enter your username"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                required
                style={{ padding: '12px', borderRadius: '8px' }}
              />
            </div>
            
            <div className="form-group" style={{ marginTop: '0' }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.7rem', letterSpacing: '1px', marginBottom: '4px' }}>PASSWORD</label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                style={{ padding: '12px', borderRadius: '8px' }}
              />
            </div>
            
            <button id="login-btn" className="btn btn-primary login-submit-btn" type="submit" disabled={loading} style={{
              width: '100%', maxWidth: '100%', marginTop: '24px', padding: '12px', borderRadius: '8px',
              fontSize: '0.9rem', fontWeight: 800, background: 'linear-gradient(to right, #ff00a0, #ff8c00)',
              display: 'flex', boxSizing: 'border-box'
            }}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
          
          <p className="login-footer-text" style={{ marginTop: '16px', fontSize: '0.75rem' }}>
            Forgot credentials? <span style={{ fontWeight: 600 }}>Contact Department Head</span>
          </p>
        </div>
      </div>
    </div>
  )
}
