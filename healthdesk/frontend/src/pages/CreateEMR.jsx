import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { userAPI, emrAPI } from '../services/api'
import Card from '../components/Card'
import Button from '../components/Button'
import Alert from '../components/Alert'

export default function CreateEMR() {
  const [patients, setPatients] = useState([])
  const [form, setForm]         = useState({ patientId: '', diagnosis: '', prescription: '', notes: '' })
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    userAPI.getPatients()
      .then(r => setPatients(r.data))
      .catch(() => setError('Could not load patient list.'))
  }, [])

  const textareaClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-vertical focus:outline-none focus:ring-2 focus:ring-brand"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await emrAPI.create({ ...form, patientId: parseInt(form.patientId) })
      navigate('/emr')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <Card>
        <h2 className="text-2xl font-bold text-brand mb-6">New EMR Record</h2>
        <Alert message={error} />
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-medium">Patient</label>
            <select value={form.patientId} onChange={e => setForm({...form, patientId: e.target.value})} required>
              <option value="">Select patient…</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-medium">Diagnosis <span className="text-red-400">*</span></label>
            <textarea rows={3} placeholder="Enter diagnosis…" required
              value={form.diagnosis} onChange={e => setForm({...form, diagnosis: e.target.value})}
              className={textareaClass} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-medium">Prescription (Rx)</label>
            <textarea rows={4} placeholder="Medications and dosage…"
              value={form.prescription} onChange={e => setForm({...form, prescription: e.target.value})}
              className={textareaClass} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-medium">Additional Notes</label>
            <textarea rows={3} placeholder="Follow-up instructions, allergies, etc."
              value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
              className={textareaClass} />
          </div>
          <Button type="submit" disabled={loading} className="w-full py-2.5">
            {loading ? 'Saving…' : 'Create EMR Record'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
