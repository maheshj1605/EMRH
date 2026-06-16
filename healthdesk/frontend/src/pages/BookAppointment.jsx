import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { userAPI, appointmentAPI } from '../services/api'
import Card from '../components/Card'
import Button from '../components/Button'
import Alert from '../components/Alert'

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([])
  const [form, setForm]       = useState({ doctorId: '', appointmentTime: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    userAPI.getDoctors()
      .then(r => setDoctors(r.data))
      .catch(() => setError('Could not load doctors. Please try again.'))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await appointmentAPI.book({
        doctorId:        parseInt(form.doctorId),
        appointmentTime: form.appointmentTime,
        notes:           form.notes,
      })
      navigate('/appointments')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <Card>
        <h2 className="text-2xl font-bold text-brand mb-6">Book Appointment</h2>
        <Alert message={error} />
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-medium">Select Doctor</label>
            <select value={form.doctorId} onChange={e => setForm({...form, doctorId: e.target.value})} required>
              <option value="">Choose a doctor…</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>
                  Dr. {d.name}{d.specialization ? ` — ${d.specialization}` : ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-medium">Appointment Date & Time</label>
            <input type="datetime-local" value={form.appointmentTime}
              onChange={e => setForm({...form, appointmentTime: e.target.value})} required />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-medium">Reason / Notes (optional)</label>
            <textarea rows={3} placeholder="Describe your symptoms or reason for visit…"
              value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-vertical
                         focus:outline-none focus:ring-2 focus:ring-brand" />
          </div>
          <Button type="submit" disabled={loading} className="w-full py-2.5">
            {loading ? 'Booking…' : 'Confirm Appointment'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
