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
        <h2>{user.role === 'admin' ? 'All Tasks (Admin View)' : 'My Tasks'}</h2>
        {!showForm && (
          <button className="btn-primary" style={{ width: 'auto', marginTop: 0 }} onClick={() => setShowForm(true)}>
            + Create New Task
          </button>
        )}
      </div>

      {error && <div className="message error">{error}</div>}
      {success && <div className="message success">{success}</div>}

      {showForm && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h3>{editingId ? 'Edit Task' : 'Create Task'}</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
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
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn-primary">Save Task</button>
              <button type="button" className="btn-secondary" style={{ marginTop: '1rem' }} onClick={cancelEdit}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No tasks found. Create one to get started!
        </div>
      ) : (
        <div className="task-list">
          {tasks.map(task => (
            <div key={task._id} className="task-card glass-panel">
              <div className="task-meta">
                <span className={`task-status status-${task.status}`}>{task.status.replace('-', ' ')}</span>
                <span>{new Date(task.createdAt).toLocaleDateString()}</span>
              </div>
              <h3 className="task-title" style={{ marginTop: '0.5rem' }}>{task.title}</h3>
              <p className="task-desc">{task.description}</p>
              {user.role === 'admin' && task.user && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Owner: {task.user.name} ({task.user.email})
                </div>
              )}
              <div className="task-actions">
                <button className="btn-secondary" onClick={() => handleEdit(task)}>Edit</button>
                <button className="btn-danger" onClick={() => handleDelete(task._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
