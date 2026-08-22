import { useState } from 'react'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('access')
    const role = localStorage.getItem('role')
    const username = localStorage.getItem('username')
    const user_id = localStorage.getItem('user_id')
    const student_id = localStorage.getItem('student_id')
    const faculty_id = localStorage.getItem('faculty_id')
    const profile_pic = localStorage.getItem('profile_pic')
    return token ? { token, role, username, user_id, student_id, faculty_id, profile_pic } : null
  })

  const login = (data) => {
    localStorage.setItem('access', data.access)
    localStorage.setItem('refresh', data.refresh)
    localStorage.setItem('role', data.role)
    localStorage.setItem('username', data.username)
    localStorage.setItem('user_id', data.user_id)
    if (data.student_id) localStorage.setItem('student_id', data.student_id)
    if (data.faculty_id) localStorage.setItem('faculty_id', data.faculty_id)
    if (data.profile_pic) localStorage.setItem('profile_pic', data.profile_pic)
    setAuth(data)
  }

  const logout = () => {
    localStorage.clear()
    setAuth(null)
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

