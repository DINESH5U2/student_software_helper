import { useState, useEffect } from 'react'
import { getTools } from '../services/api.js'

export const useTools = () => {
  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getTools()
        setTools(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchTools()
  }, [])

  return { tools, loading, error }
}
