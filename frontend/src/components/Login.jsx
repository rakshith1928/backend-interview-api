import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authAPI, setAuthToken } from '../services/api'

const quickMetrics = [
  { label: 'Active squads', value: '124' },
  { label: 'Missions done', value: '892' },
  { label: 'Response time', value: '3.4 min' }
]

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
    <section className="auth-shell auth-shell-elevated">
      <aside className="auth-aside auth-aside-refined citadel-panel">
        <p className="overline">Operations Portal</p>
        <h2>Coordinate every task from one command deck.</h2>
        <p>Track assignments, prioritize objectives, and keep delivery teams aligned with clear operational visibility.</p>
        <div className="metric-grid">
          {quickMetrics.map((metric) => (
            <div key={metric.label} className="metric-item">
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      </aside>

      <div className="auth-container auth-container-refined citadel-panel">
        <div className="auth-header">
          <h2>Welcome back</h2>
          <p>Sign in to continue to your dashboard.</p>
        </div>
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
              placeholder="alex.rivera@unit.co"
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
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
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
