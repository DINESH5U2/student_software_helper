import AppRouter from './router/AppRouter.jsx'
import ScreenGuard from './components/ScreenGuard/ScreenGuard.jsx'

export default function App() {
  return (
    <ScreenGuard>
      <AppRouter />
    </ScreenGuard>
  )
}
