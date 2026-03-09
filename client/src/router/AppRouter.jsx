import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar.jsx'
import LandingPage from '../pages/LandingPage/LandingPage.jsx'
import ToolSelectionPage from '../pages/ToolSelectionPage/ToolSelectionPage.jsx'
import ScriptOutputPage from '../pages/ScriptOutputPage/ScriptOutputPage.jsx'
import AdminPage from '../pages/AdminPage/AdminPage.jsx'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/select" element={<ToolSelectionPage />} />
        <Route path="/output/:shareId" element={<ScriptOutputPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  )
}
