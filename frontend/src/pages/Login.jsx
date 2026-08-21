import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/api'
import { useAuth } from '../context/useAuth'
import './Login.css'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

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
    } catch {
      setError('Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>
      
      <div className="login-container animate-fade">
        <Link to="/" className="back-home">← Back to Home</Link>
        
        <div className="login-card glass-card">
          <div className="login-brand">
            <span className="login-logo">🏛️</span>
            <h1 className="brand-font">EduPortal</h1>
            <p>Institutional Access Portal</p>
          </div>
          
          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="form-error" style={{marginBottom: '20px'}}>{error}</div>}
            
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                id="username"
                className="form-input"
                placeholder="Enter your username"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group" style={{marginTop: '20px'}}>
              <label className="form-label">Password</label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            
            <button id="login-btn" className="btn btn-primary login-submit-btn" type="submit" disabled={loading} style={{width: '100%', marginTop: '32px'}}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
          
          <p className="login-footer-text">
            Forgot credentials? <span>Contact Department Head</span>
          </p>
        </div>
      </div>
    </div>
  )
}
