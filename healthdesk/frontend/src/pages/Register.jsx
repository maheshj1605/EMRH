import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Card from '../components/Card'
import Button from '../components/Button'
import Alert from '../components/Alert'

export default function Register() {
  const [form, setForm]       = useState({ name:'', email:'', password:'', role:'PATIENT', phone:'', specialization:'' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login }  = useAuth()
  const navigate   = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { data } = await authAPI.register(form)
      login(data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-60px)] px-4 py-8">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-brand mb-6">Create Account</h2>
        <Alert message={error} />
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <input placeholder="Full Name" value={form.name}
            onChange={e => setForm({...form, name: e.target.value})} required />
          <input type="email" placeholder="Email" value={form.email}
            onChange={e => setForm({...form, email: e.target.value})} required />
          <input type="password" placeholder="Password (min 6 chars)" value={form.password}
            onChange={e => setForm({...form, password: e.target.value})} required minLength={6} />
          <input placeholder="Phone (optional)" value={form.phone}
            onChange={e => setForm({...form, phone: e.target.value})} />
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-medium">Role</label>
            <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
              <option value="RECEPTIONIST">Receptionist</option>
            </select>
          </div>
          {form.role === 'DOCTOR' && (
            <input placeholder="Specialization (e.g. Cardiologist)" value={form.specialization}
              onChange={e => setForm({...form, specialization: e.target.value})} />
          )}
          <Button type="submit" disabled={loading} className="w-full py-2.5">
            {loading ? 'Registering…' : 'Create Account'}
          </Button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-brand font-medium hover:underline">Sign In</Link>
        </p>
      </Card>
    </div>
  )
}
