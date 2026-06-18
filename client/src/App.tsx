import { useState } from 'react'
import Auth from './components/Auth.tsx'
import Shortener from './components/Shortener'

export default function App() {
  const [token, setToken] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {!token
        ? <Auth onLogin={setToken} />
        : <Shortener token={token} onLogout={() => setToken(null)} />
      }
    </div>
  )
}