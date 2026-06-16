import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import BookAppointment from './pages/BookAppointment'
import MyAppointments from './pages/MyAppointments'
import EMRList from './pages/EMRList'
import CreateEMR from './pages/CreateEMR'
import PatientRecords from './pages/PatientRecords'

function PrivateRoute({ children, roles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <main className="min-h-[calc(100vh-60px)]">
        <Routes>
          <Route path="/"          element={<Navigate to="/dashboard" replace />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/appointments/book" element={
            <PrivateRoute roles={['PATIENT']}><BookAppointment /></PrivateRoute>
          }/>
          <Route path="/appointments" element={<PrivateRoute><MyAppointments /></PrivateRoute>} />
          <Route path="/emr"      element={<PrivateRoute roles={['DOCTOR','RECEPTIONIST']}><EMRList /></PrivateRoute>} />
          <Route path="/emr/new"  element={<PrivateRoute roles={['DOCTOR']}><CreateEMR /></PrivateRoute>} />
          <Route path="/my-records" element={<PrivateRoute roles={['PATIENT']}><PatientRecords /></PrivateRoute>} />
        </Routes>
      </main>
    </AuthProvider>
  )
}
