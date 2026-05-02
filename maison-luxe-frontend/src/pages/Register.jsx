import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [lockFields, setLockFields] = useState(true)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register(name, email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full card-lux rounded-2xl p-8">
        <h2 className="font-display text-3xl font-bold text-center text-gold mb-8">Join Maison Luxe</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} autoComplete="off">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            onFocus={() => setLockFields(false)}
            readOnly={lockFields}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="words"
            spellCheck={false}
            name="register_name"
            className="w-full p-3 rounded-lg mb-4 input-surface"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onFocus={() => setLockFields(false)}
            readOnly={lockFields}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            name="register_email"
            className="w-full p-3 rounded-lg mb-4 input-surface"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onFocus={() => setLockFields(false)}
            readOnly={lockFields}
            autoComplete="new-password"
            name="register_password"
            className="w-full p-3 rounded-lg mb-6 input-surface"
            required
          />
          <button type="submit" className="w-full btn-gold py-3 rounded-lg">
            Create Account
          </button>
        </form>
        <p className="text-center mt-4 text-muted-ivory">
          Already have an account? <Link to="/login" className="text-gold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}