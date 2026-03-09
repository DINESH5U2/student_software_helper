import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import styles from './ScriptPreview.module.css'

export default function ScriptPreview({ script }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.titleBar}>
        <div className={styles.dots}>
          <span className={styles.dot} style={{ background: '#ff5f57' }} />
          <span className={styles.dot} style={{ background: '#ffbd2e' }} />
          <span className={styles.dot} style={{ background: '#28c840' }} />
        </div>
        <span className={styles.filename}>devsetup_script.bat</span>
        <span className={styles.lines}>{script.split('\n').length} lines</span>
      </div>
      <div className={styles.codeWrapper}>
        <SyntaxHighlighter
          language="batch"
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            background: '#080b10',
            fontSize: '12px',
            fontFamily: 'JetBrains Mono, monospace',
            padding: '1.25rem',
            borderRadius: '0 0 10px 10px',
            maxHeight: '520px',
            overflowY: 'auto'
          }}
          showLineNumbers
          lineNumberStyle={{ color: '#2d3748', minWidth: '2.5em' }}
        >
          {script}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
