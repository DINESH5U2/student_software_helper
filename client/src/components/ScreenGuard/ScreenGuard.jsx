import { useScreenGuard } from '../../hooks/useScreenGuard.js'
import styles from './ScreenGuard.module.css'

export default function ScreenGuard({ children }) {
  const isBlocked = useScreenGuard()
  if (!isBlocked) return children
  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <div className={styles.icon}>🖥️</div>
        <h1 className={styles.title}>Desktop Only</h1>
        <p className={styles.message}>
          This application is designed for desktop use only.<br />
          Please open it on a <strong>Windows laptop or desktop</strong><br />
          with a screen width of at least 1024px.
        </p>
        <div className={styles.hint}><code>Minimum width: 1024px</code></div>
      </div>
    </div>
  )
}
