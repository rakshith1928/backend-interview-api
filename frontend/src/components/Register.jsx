import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authAPI, setAuthToken } from '../services/api'

function Register({ onLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  })
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
      const res = await authAPI.register(formData)
      setAuthToken(res.data.token)
      onLogin(res.data.token, res.data.user)
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-shell">
      <aside className="auth-aside citadel-panel">
        <p className="overline">Recruitment Hall</p>
        <h2>Assemble your first squad.</h2>
        <p>Register your command identity, choose your role, and start dispatching operations from one fortified workspace.</p>
      </aside>

      <div className="auth-container citadel-panel">
        <h2>Create account</h2>
        {error && <div className="message error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Elara Thornfield"
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="elara@clan.io"
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
              placeholder="At least 6 characters"
              minLength="6"
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="user">Strategist</option>
              <option value="admin">Warlord</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Preparing roster...' : 'Register'}
          </button>
        </form>
        <div className="auth-links">
          Already enlisted? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </section>
  )
}

export default Register
