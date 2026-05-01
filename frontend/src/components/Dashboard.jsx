import { useState, useEffect } from 'react'
import { taskAPI, setAuthToken } from '../services/api'

function Dashboard({ token, user }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Form state
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ title: '', description: '', status: 'pending' })

  useEffect(() => {
    setAuthToken(token)
    fetchTasks()
  }, [token])

  const fetchTasks = async () => {
    try {
      const res = await taskAPI.getAll()
      setTasks(res.data.data)
    } catch (err) {
      setError('Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const showMessage = (msg, isError = false) => {
    if (isError) setError(msg)
    else setSuccess(msg)
    setTimeout(() => {
      setError('')
      setSuccess('')
    }, 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await taskAPI.update(editingId, formData)
        showMessage('Task updated successfully')
      } else {
        await taskAPI.create(formData)
        showMessage('Task created successfully')
      }
      setFormData({ title: '', description: '', status: 'pending' })
      setShowForm(false)
      setEditingId(null)
      fetchTasks()
    } catch (err) {
      showMessage(err.response?.data?.error || 'Operation failed', true)
    }
  }

  const handleEdit = (task) => {
    setFormData({ title: task.title, description: task.description, status: task.status })
    setEditingId(task._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.delete(id)
        showMessage('Task deleted successfully')
        fetchTasks()
      } catch (err) {
        showMessage('Failed to delete task', true)
      }
    }
  }

  const cancelEdit = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ title: '', description: '', status: 'pending' })
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', marginBottom: '0.25rem' }}>
            {user.role === 'admin' ? 'All Tasks' : 'My Tasks'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {user.role === 'admin' ? 'Manage everyone\'s tasks here' : 'Keep track of your activities'}
          </p>
        </div>
        {!showForm && (
          <button className="btn-primary" style={{ width: 'auto', marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem' }} onClick={() => setShowForm(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create Task
          </button>
        )}
      </div>

      {error && (
        <div className="message error">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error}
        </div>
      )}
      {success && (
        <div className="message success">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          {success}
        </div>
      )}

      {showForm && (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', animation: 'scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>{editingId ? 'Edit Task' : 'Create New Task'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} required placeholder=" " />
              <label>Task Title</label>
            </div>
            
            <div className="form-group">
              <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ top: '1.5rem' }}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="4" placeholder=" " />
              <label>Description</label>
            </div>
            
            {editingId && (
              <div className="form-group">
                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <label>Status</label>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn-primary" style={{ marginTop: 0, flex: 1 }}>Save Task</button>
              <button type="button" className="btn-secondary" onClick={cancelEdit} style={{ flex: 1 }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <svg className="spinner" style={{ animation: 'spin 1s linear infinite' }} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="4.93" x2="19.07" y2="7.76"></line>
          </svg>
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      ) : tasks.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '2rem' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>No tasks found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Get started by creating your first task.</p>
          </div>
          {!showForm && (
             <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 2rem' }} onClick={() => setShowForm(true)}>
               Create Your First Task
             </button>
          )}
        </div>
      ) : (
        <div className="task-list">
          {tasks.map(task => (
            <div key={task._id} className="task-card">
              <div className="task-meta">
                <span className={`task-status status-${task.status}`}>{task.status.replace('-', ' ')}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="task-title" style={{ marginTop: '0.75rem' }}>{task.title}</h3>
              <p className="task-desc">{task.description}</p>
              {user.role === 'admin' && task.user && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.3)', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  {task.user.name} ({task.user.email})
                </div>
              )}
              <div className="task-actions">
                <button className="btn-secondary" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} onClick={() => handleEdit(task)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Edit
                </button>
                <button className="btn-danger" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => handleDelete(task._id)} aria-label="Delete">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
