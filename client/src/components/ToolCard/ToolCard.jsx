import styles from './ToolCard.module.css'

export default function ToolCard({ tool, isSelected, selectedVersion, onToggle, onVersionChange }) {
  const handleCheckboxClick = (e) => {
    e.stopPropagation()
    onToggle(tool)
  }

  const handleCardClick = () => onToggle(tool)

  const handleVersionChange = (e) => {
    e.stopPropagation()
    onVersionChange(tool._id, e.target.value)
  }

  return (
    <div
      className={`ds-card ${styles.card} ${isSelected ? 'selected' : ''}`}
      onClick={handleCardClick}
      role="checkbox"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
    >
      <div className={styles.header}>
        <div className={styles.iconName}>
          <span className={styles.icon}>{tool.icon}</span>
          <div>
            <div className={styles.name}>{tool.name}</div>
            <span className={`badge ${styles.catBadge} badge-${tool.category}`}>
              {tool.category}
            </span>
          </div>
        </div>
        <div
          className={`${styles.checkbox} ${isSelected ? styles.checked : ''}`}
          onClick={handleCheckboxClick}
        >
          {isSelected && <span>✓</span>}
        </div>
      </div>
      <p className={styles.description}>{tool.description}</p>
      {tool.prerequisites?.length > 0 && (
        <div className={styles.prereq}>
          <span className={styles.prereqLabel}>Requires:</span>
          {tool.prerequisites.map(p => (
            <code key={p} className={styles.prereqTag}>{p}</code>
          ))}
        </div>
      )}
      {isSelected && tool.versions?.length > 0 && (
        <div className={styles.versionRow} onClick={e => e.stopPropagation()}>
          <label className={styles.versionLabel}>Version</label>
          <select
            className="form-select form-select-sm"
            value={selectedVersion || tool.versions[0].version}
            onChange={handleVersionChange}
          >
            {tool.versions.map(v => (
              <option key={v.version} value={v.version}>{v.version}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
