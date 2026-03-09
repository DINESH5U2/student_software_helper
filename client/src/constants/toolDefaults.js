export const PRESET_PROFILES = [
  {
    id: 'python-dev',
    label: '🐍 Python Dev',
    description: 'Python + Git + VSCode + PyCharm',
    slugs: ['python', 'git', 'vscode', 'pycharm']
  },
  {
    id: 'mern-stack',
    label: '🟢 MERN Stack',
    description: 'Node.js + Git + MongoDB + VSCode + Postman',
    slugs: ['nodejs', 'git', 'mongodb', 'mongodb-compass', 'vscode', 'postman']
  },
  {
    id: 'java-backend',
    label: '☕ Java Backend',
    description: 'JDK + Maven + Eclipse + Git',
    slugs: ['jdk', 'maven', 'eclipse', 'git']
  },
  {
    id: 'college-starter',
    label: '🎓 College Starter',
    description: 'JDK + Python + Turbo C++ + Git + VSCode',
    slugs: ['jdk', 'python', 'turbocpp', 'git', 'vscode']
  },
  {
    id: 'full-stack',
    label: '🚀 Full Stack',
    description: 'Node.js + Python + JDK + MongoDB + PostgreSQL + Docker + Git + VSCode',
    slugs: ['nodejs', 'python', 'jdk', 'mongodb', 'postgresql', 'docker', 'git', 'vscode']
  },
  {
    id: 'data-science',
    label: '📊 Data Science',
    description: 'Python + Jupyter + Git + VSCode + PostgreSQL',
    slugs: ['python', 'git', 'vscode', 'postgresql']
  }
]

export const CATEGORY_LABELS = {
  language: 'Language',
  runtime: 'Runtime',
  ide: 'IDE / Editor',
  database: 'Database',
  vcs: 'Version Control',
  communication: 'Communication',
  utility: 'Utility',
  build: 'Build Tool'
}

export const CATEGORY_ORDER = ['language', 'runtime', 'ide', 'database', 'vcs', 'build', 'communication', 'utility']
