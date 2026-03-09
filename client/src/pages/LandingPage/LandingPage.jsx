import { Link } from 'react-router-dom'
import styles from './LandingPage.module.css'

const TOOLS_GRID = [
  { icon: '🐍', name: 'Python' }, { icon: '🟢', name: 'Node.js' }, { icon: '☕', name: 'JDK' },
  { icon: '🔀', name: 'Git' }, { icon: '💙', name: 'VS Code' }, { icon: '🌑', name: 'Eclipse' },
  { icon: '🖥️', name: 'Turbo C++' }, { icon: '🍃', name: 'MongoDB' }, { icon: '🐬', name: 'MySQL' },
  { icon: '🐘', name: 'PostgreSQL' }, { icon: '📹', name: 'Zoom' }, { icon: '📮', name: 'Postman' },
  { icon: '🐳', name: 'Docker' }, { icon: '🧠', name: 'IntelliJ' }, { icon: '🎮', name: 'Discord' },
  { icon: '📊', name: 'draw.io' }
]

const STEPS = [
  { num: '01', icon: '☑️', title: 'Select Tools', desc: 'Pick from 20+ developer tools across languages, IDEs, databases, and utilities.' },
  { num: '02', icon: '🎛️', title: 'Configure Versions', desc: 'Choose exact versions for each tool — always the latest, or lock a specific one.' },
  { num: '03', icon: '⬇️', title: 'Download & Run', desc: 'Get a ready-to-run .bat file. Right-click → Run as Administrator. Done.' }
]

const PROBLEMS = [
  { icon: '⏱', text: 'Hours wasted downloading installers one by one' },
  { icon: '❌', text: 'Wrong versions causing project conflicts' },
  { icon: '🔁', text: 'Setting up the same env on every new PC' },
  { icon: '😩', text: 'Forgetting to set PATH or JAVA_HOME variables' }
]

export default function LandingPage() {
  return (
    <main className={styles.page}>
      {/* HERO */}
      <section className={`${styles.hero} scanlines`}>
        <div className={styles.heroGrid} />
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Windows Automation Tool
          </div>
          <h1 className={styles.heroTitle}>
            Your entire dev environment.<br />
            <span className={styles.heroAccent}>One .bat file.</span>
          </h1>
          <p className={styles.heroSub}>
            Select the tools you need, configure versions, and download a Windows batch script
            that silently installs everything — Python, Node.js, JDK, Turbo C++, Zoom, and more.
          </p>
          <div className={styles.heroCtas}>
            <Link to="/select" className={styles.ctaPrimary}>
              Generate My Setup Script <span>→</span>
            </Link>
            <a href="#how-it-works" className={styles.ctaSecondary}>See how it works</a>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}><strong>20+</strong> <span>tools</span></div>
            <div className={styles.statDivider} />
            <div className={styles.stat}><strong>0</strong> <span>manual clicks</span></div>
            <div className={styles.statDivider} />
            <div className={styles.stat}><strong>100%</strong> <span>Windows native</span></div>
          </div>
        </div>
        <div className={styles.heroTerminal}>
          <div className={styles.terminalBar}>
            <span style={{color:'#ff5f57'}}>●</span>
            <span style={{color:'#ffbd2e'}}>●</span>
            <span style={{color:'#28c840'}}>●</span>
            <span className={styles.terminalTitle}>devsetup_script.bat</span>
          </div>
          <div className={styles.terminalBody}>
            <div className={styles.termLine}><span className={styles.termPrompt}>C:\&gt;</span> devsetup_script.bat</div>
            <div className={styles.termLine}><span className={styles.termOk}>[INFO]</span> Automated Developer Environment Setup</div>
            <div className={styles.termLine}><span className={styles.termOk}>[1/6]</span> Installing Python 3.13.0...</div>
            <div className={styles.termLine}><span className={styles.termOk}>[OK]</span>  Python installed successfully.</div>
            <div className={styles.termLine}><span className={styles.termOk}>[2/6]</span> Installing Node.js 22.x LTS...</div>
            <div className={styles.termLine}><span className={styles.termOk}>[OK]</span>  Node.js installed successfully.</div>
            <div className={styles.termLine}><span className={styles.termOk}>[3/6]</span> Installing Git 2.47.0...</div>
            <div className={styles.termLine}><span className={styles.termOk}>[OK]</span>  Git verified in PATH.</div>
            <div className={styles.termLine}><span className={styles.termOk}>[4/6]</span> Installing VS Code...</div>
            <div className={styles.termLine}><span className={styles.termOk}>[5/6]</span> Installing JDK 21 LTS...</div>
            <div className={styles.termLine}><span className={styles.termOk}>[OK]</span>  JAVA_HOME configured.</div>
            <div className={styles.termLine}><span className={styles.termGreen}>[DONE]</span> Installation complete! 🎉</div>
            <div className={`${styles.termLine} cursor`} style={{color:'var(--text-muted)'}}>_</div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className={styles.problemSection}>
        <div className={styles.container}>
          <div className={styles.problemInner}>
            <div className={styles.problemText}>
              <span className={styles.sectionTag}>The Problem</span>
              <h2 className={styles.sectionTitle}>Manual setup is a <span className={styles.heroAccent}>time sink.</span></h2>
              <p className={styles.sectionSub}>Every time you get a new laptop or reinstall Windows, you spend hours hunting for installers, setting environment variables, and debugging PATH issues.</p>
            </div>
            <div className={styles.problemList}>
              {PROBLEMS.map((p, i) => (
                <div key={i} className={styles.problemItem}>
                  <span className={styles.problemIcon}>{p.icon}</span>
                  <span>{p.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className={styles.stepsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>How It Works</span>
            <h2 className={styles.sectionTitle}>Three steps to a <span className={styles.heroAccent}>ready machine.</span></h2>
          </div>
          <div className={styles.stepsGrid}>
            {STEPS.map((s, i) => (
              <div key={i} className={`ds-card ${styles.stepCard}`}>
                <div className={styles.stepNum}>{s.num}</div>
                <div className={styles.stepIcon}>{s.icon}</div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOOLS GRID */}
      <section className={styles.toolsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Supported Tools</span>
            <h2 className={styles.sectionTitle}>Everything a <span className={styles.heroAccent}>college dev needs.</span></h2>
            <p className={styles.sectionSub}>From Turbo C++ for your DS lab to Docker for your internship — all in one script.</p>
          </div>
          <div className={styles.toolsGrid}>
            {TOOLS_GRID.map((t, i) => (
              <div key={i} className={`ds-card ${styles.toolChip}`}>
                <span className={styles.toolChipIcon}>{t.icon}</span>
                <span className={styles.toolChipName}>{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaBox}>
            <div className={styles.ctaGlow} />
            <h2 className={styles.ctaTitle}>Ready to automate your setup?</h2>
            <p className={styles.ctaSub}>Takes 2 minutes to configure. Script runs in the background. Never do it manually again.</p>
            <Link to="/select" className={styles.ctaPrimary}>
              Build My Dev Script →
            </Link>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <span>DevSetup Generator — Windows Only ·</span>
          <span style={{color:'var(--text-muted)'}}> .bat scripts that actually work</span>
        </div>
      </footer>
    </main>
  )
}
