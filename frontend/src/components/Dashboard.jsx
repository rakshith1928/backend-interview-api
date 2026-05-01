import { useState, useEffect } from 'react'
import { taskAPI, setAuthToken } from '../services/api'

function Dashboard({ token, user }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
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
    } catch {
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
        showMessage('Mission updated successfully')
      } else {
        await taskAPI.create(formData)
        showMessage('Mission created successfully')
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
    if (window.confirm('Delete this mission record?')) {
      try {
        await taskAPI.delete(id)
        showMessage('Mission deleted successfully')
        fetchTasks()
      } catch {
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
      <header className="dashboard-header">
        <div>
          <p className="overline">Mission Ledger</p>
          <h2>{user.role === 'admin' ? 'All active campaigns' : 'Your assignment queue'}</h2>
        </div>
        {!showForm && (
          <button className="btn-primary slim" onClick={() => setShowForm(true)}>
            Create Mission
          </button>
        )}
      </header>

      {error && <div className="message error">{error}</div>}
      {success && <div className="message success">{success}</div>}

      {showForm && (
        <div className="citadel-panel mission-form">
          <h3>{editingId ? 'Edit mission' : 'Create mission'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="3" />
            </div>
            {editingId && (
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            )}
            <div className="task-actions">
              <button type="submit" className="btn-primary slim">Save</button>
              <button type="button" className="btn-secondary" onClick={cancelEdit}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="skeleton-grid">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="citadel-panel empty-state">
          <h3>No missions yet</h3>
          <p>Launch your first mission to fill this war table with active objectives.</p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <article key={task._id} className="task-card citadel-panel">
              <div className="task-meta">
                <span className={`task-status status-${task.status}`}>{task.status.replace('-', ' ')}</span>
                <span>{new Date(task.createdAt).toLocaleDateString()}</span>
              </div>
              <h3 className="task-title">{task.title}</h3>
              <p className="task-desc">{task.description}</p>
              {user.role === 'admin' && task.user && (
                <p className="task-owner">Owner: {task.user.name} · {task.user.email}</p>
              )}
              <div className="task-actions">
                <button className="btn-secondary" onClick={() => handleEdit(task)}>Edit</button>
                <button className="btn-danger" onClick={() => handleDelete(task._id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
