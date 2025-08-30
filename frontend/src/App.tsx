import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RegisterPage from './pages/register'
import NotFoundPage from './pages/notFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<p>Home</p>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

