import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authAPI, setAuthToken } from '../services/api'

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await authAPI.login(formData)
      setAuthToken(res.data.token)
      onLogin(res.data.token, res.data.user)
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-shell">
      <aside className="auth-aside citadel-panel">
        <p className="overline">Night Watch</p>
        <h2>Guard the kingdom queue.</h2>
        <p>Sign in to review missions, coordinate squads, and keep every objective moving across the valley map.</p>
      </aside>

      <div className="auth-container citadel-panel">
        <h2>Enter the war table</h2>
        {error && <div className="message error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="commander@clan.io"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Your passphrase"
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Preparing defenses...' : 'Login'}
          </button>
        </form>
        <div className="auth-links">
          Need an account? <Link to="/register">Create one now</Link>
        </div>
      </div>
    </section>
  )
}

export default Login
