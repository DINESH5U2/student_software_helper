import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getScriptByShareId, getDownloadUrl } from '../../services/api.js'
import ScriptPreview from '../../components/ScriptPreview/ScriptPreview.jsx'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner.jsx'
import styles from './ScriptOutputPage.module.css'

const DRY_RUN_LINES = [
  { text: 'Automated Developer Environment Setup', type: 'header' },
  { text: 'Press any key to begin installation...', type: 'info' },
  { text: '', type: 'blank' },
  { text: '[1/?] Downloading installer...', type: 'step' },
  { text: '[INFO] Running installer silently...', type: 'info' },
  { text: '[OK] Tool installed.', type: 'ok' },
  { text: '[INFO] Verifying PATH...', type: 'info' },
  { text: '[OK] Verified in PATH.', type: 'ok' },
  { text: '[OK] TOOL_HOME set.', type: 'ok' },
  { text: '', type: 'blank' },
  { text: '[DONE] Installation complete! Restart terminal.', type: 'done' },
]

export default function ScriptOutputPage() {
  const { shareId } = useParams()
  const [scriptData, setScriptData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [dryRunLines, setDryRunLines] = useState([])
  const [dryRunActive, setDryRunActive] = useState(false)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  useEffect(() => {
    const fetchScript = async () => {
      try {
        const data = await getScriptByShareId(shareId)
        setScriptData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchScript()
  }, [shareId])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(scriptData.generatedScript)
      showToast('✓ Script copied to clipboard!')
    } catch {
      showToast('Failed to copy', 'error')
    }
  }

  const handleDownload = () => {
    const url = getDownloadUrl(shareId)
    const a = document.createElement('a')
    a.href = url
    a.download = `devsetup_${shareId}.bat`
    a.click()
    showToast('✓ Download started!')
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      showToast('✓ Share URL copied!')
    } catch {
      showToast('Failed to copy URL', 'error')
    }
  }

  const runDryRun = () => {
    setDryRunLines([])
    setDryRunActive(true)
    const lines = scriptData.selectedTools.flatMap((t, i) => [
      { text: `[${i + 1}/${scriptData.selectedTools.length}] Installing ${t.toolName} ${t.version}...`, type: 'step' },
      { text: `[INFO] Downloading installer...`, type: 'info' },
      { text: `[INFO] Running silent install...`, type: 'info' },
      { text: `[OK] ${t.toolName} installed successfully.`, type: 'ok' },
      { text: `[OK] PATH verified for ${t.toolName}.`, type: 'ok' },
      { text: '', type: 'blank' },
    ])
    lines.push({ text: '✓ All tools installed! Restart your terminal.', type: 'done' })

    let i = 0
    const interval = setInterval(() => {
      if (i < lines.length) {
        setDryRunLines(prev => [...prev, lines[i]])
        i++
      } else {
        clearInterval(interval)
      }
    }, 180)
  }

  if (loading) return <div className={styles.page}><LoadingSpinner text="Loading script..." /></div>
  if (error) return (
    <div className={styles.page}>
      <div className={styles.errorBox}>
        <h2>⚠ Script not found</h2>
        <p>{error}</p>
        <Link to="/select" className={styles.backLink}>← Build a new script</Link>
      </div>
    </div>
  )

  return (
    <div className={styles.page}>
      {toast && <div className={`${styles.toast} ${styles[`toast_${toast.type}`]}`}>{toast.msg}</div>}

      <div className={styles.pageHeader}>
        <div>
          <Link to="/select" className={styles.backLink}>← Back to tool selection</Link>
          <h1 className={styles.pageTitle}>Your Setup Script is Ready</h1>
          <p className={styles.pageSub}>
            Run this file as Administrator on any Windows machine to install all selected tools.
          </p>
        </div>
        <div className={styles.actionBtns}>
          <button className={styles.btnAction} onClick={handleCopy}>📋 Copy Script</button>
          <button className={styles.btnAction} onClick={handleShare}>🔗 Copy Share Link</button>
          <button className={styles.btnDownload} onClick={handleDownload}>⬇ Download .bat</button>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Script preview */}
        <div className={styles.scriptCol}>
          <div className={styles.sectionLabel}>Generated Batch Script</div>
          <ScriptPreview script={scriptData.generatedScript} />

          {/* Dry Run */}
          <div className={styles.dryRunSection}>
            <div className={styles.dryRunHeader}>
              <div>
                <div className={styles.sectionLabel}>Dry Run Preview</div>
                <p className={styles.dryRunSub}>Visual simulation — no actual installation occurs.</p>
              </div>
              <button className={styles.dryRunBtn} onClick={runDryRun}>▶ Run Simulation</button>
            </div>
            {dryRunActive && (
              <div className={styles.dryRunTerminal}>
                {dryRunLines.map((line, i) => (
                  <div key={i} className={`${styles.dryLine} ${styles[`dryLine_${line.type}`]}`}>
                    {line.text}
                  </div>
                ))}
                {dryRunLines.length > 0 && dryRunLines[dryRunLines.length - 1]?.type !== 'done' && (
                  <div className={`${styles.dryLine} cursor`} style={{color:'var(--text-muted)'}}>_</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Summary sidebar */}
        <aside className={styles.summaryCol}>
          <div className={styles.sectionLabel}>Tools Included</div>
          <div className={styles.summaryList}>
            {scriptData.selectedTools.map((t, i) => (
              <div key={i} className={styles.summaryItem}>
                <div className={styles.summaryNum}>{String(i + 1).padStart(2, '0')}</div>
                <div className={styles.summaryInfo}>
                  <span className={styles.summaryName}>{t.toolName}</span>
                  <code className={styles.summaryVersion}>{t.version}</code>
                </div>
                <span className={styles.summaryCheck}>✓</span>
              </div>
            ))}
          </div>

          <div className={styles.infoBox}>
            <div className={styles.infoTitle}>📌 How to use</div>
            <ol className={styles.infoSteps}>
              <li>Download the <code>.bat</code> file</li>
              <li>Right-click → <strong>Run as Administrator</strong></li>
              <li>Keep the window open while it runs</li>
              <li>Restart your terminal when done</li>
            </ol>
          </div>

          <div className={styles.shareBox}>
            <div className={styles.infoTitle}>🔗 Share this script</div>
            <div className={styles.shareUrl}>{window.location.href}</div>
            <p className={styles.shareNote}>Link expires in 7 days</p>
          </div>

          <Link to="/select" className={styles.newScriptBtn}>+ Build Another Script</Link>
        </aside>
      </div>
    </div>
  )
}
