import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const roleColors = {
  PATIENT:      'bg-green-100 text-green-800',
  DOCTOR:       'bg-blue-100 text-blue-800',
  RECEPTIONIST: 'bg-purple-100 text-purple-800',
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <nav className="bg-brand shadow-md h-15 px-6 flex items-center justify-between h-[60px]">
      <Link to="/dashboard" className="text-white font-bold text-xl tracking-tight">
        HealthDesk
      </Link>

      {user && (
        <div className="flex items-center gap-5 text-sm">
          <Link to="/dashboard"    className="text-white/90 hover:text-white transition">Dashboard</Link>
          <Link to="/appointments" className="text-white/90 hover:text-white transition">Appointments</Link>
          {user.role === 'PATIENT' && (
            <Link to="/appointments/book" className="text-white/90 hover:text-white transition">Book</Link>
          )}
          {(user.role === 'DOCTOR' || user.role === 'RECEPTIONIST') && (
            <Link to="/emr" className="text-white/90 hover:text-white transition">EMR</Link>
          )}
          {user.role === 'PATIENT' && (
            <Link to="/my-records" className="text-white/90 hover:text-white transition">My Records</Link>
          )}

          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${roleColors[user.role]}`}>
            {user.role}
          </span>
          <span className="text-white/80 text-sm hidden sm:inline">{user.name}</span>

          <button
            onClick={handleLogout}
            className="bg-white/20 hover:bg-white/30 text-white text-sm px-3 py-1.5 rounded-md transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}
