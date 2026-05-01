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
        {user && (
          <nav className="navbar glass-panel">
            <div className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
              TaskFlow
            </div>
            <div className="nav-user">
              <span>{user.name} ({user.role})</span>
              <button onClick={handleLogout} className="btn-secondary">Logout</button>
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
