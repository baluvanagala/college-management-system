import './index.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { ThemeProvider } from './context/ThemeProvider'
import { useAuth } from './context/useAuth'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'


import LandingPage from './pages/LandingPage'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import StudentRecords from './pages/admin/StudentRecords'
import AddStudent from './pages/admin/AddStudent'
import FacultyRecords from './pages/admin/FacultyRecords'
import AddFaculty from './pages/admin/AddFaculty'
import EditStudent from './pages/admin/EditStudent'
import EditFaculty from './pages/admin/EditFaculty'

import FeeManagement from './pages/admin/FeeManagement'
import SemesterResults from './pages/admin/SemesterResults'

// Faculty
import FacultyDashboard from './pages/faculty/FacultyDashboard'
import FacultyProfile from './pages/faculty/FacultyProfile'
import DeptStudents from './pages/faculty/DeptStudents'
import LeaveManagement from './pages/faculty/LeaveManagement'
import FacultySemesters from './pages/faculty/FacultySemesters'

// Student
import StudentDashboard from './pages/student/StudentDashboard'
import StudentProfile from './pages/student/StudentProfile'
import MyFees from './pages/student/MyFees'
import ApplyLeave from './pages/student/ApplyLeave'
import MyLeaves from './pages/student/MyLeaves'
import MyResults from './pages/student/MyResults'

function RoleRedirect() {
  const { auth } = useAuth()
  if (!auth) return <Navigate to="/login" replace />
  if (auth.role === 'admin' || auth.role === 'hod') return <Navigate to="/admin" replace />
  if (auth.role === 'faculty') return <Navigate to="/faculty" replace />
  return <Navigate to="/student" replace />
}

function DashboardLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}



export default function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<RoleRedirect />} />
          <Route path="/login" element={<Navigate to="/" replace />} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><DashboardLayout><AdminDashboard /></DashboardLayout></ProtectedRoute>} />
          <Route path="/admin/students" element={<ProtectedRoute role="admin"><DashboardLayout><StudentRecords /></DashboardLayout></ProtectedRoute>} />
          <Route path="/admin/students/add" element={<ProtectedRoute role="admin"><DashboardLayout><AddStudent /></DashboardLayout></ProtectedRoute>} />
          <Route path="/admin/students/edit/:id" element={<ProtectedRoute role="admin"><DashboardLayout><EditStudent /></DashboardLayout></ProtectedRoute>} />
          <Route path="/admin/faculty" element={<ProtectedRoute role="admin"><DashboardLayout><FacultyRecords /></DashboardLayout></ProtectedRoute>} />
          <Route path="/admin/faculty/add" element={<ProtectedRoute role="admin"><DashboardLayout><AddFaculty /></DashboardLayout></ProtectedRoute>} />
          <Route path="/admin/faculty/edit/:id" element={<ProtectedRoute role="admin"><DashboardLayout><EditFaculty /></DashboardLayout></ProtectedRoute>} />

          <Route path="/admin/fees" element={<ProtectedRoute role="admin"><DashboardLayout><FeeManagement /></DashboardLayout></ProtectedRoute>} />
          <Route path="/admin/semesters" element={<ProtectedRoute role="admin"><DashboardLayout><SemesterResults /></DashboardLayout></ProtectedRoute>} />

          {/* Faculty */}
          <Route path="/faculty" element={<ProtectedRoute role="faculty"><DashboardLayout><FacultyDashboard /></DashboardLayout></ProtectedRoute>} />
          <Route path="/faculty/profile" element={<ProtectedRoute role="faculty"><DashboardLayout><FacultyProfile /></DashboardLayout></ProtectedRoute>} />
          <Route path="/faculty/students" element={<ProtectedRoute role="faculty"><DashboardLayout><DeptStudents /></DashboardLayout></ProtectedRoute>} />
          <Route path="/faculty/leaves" element={<ProtectedRoute role="faculty"><DashboardLayout><LeaveManagement /></DashboardLayout></ProtectedRoute>} />
          <Route path="/faculty/semesters" element={<ProtectedRoute role="faculty"><DashboardLayout><FacultySemesters /></DashboardLayout></ProtectedRoute>} />

          {/* Student */}
          <Route path="/student" element={<ProtectedRoute role="student"><DashboardLayout><StudentDashboard /></DashboardLayout></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute role="student"><DashboardLayout><StudentProfile /></DashboardLayout></ProtectedRoute>} />
          <Route path="/student/fees" element={<ProtectedRoute role="student"><DashboardLayout><MyFees /></DashboardLayout></ProtectedRoute>} />
          <Route path="/student/leaves/apply" element={<ProtectedRoute role="student"><DashboardLayout><ApplyLeave /></DashboardLayout></ProtectedRoute>} />
          <Route path="/student/leaves" element={<ProtectedRoute role="student"><DashboardLayout><MyLeaves /></DashboardLayout></ProtectedRoute>} />
          <Route path="/student/results" element={<ProtectedRoute role="student"><DashboardLayout><MyResults /></DashboardLayout></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  )
}
