import { useState } from 'react'
import axios from 'axios'

export default function Auth({ onLogin }: { onLogin: (token: string) => void }) {
    const [isRegister, setIsRegister] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    async function handleSubmit() {
        try {
            if (isRegister) {
                await axios.post('/api/auth/register', { username, password })
                setIsRegister(false)
                setError('Registered! Now login.')
            } else {
                const res = await axios.post('/api/auth/login', { username, password })
                localStorage.setItem('token', res.data.token)
                onLogin(res.data.token)
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Something went wrong')
        }
    }

    return (
        <div className="bg-white p-8 rounded shadow w-96">
            <h1 className="text-2xl font-bold mb-6">{isRegister ? 'Register' : 'Login'}</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <input className="w-full border p-2 mb-4 rounded" placeholder="Username"
                value={username} onChange={e => setUsername(e.target.value)} />
            <input className="w-full border p-2 mb-4 rounded" type="password" placeholder="Password"
                value={password} onChange={e => setPassword(e.target.value)} />
            <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                onClick={handleSubmit}>
                {isRegister ? 'Register' : 'Login'}
            </button>
            <p className="mt-4 text-center text-sm cursor-pointer text-blue-500"
                onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
            </p>
        </div>
    )
}