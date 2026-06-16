import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { userAPI, emrAPI } from '../services/api'
import Card from '../components/Card'
import Button from '../components/Button'
import Alert from '../components/Alert'

export default function EMRList() {
  const { user } = useAuth()
  const [patients, setPatients]             = useState([])
  const [selectedPatient, setSelectedPatient] = useState('')
  const [records, setRecords]               = useState([])
  const [loading, setLoading]               = useState(false)
  const [error, setError]                   = useState('')

  useEffect(() => {
    userAPI.getPatients()
      .then(r => setPatients(r.data))
      .catch(() => setError('Could not load patient list.'))
  }, [])

  const loadRecords = (patientId) => {
    setSelectedPatient(patientId); setLoading(true); setRecords([])
    emrAPI.getByPatient(patientId)
      .then(r => setRecords(r.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }

  const downloadPdf = async (id) => {
    try {
      const { data } = await emrAPI.downloadPdf(id)
      const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url; a.download = `prescription_${id}.pdf`; a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-brand">EMR Records</h2>
        {user.role === 'DOCTOR' && (
          <Link to="/emr/new">
            <Button>+ New Record</Button>
          </Link>
        )}
      </div>

      <Alert message={error} />

      <Card className="mb-6">
        <label className="block text-xs text-gray-500 mb-1 font-medium">Select Patient</label>
        <select onChange={e => loadRecords(e.target.value)} defaultValue="">
          <option value="" disabled>Choose a patient…</option>
          {patients.map(p => (
            <option key={p.id} value={p.id}>{p.name} — {p.email}</option>
          ))}
        </select>
      </Card>

      {loading && <p className="text-center text-gray-500 py-4">Loading records…</p>}

      {!loading && selectedPatient && records.length === 0 && (
        <Card><p className="text-gray-500 text-center py-4">No EMR records for this patient.</p></Card>
      )}

      <div className="flex flex-col gap-4">
        {records.map(r => (
          <Card key={r.id}>
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div className="flex-1">
                <p className="font-semibold text-gray-700 mb-2">
                  Visit: {r.visitDate} &nbsp;·&nbsp; Dr. {r.doctor?.name}
                  {r.doctor?.specialization && <span className="text-gray-400"> ({r.doctor.specialization})</span>}
                </p>
                {r.diagnosis    && <p className="text-sm mb-1"><span className="font-medium">Diagnosis:</span> {r.diagnosis}</p>}
                {r.prescription && <p className="text-sm mb-1"><span className="font-medium">Rx:</span> {r.prescription}</p>}
                {r.notes        && <p className="text-sm text-gray-400 italic">{r.notes}</p>}
              </div>
              <Button variant="ghost" className="text-xs shrink-0" onClick={() => downloadPdf(r.id)}>
                📄 Download PDF
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
