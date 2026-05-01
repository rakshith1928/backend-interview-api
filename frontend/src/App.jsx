import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }

    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [token, user])

  const handleLogin = (newToken, newUser) => {
    setToken(newToken)
    setUser(newUser)
  }

  const handleLogout = () => {
    setToken(null)
    setUser(null)
  }

  return (
    <Router>
      <div className="app-container">
        <div className="background-overlay" />
        {user && (
          <nav className="navbar citadel-panel">
            <div className="nav-brand">
              <p className="overline">Clan Command</p>
              <h1>War Table</h1>
            </div>
            <div className="nav-user">
              <div>
                <p className="overline">Commander</p>
                <p>{user.name} · {user.role}</p>
              </div>
              <button onClick={handleLogout} className="btn-secondary">Leave Camp</button>
            </div>
          </nav>
        )}

        <main className="main-content">
          <Routes>
            <Route
              path="/login"
              element={!token ? <Login onLogin={handleLogin} /> : <Navigate to="/" />}
            />
            <Route
              path="/register"
              element={!token ? <Register onLogin={handleLogin} /> : <Navigate to="/" />}
            />
            <Route
              path="/"
              element={token ? <Dashboard token={token} user={user} /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
