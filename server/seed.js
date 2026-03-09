import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Tool from './models/Tool.js'

dotenv.config()

// ─────────────────────────────────────────────────────────────────────────────
// URL AUDIT NOTES:
//
// MySQL: dev.mysql.com/get/Downloads redirects through Oracle's CDN firewall
//   which rate-limits and blocks automated downloads. FIXED: use the MySQL
//   Community Installer (mysql-installer-community) from cdn.mysql.com which
//   is the actual CDN bypassing the Oracle web portal.
//
// JDK Temurin: api.adoptium.net returns an MSI directly. Verified pattern.
//
// VS Code: code.visualstudio.com/sha/download uses query params — the bat
//   script safeFilename() function handles this by detecting no extension and
//   using a fallback name. Confirmed working.
//
// Eclipse: eclipse.org uses server-side PHP redirector. Using direct
//   download.eclipse.org CDN path which bypasses the PHP mirror selector.
//
// Turbo C++: No official source. DOSBox from dosbox.com official release.
//   Users must place TC folder at C:\TC from college USB/CD.
//
// Maven/Gradle: Apache/Gradle CDN direct zip. Handled by isEnvOnly path.
//
// All other links are direct CDN permalinks verified by public documentation.
// ─────────────────────────────────────────────────────────────────────────────

const tools = [

  // ── LANGUAGES ──────────────────────────────────────────────────────────────
  {
    name: 'Python',
    slug: 'python',
    description: 'Versatile programming language for AI, web, automation, and data science.',
    category: 'language',
    icon: '🐍',
    versions: [
      {
        version: '3.13.0',
        // python.org FTP — stable, official, no redirects
        installerUrl: 'https://www.python.org/ftp/python/3.13.0/python-3.13.0-amd64.exe',
        silentFlags: '/quiet InstallAllUsers=1 PrependPath=1 Include_test=0',
        arch: 'x64'
      },
      {
        version: '3.12.4',
        installerUrl: 'https://www.python.org/ftp/python/3.12.4/python-3.12.4-amd64.exe',
        silentFlags: '/quiet InstallAllUsers=1 PrependPath=1 Include_test=0',
        arch: 'x64'
      },
      {
        version: '3.11.9',
        installerUrl: 'https://www.python.org/ftp/python/3.11.9/python-3.11.9-amd64.exe',
        silentFlags: '/quiet InstallAllUsers=1 PrependPath=1 Include_test=0',
        arch: 'x64'
      }
    ],
    verifyCommand: 'where python',
    envVar: 'PYTHON_HOME',
    envPath: '%PYTHON_HOME%\\Scripts',
    installDir: 'C:\\Python313',
    prerequisites: []
  },

  // ── RUNTIME ────────────────────────────────────────────────────────────────
  {
    name: 'Node.js',
    slug: 'nodejs',
    description: 'JavaScript runtime for backend development and CLI tools.',
    category: 'runtime',
    icon: '🟢',
    versions: [
      {
        version: '22.11.0 LTS',
        // nodejs.org/dist — official Node.js CDN, direct MSI, no redirects
        installerUrl: 'https://nodejs.org/dist/v22.11.0/node-v22.11.0-x64.msi',
        silentFlags: '/qn /norestart',
        arch: 'x64'
      },
      {
        version: '20.18.0 LTS',
        installerUrl: 'https://nodejs.org/dist/v20.18.0/node-v20.18.0-x64.msi',
        silentFlags: '/qn /norestart',
        arch: 'x64'
      },
      {
        version: '18.20.4 LTS',
        installerUrl: 'https://nodejs.org/dist/v18.20.4/node-v18.20.4-x64.msi',
        silentFlags: '/qn /norestart',
        arch: 'x64'
      }
    ],
    verifyCommand: 'where node',
    prerequisites: []
  },

  // ── JDK ────────────────────────────────────────────────────────────────────
  {
    name: 'JDK (Temurin)',
    slug: 'jdk',
    description: 'Eclipse Temurin OpenJDK — Java Development Kit for all Java applications.',
    category: 'language',
    icon: '☕',
    versions: [
      {
        version: '21 LTS',
        // api.adoptium.net — official Adoptium REST API, resolves to latest 21 MSI
        installerUrl: 'https://api.adoptium.net/v3/installer/latest/21/ga/windows/x64/jdk/hotspot/normal/eclipse',
        silentFlags: 'ADDLOCAL="FeatureMain,FeatureEnvironment,FeatureJarFileRunWith,FeatureJavaHome" /quiet /norestart',
        arch: 'x64'
      },
      {
        version: '17 LTS',
        installerUrl: 'https://api.adoptium.net/v3/installer/latest/17/ga/windows/x64/jdk/hotspot/normal/eclipse',
        silentFlags: 'ADDLOCAL="FeatureMain,FeatureEnvironment,FeatureJarFileRunWith,FeatureJavaHome" /quiet /norestart',
        arch: 'x64'
      },
      {
        version: '11 LTS',
        installerUrl: 'https://api.adoptium.net/v3/installer/latest/11/ga/windows/x64/jdk/hotspot/normal/eclipse',
        silentFlags: 'ADDLOCAL="FeatureMain,FeatureEnvironment,FeatureJarFileRunWith,FeatureJavaHome" /quiet /norestart',
        arch: 'x64'
      }
    ],
    verifyCommand: 'where java',
    envVar: 'JAVA_HOME',
    envPath: '%JAVA_HOME%\\bin',
    installDir: 'C:\\Program Files\\Eclipse Adoptium\\jdk-21',
    prerequisites: []
  },

  // ── VERSION CONTROL ────────────────────────────────────────────────────────
  {
    name: 'Git',
    slug: 'git',
    description: 'Industry-standard distributed version control system.',
    category: 'vcs',
    icon: '🔀',
    versions: [
      {
        version: '2.47.0',
        // github.com/git-for-windows — official Git for Windows project releases
        installerUrl: 'https://github.com/git-for-windows/git/releases/download/v2.47.0.windows.1/Git-2.47.0-64-bit.exe',
        silentFlags: '/VERYSILENT /NORESTART /NOCANCEL /SP- /CLOSEAPPLICATIONS /COMPONENTS="icons,ext\\reg\\shellhere,assoc,assoc_sh"',
        arch: 'x64'
      },
      {
        version: '2.45.2',
        installerUrl: 'https://github.com/git-for-windows/git/releases/download/v2.45.2.windows.1/Git-2.45.2-64-bit.exe',
        silentFlags: '/VERYSILENT /NORESTART /NOCANCEL /SP-',
        arch: 'x64'
      }
    ],
    verifyCommand: 'where git',
    prerequisites: []
  },

  // ── IDEs & EDITORS ─────────────────────────────────────────────────────────
  {
    name: 'Visual Studio Code',
    slug: 'vscode',
    description: 'Lightweight, powerful code editor by Microsoft. Most popular for web dev.',
    category: 'ide',
    icon: '💙',
    versions: [
      {
        version: 'Latest (Stable)',
        // Official VS Code CDN permalink — always resolves to latest stable user installer
        installerUrl: 'https://code.visualstudio.com/sha/download?build=stable&os=win32-x64-user',
        silentFlags: '/VERYSILENT /MERGETASKS=!runcode,addcontextmenufiles,addcontextmenufolders,associatewithfiles,addtopath',
        arch: 'x64'
      }
    ],
    verifyCommand: 'where code',
    prerequisites: []
  },

  {
    name: 'Eclipse IDE',
    slug: 'eclipse',
    description: 'Classic Java IDE widely used in universities and enterprise development.',
    category: 'ide',
    icon: '🌑',
    versions: [
      {
        version: '2024-09',
        // Direct CDN path on download.eclipse.org — bypasses the PHP mirror redirect page
        // eclipse-inst-jre-win64.exe is the Eclipse Installer that bundles JRE
        installerUrl: 'https://download.eclipse.org/technology/epp/downloads/release/2024-09/R/eclipse-inst-jre-win64.exe',
        silentFlags: '-nosplash -application org.eclipse.equinox.p2.director',
        arch: 'x64'
      }
    ],
    verifyCommand: '',
    prerequisites: ['jdk']
  },

  {
    name: 'Turbo C++',
    slug: 'turbocpp',
    description: 'Legacy C/C++ IDE used in Indian college labs. Runs via DOSBox on Windows 10/11. The script installs DOSBox (official). Place your TC 3.0 folder at C:\\TC from your college USB/CD.',
    category: 'ide',
    icon: '🖥️',
    versions: [
      {
        version: 'DOSBox 0.74-3',
        // dosbox.com official release hosted on SourceForge direct binary CDN
        // versaweb.dl.sourceforge.net is a direct mirror CDN — NOT a project page
        installerUrl: 'https://netix.dl.sourceforge.net/project/dosbox/dosbox/0.74-3/DOSBox0.74-3-win32-installer.exe',
        silentFlags: '/VERYSILENT /NORESTART',
        arch: 'x64'
      }
    ],
    verifyCommand: '',
    prerequisites: []
  },

  {
    name: 'IntelliJ IDEA Community',
    slug: 'intellij',
    description: 'Smart Java/Kotlin IDE by JetBrains. Great for Spring Boot and Android.',
    category: 'ide',
    icon: '🧠',
    versions: [
      {
        version: '2024.2.3',
        // download.jetbrains.com — official JetBrains CDN, direct exe
        installerUrl: 'https://download.jetbrains.com/idea/ideaIC-2024.2.3.exe',
        silentFlags: '/S /CONFIG=silent.config',
        arch: 'x64'
      }
    ],
    verifyCommand: '',
    prerequisites: ['jdk']
  },

  {
    name: 'PyCharm Community',
    slug: 'pycharm',
    description: 'Dedicated Python IDE by JetBrains with smart code assistance.',
    category: 'ide',
    icon: '🐍',
    versions: [
      {
        version: '2024.2.3',
        // download.jetbrains.com — official JetBrains CDN, direct exe
        installerUrl: 'https://download.jetbrains.com/python/pycharm-community-2024.2.3.exe',
        silentFlags: '/S /CONFIG=silent.config',
        arch: 'x64'
      }
    ],
    verifyCommand: '',
    prerequisites: ['python']
  },

  // ── DATABASES ──────────────────────────────────────────────────────────────
  {
    name: 'MongoDB Community',
    slug: 'mongodb',
    description: 'NoSQL document database. Essential for MERN stack development.',
    category: 'database',
    icon: '🍃',
    versions: [
      {
        version: '8.0.3',
        // fastdl.mongodb.org — official MongoDB CDN, direct MSI, no auth required
        installerUrl: 'https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-8.0.3-signed.msi',
        silentFlags: '/quiet /qn ADDLOCAL="MongoDBServiceServer,Client,Router,MongoDBShell"',
        arch: 'x64'
      },
      {
        version: '7.0.14',
        installerUrl: 'https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.14-signed.msi',
        silentFlags: '/quiet /qn ADDLOCAL="MongoDBServiceServer,Client,Router,MongoDBShell"',
        arch: 'x64'
      }
    ],
    verifyCommand: 'where mongod',
    prerequisites: []
  },

  {
    name: 'MongoDB Compass',
    slug: 'mongodb-compass',
    description: 'Official GUI for MongoDB — visually explore and manage your databases.',
    category: 'database',
    icon: '🧭',
    versions: [
      {
        version: '1.44.3',
        // downloads.mongodb.com — official MongoDB Compass CDN, direct exe
        installerUrl: 'https://downloads.mongodb.com/compass/mongodb-compass-1.44.3-win32-x64.exe',
        silentFlags: '/S',
        arch: 'x64'
      }
    ],
    verifyCommand: '',
    prerequisites: []
  },

  {
    name: 'MySQL Community Server',
    slug: 'mysql',
    description: "World's most popular open-source RDBMS. Core for DBMS coursework.",
    category: 'database',
    icon: '🐬',
    versions: [
      {
        version: '8.4.3 LTS',
        // cdn.mysql.com/Downloads — MySQL's actual CDN (not the dev.mysql.com portal which
        // goes through Oracle's firewall that blocks automated requests)
        installerUrl: 'https://cdn.mysql.com/Downloads/MySQL-8.4/mysql-8.4.3-winx64.msi',
        silentFlags: '/quiet /qn',
        arch: 'x64'
      },
      {
        version: '8.0.40',
        installerUrl: 'https://cdn.mysql.com/Downloads/MySQL-8.0/mysql-8.0.40-winx64.msi',
        silentFlags: '/quiet /qn',
        arch: 'x64'
      }
    ],
    verifyCommand: 'where mysql',
    prerequisites: []
  },

  {
    name: 'MySQL Workbench',
    slug: 'mysql-workbench',
    description: 'Visual tool for database design, query editing, and MySQL administration.',
    category: 'database',
    icon: '🔧',
    versions: [
      {
        version: '8.0.40',
        // cdn.mysql.com — bypasses Oracle portal firewall
        installerUrl: 'https://cdn.mysql.com/Downloads/MySQLGUITools/mysql-workbench-community-8.0.40-winx64.msi',
        silentFlags: '/quiet /qn',
        arch: 'x64'
      }
    ],
    verifyCommand: '',
    prerequisites: ['mysql']
  },

  {
    name: 'PostgreSQL',
    slug: 'postgresql',
    description: 'Advanced open-source RDBMS. Used in production and internships.',
    category: 'database',
    icon: '🐘',
    versions: [
      {
        version: '17.2',
        // get.enterprisedb.com — official EDB (EnterpriseDB) PostgreSQL installer CDN
        installerUrl: 'https://get.enterprisedb.com/postgresql/postgresql-17.2-1-windows-x64.exe',
        silentFlags: '--mode unattended --superpassword postgres --servicename postgresql-17',
        arch: 'x64'
      },
      {
        version: '16.6',
        installerUrl: 'https://get.enterprisedb.com/postgresql/postgresql-16.6-1-windows-x64.exe',
        silentFlags: '--mode unattended --superpassword postgres --servicename postgresql-16',
        arch: 'x64'
      }
    ],
    verifyCommand: 'where psql',
    envVar: 'POSTGRES_HOME',
    envPath: '%POSTGRES_HOME%\\bin',
    installDir: 'C:\\Program Files\\PostgreSQL\\17',
    prerequisites: []
  },

  // ── BUILD TOOLS ────────────────────────────────────────────────────────────
  {
    name: 'Apache Maven',
    slug: 'maven',
    description: 'Java project build and dependency manager. Required for most Java courses.',
    category: 'build',
    icon: '📦',
    versions: [
      {
        version: '3.9.9',
        // dlcdn.apache.org — official Apache Software Foundation CDN
        installerUrl: 'https://dlcdn.apache.org/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.zip',
        silentFlags: 'env-only',
        arch: 'any'
      }
    ],
    verifyCommand: 'where mvn',
    envVar: 'MAVEN_HOME',
    envPath: 'C:\\maven\\bin',
    installDir: 'C:\\maven',
    isEnvOnly: true,
    prerequisites: ['jdk']
  },

  {
    name: 'Gradle',
    slug: 'gradle',
    description: 'Modern build tool for Java, Kotlin, and Android projects.',
    category: 'build',
    icon: '🏗️',
    versions: [
      {
        version: '8.10.2',
        // services.gradle.org — official Gradle CDN
        installerUrl: 'https://services.gradle.org/distributions/gradle-8.10.2-bin.zip',
        silentFlags: 'env-only',
        arch: 'any'
      }
    ],
    verifyCommand: 'where gradle',
    envVar: 'GRADLE_HOME',
    envPath: 'C:\\gradle\\bin',
    installDir: 'C:\\gradle',
    isEnvOnly: true,
    prerequisites: ['jdk']
  },

  // ── COMMUNICATION ──────────────────────────────────────────────────────────
  {
    name: 'Zoom',
    slug: 'zoom',
    description: 'Video conferencing for online classes, group projects, and interviews.',
    category: 'communication',
    icon: '📹',
    versions: [
      {
        version: 'Latest',
        // zoom.us/client/latest — official Zoom CDN permalink, always latest
        installerUrl: 'https://zoom.us/client/latest/ZoomInstallerFull.exe',
        silentFlags: '/silent /install',
        arch: 'x64'
      }
    ],
    verifyCommand: '',
    prerequisites: []
  },

  {
    name: 'Slack',
    slug: 'slack',
    description: 'Team messaging platform used by companies and open-source communities.',
    category: 'communication',
    icon: '💬',
    versions: [
      {
        version: 'Latest',
        // slack.com/ssb/download-win64 — official Slack CDN permalink
        installerUrl: 'https://slack.com/ssb/download-win64',
        silentFlags: '/silent',
        arch: 'x64'
      }
    ],
    verifyCommand: '',
    prerequisites: []
  },

  {
    name: 'Discord',
    slug: 'discord',
    description: 'Chat platform for dev communities, study groups, and hackathon teams.',
    category: 'communication',
    icon: '🎮',
    versions: [
      {
        version: 'Latest',
        // discord.com/api/downloads — official Discord CDN
        installerUrl: 'https://discord.com/api/downloads/distributions/app/installers/latest?channel=stable&platform=win&arch=x64',
        silentFlags: '/S',
        arch: 'x64'
      }
    ],
    verifyCommand: '',
    prerequisites: []
  },

  // ── UTILITIES ──────────────────────────────────────────────────────────────
  {
    name: 'Postman',
    slug: 'postman',
    description: 'API testing and development tool. Essential for REST API work.',
    category: 'utility',
    icon: '📮',
    versions: [
      {
        version: 'Latest',
        // dl.pstmn.io — official Postman CDN permalink
        installerUrl: 'https://dl.pstmn.io/download/latest/win64',
        silentFlags: '/S',
        arch: 'x64'
      }
    ],
    verifyCommand: '',
    prerequisites: []
  },

  {
    name: 'Docker Desktop',
    slug: 'docker',
    description: 'Containerization platform. Run apps in isolated containers.',
    category: 'utility',
    icon: '🐳',
    versions: [
      {
        version: 'Latest',
        // desktop.docker.com — official Docker CDN permalink
        installerUrl: 'https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe',
        silentFlags: 'install --quiet --accept-license',
        arch: 'x64'
      }
    ],
    verifyCommand: 'where docker',
    prerequisites: []
  },

  {
    name: 'GitHub Desktop',
    slug: 'github-desktop',
    description: 'Visual Git client — manage repos without memorizing commands.',
    category: 'utility',
    icon: '🐙',
    versions: [
      {
        version: 'Latest',
        // central.github.com/deployments/desktop — official GitHub Desktop CDN permalink
        installerUrl: 'https://central.github.com/deployments/desktop/desktopapp/latest/win32',
        silentFlags: '/S',
        arch: 'x64'
      }
    ],
    verifyCommand: '',
    prerequisites: ['git']
  },

  {
    name: 'WinRAR',
    slug: 'winrar',
    description: 'File compression/extraction tool for .zip, .rar archives.',
    category: 'utility',
    icon: '🗜️',
    versions: [
      {
        version: '7.10 (64-bit)',
        // www.rarlab.com/rar — official RARLAB CDN, direct exe
        installerUrl: 'https://www.rarlab.com/rar/winrar-x64-710.exe',
        silentFlags: '/S',
        arch: 'x64'
      }
    ],
    verifyCommand: '',
    prerequisites: []
  },

  {
    name: 'Notepad++',
    slug: 'notepadpp',
    description: 'Lightweight text editor. Great for viewing code and config files quickly.',
    category: 'utility',
    icon: '📝',
    versions: [
      {
        version: '8.7.1',
        // github.com/notepad-plus-plus — official Notepad++ project releases by don Ho
        installerUrl: 'https://github.com/notepad-plus-plus/notepad-plus-plus/releases/download/v8.7.1/npp.8.7.1.Installer.x64.exe',
        silentFlags: '/S',
        arch: 'x64'
      }
    ],
    verifyCommand: '',
    prerequisites: []
  },

  {
    name: 'VLC Media Player',
    slug: 'vlc',
    description: 'Free media player for video/audio lectures and recordings.',
    category: 'utility',
    icon: '🎬',
    versions: [
      {
        version: '3.0.21',
        // get.videolan.org/vlc — official VideoLAN CDN, direct exe
        installerUrl: 'https://get.videolan.org/vlc/3.0.21/win64/vlc-3.0.21-win64.exe',
        silentFlags: '/S',
        arch: 'x64'
      }
    ],
    verifyCommand: '',
    prerequisites: []
  },

  {
    name: 'Google Chrome',
    slug: 'chrome',
    description: 'Fast browser with DevTools for web development.',
    category: 'utility',
    icon: '🌐',
    versions: [
      {
        version: 'Latest',
        // dl.google.com/chrome — official Google Chrome enterprise CDN
        installerUrl: 'https://dl.google.com/chrome/install/GoogleChromeStandaloneEnterprise64.msi',
        silentFlags: '/quiet /norestart',
        arch: 'x64'
      }
    ],
    verifyCommand: '',
    prerequisites: []
  },

  {
    name: '7-Zip',
    slug: '7zip',
    description: 'High compression ratio file archiver. Free and open-source.',
    category: 'utility',
    icon: '📁',
    versions: [
      {
        version: '24.08',
        // 7-zip.org/a — official 7-Zip CDN, direct exe
        installerUrl: 'https://7-zip.org/a/7z2408-x64.exe',
        silentFlags: '/S',
        arch: 'x64'
      }
    ],
    verifyCommand: 'where 7z',
    prerequisites: []
  },

  {
    name: 'draw.io Desktop',
    slug: 'drawio',
    description: 'Diagram tool for ER diagrams, UML, flowcharts, and system design.',
    category: 'utility',
    icon: '📊',
    versions: [
      {
        version: '24.7.17',
        // github.com/jgraph — official draw.io / diagrams.net org by JGraph Ltd
        installerUrl: 'https://github.com/jgraph/drawio-desktop/releases/download/v24.7.17/draw.io-24.7.17-windows-installer.exe',
        silentFlags: '/S',
        arch: 'x64'
      }
    ],
    verifyCommand: '',
    prerequisites: []
  }
]

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/devsetup')
    await Tool.deleteMany({})
    const inserted = await Tool.insertMany(tools)
    console.log(`✅ Seeded ${inserted.length} tools successfully.`)
    process.exit(0)
  } catch (err) {
    console.error('❌ Seed failed:', err.message)
    process.exit(1)
  }
}

seed()
