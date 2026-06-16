import { useState, useEffect } from 'react'
import { emrAPI } from '../services/api'
import Card from '../components/Card'
import Button from '../components/Button'
import Alert from '../components/Alert'

export default function PatientRecords() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    emrAPI.getMine()
      .then(r => setRecords(r.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

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

  if (loading) return (
    <div className="flex justify-center items-center min-h-[200px] text-gray-500">
      Loading your records…
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-brand mb-6">My Medical Records</h2>
      <Alert message={error} />
      {records.length === 0 ? (
        <Card><p className="text-gray-500 text-center py-4">No medical records found.</p></Card>
      ) : (
        <div className="flex flex-col gap-4">
          {records.map(r => (
            <Card key={r.id}>
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-gray-700 mb-2">
                    Visit: {r.visitDate} &nbsp;·&nbsp; Dr. {r.doctor?.name}
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
      )}
    </div>
  )
}
