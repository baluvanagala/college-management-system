import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import './Sidebar.css'

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/students', label: 'Student Records', icon: '🎓' },
  { to: '/admin/faculty', label: 'Faculty Records', icon: '👨‍🏫' },
  { to: '/admin/fees', label: 'Fee Management', icon: '💰' },
  { to: '/admin/semesters', label: 'Semester Results', icon: '📈' },
]

const facultyLinks = [
  { to: '/faculty', label: 'Dashboard', icon: '📊', end: true },
  { to: '/faculty/profile', label: 'My Profile', icon: '👤' },
  { to: '/faculty/students', label: 'Dept Students', icon: '🎓' },
  { to: '/faculty/leaves', label: 'Leave Management', icon: '📝' },
  { to: '/faculty/semesters', label: 'Semester Results', icon: '📈' },
]

const studentLinks = [
  { to: '/student', label: 'Dashboard', icon: '📊', end: true },
  { to: '/student/profile', label: 'My Profile', icon: '👤' },
  { to: '/student/fees', label: 'Fee Status', icon: '💰' },
  { to: '/student/leaves/apply', label: 'Apply Leave', icon: '✍️' },
  { to: '/student/leaves', label: 'My Leaves', icon: '📋' },
  { to: '/student/results', label: 'My Results', icon: '📈' },
]

const linksMap = { admin: adminLinks, faculty: facultyLinks, student: studentLinks }

export default function Sidebar() {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()
  const links = linksMap[auth?.role] || []

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-logo-circle">
          <span className="sidebar-logo">🏛️</span>
        </div>
        <span className="sidebar-title">EduPortal</span>
      </div>

      <div className="sidebar-section-label">Menu</div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            title={link.label}            /* tooltip when collapsed */
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span className="sidebar-icon">{link.icon}</span>
            <span className="sidebar-label">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button className="sidebar-logout-btn" onClick={handleLogout} title="Sign Out">
        <span className="sidebar-icon">🚪</span>
        <span className="sidebar-label">Sign Out</span>
      </button>
    </aside>
  )
}
