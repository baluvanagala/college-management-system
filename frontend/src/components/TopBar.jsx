import './TopBar.css'
import { useAuth } from '../context/useAuth'
import { useTheme } from '../context/useTheme'

export default function TopBar() {
  const { auth } = useAuth()
  const { dark, toggleTheme } = useTheme()

  return (
    <header className="top-bar">
      <div className="top-bar-search">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search data..." />
        </div>
      </div>
      
      <div className="top-bar-actions">
        {/* Dark mode toggle */}
        <button
          className="icon-btn theme-toggle-btn"
          onClick={toggleTheme}
          title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle dark mode"
        >
          <span className="icon theme-toggle-icon">
            {dark ? '☀️' : '🌙'}
          </span>
        </button>

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
