const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const handleResponse = async (res) => {
  const data = await res.json()
  if (!res.ok || !data.success) throw new Error(data.error || 'Request failed')
  return data.data
}

export const getTools = async () => {
  const res = await fetch(`${BASE_URL}/tools`)
  return handleResponse(res)
}

export const getToolVersions = async (slug) => {
  const res = await fetch(`${BASE_URL}/tools/${slug}/versions`)
  return handleResponse(res)
}

export const generateScript = async (payload) => {
  const res = await fetch(`${BASE_URL}/scripts/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  return handleResponse(res)
}

export const getScriptByShareId = async (shareId) => {
  const res = await fetch(`${BASE_URL}/scripts/${shareId}`)
  return handleResponse(res)
}

export const getDownloadUrl = (shareId) =>
  `${BASE_URL}/scripts/${shareId}/download`

export const adminGetTools = async (token) => {
  const res = await fetch(`${BASE_URL}/admin/tools`, { headers: { 'x-admin-token': token } })
  return handleResponse(res)
}

export const adminCreateTool = async (token, toolData) => {
  const res = await fetch(`${BASE_URL}/admin/tools`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
    body: JSON.stringify(toolData)
  })
  return handleResponse(res)
}

export const adminUpdateTool = async (token, id, toolData) => {
  const res = await fetch(`${BASE_URL}/admin/tools/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
    body: JSON.stringify(toolData)
  })
  return handleResponse(res)
}

export const adminDeleteTool = async (token, id) => {
  const res = await fetch(`${BASE_URL}/admin/tools/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-token': token }
  })
  return handleResponse(res)
}
