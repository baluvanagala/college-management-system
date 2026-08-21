# College Management System — React + Vite Frontend

## Overview
Build a full React (Vite) frontend for the existing Django REST API backend. The system has **3 user roles** — Admin, Faculty, and Student — each with a dedicated dashboard, sidebar navigation, and role-specific features. The backend is already running at `http://localhost:8000/api/`.

---

## Architecture

```
Frontend (Vite + React)      ←→     Django REST API (port 8000)
├── /login                           /api/login/
├── /admin/*                         /api/students/, /api/faculty/, ...
├── /faculty/*                       /api/leaves/, /api/semesters/
└── /student/*                       /api/dashboard/
```

**Tech Stack:**
- React 18 + Vite
- React Router v6 (client-side routing)
- Axios (API calls with JWT Bearer token)
- Recharts (dashboard charts)
- Context API (auth state)
- Vanilla CSS (custom design system — dark mode + glassmorphism)

---

## Pages & Features

### 🔐 Login Page (All users)
- Username + Password form
- Role-based redirect after login (admin → /admin, faculty → /faculty, student → /student)
- JWT token stored in localStorage

---

### 🛡️ Admin Dashboard (`/admin`)
**Sidebar links:**
| Page | Description |
|---|---|
| Dashboard | Stats cards + charts (students, faculty, departments, pending leaves) |
| Student Records | Table of all students with search + filter by dept/year, View/Edit/Delete |
| Add Student | Form to add new student (with dept, year, roll_no, etc.) |
| Faculty Records | Table of all faculty with search + filter by dept |
| Add Faculty | Form to add new faculty |
| Leave Requests | All pending/approved/rejected leaves, status badge |
| Semester Results | View/add semester GPA for any student |

---

### 👨‍🏫 Faculty Dashboard (`/faculty`)
**Sidebar links:**
| Page | Description |
|---|---|
| My Profile | Faculty own profile (name, dept, qualification, etc.) |
| My Department Students | Students in faculty's department, filterable by year (1st–4th) |
| Leave Management | Approve/Disapprove pending leave requests from dept students |
| Semester Results | View semester results of dept students |

---

### 🎓 Student Dashboard (`/student`)
**Sidebar links:**
| Page | Description |
|---|---|
| My Profile | Own profile only (name, roll_no, dept, year, contact, etc.) |
| Apply for Leave | Form to submit leave request to faculty (with reason + date range) |
| My Leaves | View status of own leave applications |
| My Results | View own semester GPA (sem 1–4 with chart) |

---

## Proposed File Structure

```
frontend/
├── public/
├── src/
│   ├── api/           # axios instance + API calls
│   │   └── api.js
│   ├── context/       # Auth context
│   │   └── AuthContext.jsx
│   ├── components/    # Reusable components
│   │   ├── Sidebar.jsx
│   │   ├── Navbar.jsx
│   │   ├── StatCard.jsx
│   │   ├── StudentTable.jsx
│   │   ├── FacultyTable.jsx
│   │   └── LeaveTable.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── StudentRecords.jsx
│   │   │   ├── AddStudent.jsx
│   │   │   ├── FacultyRecords.jsx
│   │   │   ├── AddFaculty.jsx
│   │   │   ├── LeaveRequests.jsx
│   │   │   └── SemesterResults.jsx
│   │   ├── faculty/
│   │   │   ├── FacultyDashboard.jsx
│   │   │   ├── FacultyProfile.jsx
│   │   │   ├── DeptStudents.jsx
│   │   │   ├── LeaveManagement.jsx
│   │   │   └── FacultySemesters.jsx
│   │   └── student/
│   │       ├── StudentDashboard.jsx
│   │       ├── StudentProfile.jsx
│   │       ├── ApplyLeave.jsx
│   │       ├── MyLeaves.jsx
│   │       └── MyResults.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

---

## Django Backend Changes Required

### 1. Fix `views.py` — Duplicate `StudentViewSet`
There are **two** `StudentViewSet` class definitions (line 67 and 226). Need to merge them.

### 2. Fix `views.py` — `LoginView` response
Add `faculty_id` for faculty users (needed for frontend profile loading).

### 3. Add `users/` endpoint
Expose `GET /api/users/` for displaying username in any user's profile.

### 4. Add `MainCollegeApp/urls.py` login route
Must include `path("api/login/", LoginView.as_view())`.

---

## Design System
- **Theme**: Dark mode with deep navy/indigo base
- **Accent**: Vibrant purple-blue gradient (`#6C63FF` → `#00D4FF`)
- **Cards**: Glassmorphism style (backdrop-filter + semi-transparent)
- **Font**: Inter (Google Fonts)
- **Sidebar**: Fixed left sidebar with icon + label nav items, active state highlight
- **Charts**: Recharts BarChart (year-wise), PieChart (leave status), LineChart (semester GPA)

---

## Verification Plan

### Automated
- Django server runs without errors on port 8000
- Vite dev server on port 5173
- API calls succeed with JWT token

### Manual
- Admin: login → see dashboard stats → add student → view student records
- Faculty: login → see own profile → filter students by year → approve/reject leave
- Student: login → view profile → apply leave → view results

---

## Open Questions

> [!IMPORTANT]
> **Backend already running?** Please confirm if `python manage.py runserver` is already running or if you need me to start it. Also confirm the MySQL database `college_db` is set up with migrations applied.

> [!NOTE]
> The frontend will be created in a new `frontend/` folder inside `c:\PROJECTS\College_Management_system_using_Django\MainCollegeApp\`. All API calls proxy to `http://localhost:8000`.
