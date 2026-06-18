import { useState } from 'react'
import axios from 'axios'

export default function Shortener({ token, onLogout }: { token: string, onLogout: () => void }) {
  const [longUrl, setLongUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [error, setError] = useState('')

  async function handleShorten() {
    try {
      const res = await axios.post('/api/shorten',
        { longUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setShortUrl(res.data.shortUrl)
      setError('')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong')
      setShortUrl('')
    }
  }

  return (
    <div className="bg-white p-8 rounded shadow w-96">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">URL Shortener</h1>
        <button className="text-sm text-red-500 hover:underline" onClick={onLogout}>Logout</button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <input className="w-full border p-2 mb-4 rounded" placeholder="https://example.com"
        value={longUrl} onChange={e => setLongUrl(e.target.value)} />
      <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        onClick={handleShorten}>
        Shorten
      </button>
      {shortUrl && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <p className="text-sm text-gray-600">Your short URL:</p>
          <a className="text-blue-600 hover:underline break-all" href={shortUrl} target="_blank">
            {shortUrl}
          </a>
        </div>
      )}
    </div>
  )
}