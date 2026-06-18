import { useState, useEffect } from 'react'
import axios from 'axios'

interface UrlEntry {
    short_code: string
    long_url: string
    click_count: number
    created_at: string
}

export default function Shortener({ token, onLogout }: { token: string, onLogout: () => void }) {
    const [longUrl, setLongUrl] = useState('')
    const [shortUrl, setShortUrl] = useState('')
    const [error, setError] = useState('')
    const [urls, setUrls] = useState<UrlEntry[]>([])

    const headers = { Authorization: `Bearer ${token}` }

    async function fetchUrls() {
        const res = await axios.get('/api/urls', { headers })
        setUrls(res.data.urls)
    }

    useEffect(() => { fetchUrls() }, [])

    async function handleShorten() {
        try {
            const res = await axios.post('/api/shorten', { longUrl }, { headers })
            setShortUrl(res.data.shortUrl)
            setError('')
            setLongUrl('')
            fetchUrls()
        } catch (err: any) {
            setError(err.response?.data?.error || 'Something went wrong')
            setShortUrl('')
        }
    }

    async function handleDelete(code: string) {
        await axios.delete(`/api/urls/${code}`, { headers })
        fetchUrls()
    }

    return (
        <div className="bg-white p-8 rounded shadow w-[600px]">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">URL Shortener</h1>
                <button className="text-sm text-red-500 hover:underline" onClick={onLogout}>Logout</button>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="flex gap-2 mb-4">
                <input className="flex-1 border p-2 rounded" placeholder="https://example.com"
                    value={longUrl} onChange={e => setLongUrl(e.target.value)} />
                <button className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
                    onClick={handleShorten}>
                    Shorten
                </button>
            </div>

            {shortUrl && (
                <div className="mb-6 p-3 bg-gray-100 rounded">
                    <p className="text-sm text-gray-600">Your short URL:</p>
                    <a className="text-blue-600 hover:underline break-all" href={shortUrl} target="_blank">
                        {shortUrl}
                    </a>
                </div>
            )}

            <h2 className="text-lg font-semibold mb-3">Your URLs</h2>
            {urls.length === 0
                ? <p className="text-gray-400 text-sm">No URLs yet.</p>
                : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-500 border-b">
                                <th className="pb-2">Short</th>
                                <th className="pb-2">Original</th>
                                <th className="pb-2">Clicks</th>
                                <th className="pb-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {urls.map(u => (
                                <tr key={u.short_code} className="border-b last:border-0">
                                    <td className="py-2">
                                        <a className="text-blue-600 hover:underline"
                                            href={`http://localhost:3000/${u.short_code}`} target="_blank">
                                            {`http://localhost:3000/${u.short_code}`}
                                        </a>
                                    </td>
                                    <td className="py-2 max-w-[200px] truncate text-gray-600">{u.long_url}</td>
                                    <td className="py-2 text-gray-600">{u.click_count}</td>
                                    <td className="py-2">
                                        <button className="text-red-500 hover:underline text-xs"
                                            onClick={() => handleDelete(u.short_code)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            }
        </div>
    )
}