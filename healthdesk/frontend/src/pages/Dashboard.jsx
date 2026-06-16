import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Card from '../components/Card'

const roleColorClass = {
  PATIENT:      'bg-green-100 text-green-800',
  DOCTOR:       'bg-brand-light text-brand',
  RECEPTIONIST: 'bg-purple-100 text-purple-800',
}

const roleCards = {
  PATIENT: [
    { title: 'Book Appointment', desc: 'Schedule a visit with a doctor', link: '/appointments/book', icon: '📅' },
    { title: 'My Appointments',  desc: 'View upcoming & past appointments', link: '/appointments',      icon: '🗓️' },
    { title: 'My Records',       desc: 'View your EMR & download prescriptions', link: '/my-records',  icon: '📋' },
  ],
  DOCTOR: [
    { title: 'My Schedule', desc: 'View your upcoming appointments',   link: '/appointments', icon: '🗓️' },
    { title: 'EMR Records', desc: 'View & create patient records',     link: '/emr',          icon: '📋' },
    { title: 'New EMR',     desc: 'Create a new medical record',       link: '/emr/new',      icon: '✏️'  },
  ],
  RECEPTIONIST: [
    { title: 'All Appointments', desc: 'Manage all clinic appointments', link: '/appointments', icon: '📅' },
    { title: 'EMR Records',      desc: 'Access patient medical records', link: '/emr',          icon: '📋' },
  ],
}

export default function Dashboard() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user.name} 👋</h1>
        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${roleColorClass[user.role]}`}>
          {user.role}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {(roleCards[user.role] || []).map(card => (
          <Link key={card.link} to={card.link} className="group">
            <Card className="h-full cursor-pointer transition hover:shadow-md hover:-translate-y-0.5">
              <div className="text-4xl mb-3">{card.icon}</div>
              <h3 className="font-semibold text-brand text-lg mb-1">{card.title}</h3>
              <p className="text-sm text-gray-500">{card.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
