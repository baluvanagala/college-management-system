import './TopBar.css'
import { useAuth } from '../context/useAuth'

export default function TopBar() {
  const { auth } = useAuth()

  return (
    <header className="top-bar">
      <div className="top-bar-search">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search data..." />
        </div>
      </div>
      
      <div className="top-bar-actions">
        <button className="icon-btn" title="Notifications">
          <span className="icon">🔔</span>
        </button>
        
        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">{auth?.username || 'User'}</span>
            <span className="user-role">{auth?.role}</span>
          </div>
          <div className="user-avatar">
            {auth?.username ? auth.username[0].toUpperCase() : 'U'}
          </div>
          <button className="icon-btn more-btn">
            <span className="icon">⋮</span>
          </button>
        </div>
      </div>
    </header>
  )
}
