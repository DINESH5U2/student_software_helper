import { useState } from 'react'
import { generateScript } from '../services/api.js'

export const useScriptGenerator = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const generate = async (selectedTools) => {
    try {
      setLoading(true)
      setError(null)
      const payload = {
        selectedTools: selectedTools.map(t => ({
          toolId: t._id,
          version: t.selectedVersion
        }))
      }
      const data = await generateScript(payload)
      setResult(data)
      return data
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { generate, loading, error, result }
}
