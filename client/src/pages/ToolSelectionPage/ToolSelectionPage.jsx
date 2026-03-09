import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTools } from '../../hooks/useTools.js'
import { useScriptGenerator } from '../../hooks/useScriptGenerator.js'
import ToolCard from '../../components/ToolCard/ToolCard.jsx'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner.jsx'
import { PRESET_PROFILES, CATEGORY_LABELS, CATEGORY_ORDER } from '../../constants/toolDefaults.js'
import styles from './ToolSelectionPage.module.css'

export default function ToolSelectionPage() {
  const { tools, loading, error } = useTools()
  const { generate, loading: generating, error: genError } = useScriptGenerator()
  const navigate = useNavigate()

  const [selectedTools, setSelectedTools] = useState({})  // { toolId: { tool, version } }
  const [activeCategory, setActiveCategory] = useState('all')
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const toolsByCategory = useMemo(() => {
    const map = {}
    tools.forEach(t => {
      if (!map[t.category]) map[t.category] = []
      map[t.category].push(t)
    })
    return map
  }, [tools])

  const categories = useMemo(() =>
    CATEGORY_ORDER.filter(c => toolsByCategory[c]?.length > 0), [toolsByCategory])

  const filteredTools = useMemo(() =>
    activeCategory === 'all' ? tools : (toolsByCategory[activeCategory] || []),
    [activeCategory, tools, toolsByCategory])

  const handleToggle = (tool) => {
    setSelectedTools(prev => {
      const next = { ...prev }
      if (next[tool._id]) {
        // Deselect
        delete next[tool._id]
      } else {
        // Auto-add missing prerequisites
        const missingPrereqs = (tool.prerequisites || []).filter(
          prereq => !Object.values(next).some(s => s.tool.slug === prereq)
        )
        if (missingPrereqs.length > 0) {
          showToast(`⚠ ${tool.name} requires ${missingPrereqs.join(', ')} — added automatically.`, 'warn')
          missingPrereqs.forEach(prereqSlug => {
            const prereqTool = tools.find(t => t.slug === prereqSlug)
            if (prereqTool && !next[prereqTool._id]) {
              next[prereqTool._id] = { tool: prereqTool, version: prereqTool.versions[0]?.version }
            }
          })
        }
        next[tool._id] = { tool, version: tool.versions[0]?.version }
      }
      return next
    })
  }

  const handleVersionChange = (toolId, version) => {
    setSelectedTools(prev => ({
      ...prev,
      [toolId]: { ...prev[toolId], version }
    }))
  }

  const applyPreset = (preset) => {
    const newSelected = {}
    preset.slugs.forEach(slug => {
      const tool = tools.find(t => t.slug === slug)
      if (tool) newSelected[tool._id] = { tool, version: tool.versions[0]?.version }
    })
    setSelectedTools(newSelected)
    showToast(`✓ Applied "${preset.label}" preset`, 'success')
  }

  const handleGenerate = async () => {
    // FIX: pass correct field names that the API + hook expect
    // useScriptGenerator expects: [{ _id, selectedVersion }]
    // the hook maps these to: { toolId: t._id, version: t.selectedVersion }
    const payload = Object.values(selectedTools).map(({ tool, version }) => ({
      _id: tool._id,
      selectedVersion: version
    }))

    const result = await generate(payload)
    if (result) {
      navigate(`/output/${result.shareId}`)
    } else {
      showToast(`⚠ Failed to generate script. Check server is running.`, 'error')
    }
  }

  const selectedCount = Object.keys(selectedTools).length

  if (loading) return <div className={styles.page}><LoadingSpinner text="Loading tools..." /></div>
  if (error) return (
    <div className={styles.page}>
      <div className={styles.fullError}>
        <span>⚠ Could not load tools: {error}</span>
        <p>Make sure the server is running on port 5000.</p>
      </div>
    </div>
  )

  return (
    <div className={styles.page}>
      {toast && (
        <div className={`${styles.toast} ${styles[`toast_${toast.type}`]}`}>{toast.msg}</div>
      )}

      <div className={styles.layout}>
        {/* MAIN CONTENT */}
        <div className={styles.main}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Select Your Tools</h1>
            <p className={styles.pageSub}>Pick tools and versions — we'll generate a ready-to-run .bat script.</p>
          </div>

          {/* Presets */}
          <div className={styles.presetsRow}>
            <span className={styles.presetsLabel}>Quick Presets:</span>
            <div className={styles.presetBtns}>
              {PRESET_PROFILES.map(p => (
                <button
                  key={p.id}
                  className={styles.presetBtn}
                  onClick={() => applyPreset(p)}
                  title={p.description}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category tabs */}
          <div className={styles.categoryTabs}>
            <button
              className={`${styles.catTab} ${activeCategory === 'all' ? styles.catTabActive : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All ({tools.length})
            </button>
            {categories.map(c => (
              <button
                key={c}
                className={`${styles.catTab} ${activeCategory === c ? styles.catTabActive : ''}`}
                onClick={() => setActiveCategory(c)}
              >
                {CATEGORY_LABELS[c]} ({toolsByCategory[c].length})
              </button>
            ))}
          </div>

          {/* Tools grid */}
          <div className={styles.toolsGrid}>
            {filteredTools.map(tool => (
              <ToolCard
                key={tool._id}
                tool={tool}
                isSelected={!!selectedTools[tool._id]}
                selectedVersion={selectedTools[tool._id]?.version}
                onToggle={handleToggle}
                onVersionChange={handleVersionChange}
              />
            ))}
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarInner}>
            <div className={styles.sidebarHeader}>
              <h2 className={styles.sidebarTitle}>Selected Tools</h2>
              <span className={styles.sidebarCount}>{selectedCount}</span>
            </div>

            {selectedCount === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>📋</span>
                <p>No tools selected yet.</p>
                <p>Click any card to add it.</p>
              </div>
            ) : (
              <div className={styles.selectedList}>
                {Object.values(selectedTools).map(({ tool, version }) => (
                  <div key={tool._id} className={styles.selectedItem}>
                    <span className={styles.selectedIcon}>{tool.icon}</span>
                    <div className={styles.selectedInfo}>
                      <span className={styles.selectedName}>{tool.name}</span>
                      <code className={styles.selectedVersion}>{version}</code>
                    </div>
                    <button className={styles.removeBtn} onClick={() => handleToggle(tool)}>✕</button>
                  </div>
                ))}
              </div>
            )}

            {selectedCount > 0 && (
              <div className={styles.sidebarActions}>
                <button className={styles.clearBtn} onClick={() => setSelectedTools({})}>
                  Clear All
                </button>
                <button
                  className={styles.generateBtn}
                  onClick={handleGenerate}
                  disabled={generating}
                >
                  {generating
                    ? <><span className={styles.btnSpinner} /> Generating...</>
                    : <>Generate .bat Script →</>
                  }
                </button>
              </div>
            )}

            {selectedCount === 0 && (
              <button className={styles.generateBtnDisabled} disabled>
                Select tools to generate
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
