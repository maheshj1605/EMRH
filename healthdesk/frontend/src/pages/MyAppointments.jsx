import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { appointmentAPI } from '../services/api'
import Card from '../components/Card'
import Button from '../components/Button'
import Alert from '../components/Alert'

const statusStyle = {
  SCHEDULED: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-700',
}

export default function MyAppointments() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')

  const fetchData = useCallback(() => {
    setLoading(true)
    const fn = user.role === 'RECEPTIONIST' ? appointmentAPI.getAll : appointmentAPI.getMine
    fn()
      .then(r => setAppointments(r.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [user.role])

  useEffect(() => { fetchData() }, [fetchData])

  const updateStatus = async (id, status) => {
    try {
      await appointmentAPI.updateStatus(id, status)
      fetchData()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="text-gray-500">Loading appointments…</div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-brand mb-6">
        {user.role === 'RECEPTIONIST' ? 'All Appointments' : 'My Appointments'}
      </h2>
      <Alert message={error} />
      {appointments.length === 0 ? (
        <Card><p className="text-gray-500 text-center py-4">No appointments found.</p></Card>
      ) : (
        <div className="flex flex-col gap-4">
          {appointments.map(a => (
            <Card key={a.id} className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <p className="font-semibold text-gray-800">
                  {user.role === 'PATIENT' ? `Dr. ${a.doctor?.name}` : a.patient?.name}
                  {user.role === 'RECEPTIONIST' && (
                    <span className="text-gray-400 font-normal"> → Dr. {a.doctor?.name}</span>
                  )}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(a.appointmentTime).toLocaleString()}
                </p>
                {a.notes && <p className="text-sm text-gray-400 mt-1 italic">"{a.notes}"</p>}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle[a.status]}`}>
                  {a.status}
                </span>
                {(user.role === 'DOCTOR' || user.role === 'RECEPTIONIST') && a.status === 'SCHEDULED' && (
                  <>
                    <Button variant="secondary" className="text-xs py-1 px-3"
                      onClick={() => updateStatus(a.id, 'COMPLETED')}>Complete</Button>
                    <Button variant="danger"    className="text-xs py-1 px-3"
                      onClick={() => updateStatus(a.id, 'CANCELLED')}>Cancel</Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
