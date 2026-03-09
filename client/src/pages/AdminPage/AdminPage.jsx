import { useState, useEffect } from 'react'
import { adminGetTools, adminDeleteTool } from '../../services/api.js'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner.jsx'
import styles from './AdminPage.module.css'

const CATEGORY_COLORS = {
  language: '#c084fc', runtime: '#4ade80', ide: '#60a5fa',
  database: '#facc15', vcs: '#fb923c', communication: '#2dd4bf',
  utility: '#94a3b8', build: '#f87171'
}

export default function AdminPage() {
  const [token, setToken] = useState('')
  const [authed, setAuthed] = useState(false)
  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await adminGetTools(token)
      setTools(data)
      setAuthed(true)
    } catch (err) {
      setError('Invalid token or server error.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeactivate = async (tool) => {
    if (!confirm(`Deactivate "${tool.name}"? It will no longer appear in the tool selection.`)) return
    try {
      await adminDeleteTool(token, tool._id)
      setTools(prev => prev.map(t => t._id === tool._id ? { ...t, isActive: false } : t))
      showToast(`✓ ${tool.name} deactivated`)
    } catch (err) {
      showToast(`Failed: ${err.message}`, 'error')
    }
  }

  if (!authed) {
    return (
      <div className={styles.page}>
        <div className={styles.loginBox}>
          <div className={styles.loginIcon}>🔐</div>
          <h1 className={styles.loginTitle}>Admin Access</h1>
          <p className={styles.loginSub}>Enter your admin token to manage tools.</p>
          <form onSubmit={handleAuth} className={styles.loginForm}>
            <input
              type="password"
              className={`form-control ${styles.tokenInput}`}
              placeholder="Admin token..."
              value={token}
              onChange={e => setToken(e.target.value)}
              autoFocus
            />
            {error && <div className={styles.loginError}>{error}</div>}
            <button type="submit" className={styles.loginBtn} disabled={loading || !token}>
              {loading ? 'Verifying...' : 'Access Admin Panel →'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {toast && <div className={`${styles.toast} ${styles[`toast_${toast.type}`]}`}>{toast.msg}</div>}
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Admin Panel</h1>
          <p className={styles.pageSub}>Manage tools, versions, and configurations.</p>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}><strong>{tools.length}</strong><span>Total</span></div>
          <div className={styles.stat}><strong>{tools.filter(t => t.isActive).length}</strong><span>Active</span></div>
          <div className={styles.stat}><strong>{tools.filter(t => !t.isActive).length}</strong><span>Inactive</span></div>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tool</th>
              <th>Category</th>
              <th>Versions</th>
              <th>Verify CMD</th>
              <th>Prereqs</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tools.map(tool => (
              <tr key={tool._id} className={!tool.isActive ? styles.inactiveRow : ''}>
                <td>
                  <div className={styles.toolCell}>
                    <span className={styles.toolEmoji}>{tool.icon}</span>
                    <div>
                      <div className={styles.toolName}>{tool.name}</div>
                      <code className={styles.toolSlug}>{tool.slug}</code>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge badge-${tool.category}`}>{tool.category}</span>
                </td>
                <td>
                  <div className={styles.versions}>
                    {tool.versions.map(v => (
                      <code key={v.version} className={styles.versionTag}>{v.version}</code>
                    ))}
                  </div>
                </td>
                <td><code className={styles.cmdText}>{tool.verifyCommand || '—'}</code></td>
                <td>
                  {tool.prerequisites?.length > 0
                    ? tool.prerequisites.map(p => <code key={p} className={styles.prereqTag}>{p}</code>)
                    : <span className={styles.noneText}>none</span>
                  }
                </td>
                <td>
                  <span className={tool.isActive ? styles.statusActive : styles.statusInactive}>
                    {tool.isActive ? '● Active' : '○ Inactive'}
                  </span>
                </td>
                <td>
                  {tool.isActive && (
                    <button className={styles.deactivateBtn} onClick={() => handleDeactivate(tool)}>
                      Deactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
