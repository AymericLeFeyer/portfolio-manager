import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'
import ProfileInfo from './pages/ProfileInfo/index.jsx'
import Missions from './pages/Missions/index.jsx'
import Employment from './pages/Employment/index.jsx'
import Education from './pages/Education/index.jsx'
import Events from './pages/Events/index.jsx'
import Companies from './pages/Companies/index.jsx'
import Technologies from './pages/Technologies/index.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/profile" replace />} />
          <Route path="profile" element={<ProfileInfo />} />
          <Route path="missions" element={<Missions />} />
          <Route path="employment" element={<Employment />} />
          <Route path="education" element={<Education />} />
          <Route path="events" element={<Events />} />
          <Route path="companies" element={<Companies />} />
          <Route path="technologies" element={<Technologies />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
