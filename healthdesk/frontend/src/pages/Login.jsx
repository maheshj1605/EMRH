import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Card from '../components/Card'
import Button from '../components/Button'
import Alert from '../components/Alert'

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { data } = await authAPI.login(form)
      login(data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-60px)] px-4">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-brand mb-6">Sign In to HealthDesk</h2>
        <Alert message={error} />
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <input type="email"    placeholder="Email"    value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input type="password" placeholder="Password" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} required />
          <Button type="submit" disabled={loading} className="w-full py-2.5">
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          No account?{' '}
          <Link to="/register" className="text-brand font-medium hover:underline">Register</Link>
        </p>
      </Card>
    </div>
  )
}
