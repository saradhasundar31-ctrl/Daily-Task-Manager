import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('dailyTasks')
    return saved ? JSON.parse(saved) : []
  })

  const [page, setPage] = useState('dashboard')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [dueDate, setDueDate] = useState('')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    localStorage.setItem('dailyTasks', JSON.stringify(tasks))
  }, [tasks])

  const clearForm = () => {
    setTitle('')
    setDescription('')
    setPriority('Medium')
    setDueDate('')
    setEditingId(null)
  }

  const addOrUpdateTask = (e) => {
    e.preventDefault()

    if (title.trim() === '') {
      alert('Please enter a task title')
      return
    }

    if (editingId !== null) {
      setTasks(
        tasks.map((task) =>
          task.id === editingId
            ? {
                ...task,
                title: title.trim(),
                description: description.trim(),
                priority,
                dueDate,
              }
            : task
        )
      )

      alert('Task updated successfully')
    } else {
      const newTask = {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate,
        completed: false,
      }

      setTasks([...tasks, newTask])
      alert('Task added successfully')
    }

    clearForm()
  }

  const deleteTask = (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this task?'
    )

    if (confirmDelete) {
      setTasks(tasks.filter((task) => task.id !== id))
    }
  }

  const completeTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }

  const startEdit = (task) => {
    setTitle(task.title)
    setDescription(task.description)
    setPriority(task.priority)
    setDueDate(task.dueDate)
    setEditingId(task.id)
    setPage('tasks')
  }

  const filteredTasks = tasks.filter((task) => {
    const searchResult = task.title
      .toLowerCase()
      .includes(search.toLowerCase())

    if (filter === 'pending') {
      return searchResult && !task.completed
    }

    if (filter === 'completed') {
      return searchResult && task.completed
    }

    return searchResult
  })

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length

  const pendingCount = tasks.length - completedCount

  const progress =
    tasks.length === 0
      ? 0
      : Math.round((completedCount / tasks.length) * 100)

  return (
    <div className="app">

      {/* NAVBAR */}
      <header className="navbar">

        <div
          className="brand"
          onClick={() => setPage('dashboard')}
        >
          <div className="brand-icon">✓</div>

          <div>
            <h2>Daily Task Manager</h2>
            <span>Stay organized. Stay productive.</span>
          </div>
        </div>

        <nav>
          <button
            className={page === 'dashboard' ? 'nav-active' : ''}
            onClick={() => setPage('dashboard')}
          >
            Dashboard
          </button>

          <button
            className={page === 'tasks' ? 'nav-active' : ''}
            onClick={() => setPage('tasks')}
          >
            My Tasks
          </button>

          <button
            className={page === 'about' ? 'nav-active' : ''}
            onClick={() => setPage('about')}
          >
            About
          </button>
        </nav>

      </header>

      <main className="main-container">

        {/* DASHBOARD */}
        {page === 'dashboard' && (
          <section>

            <div className="hero-section">

              <div>
                <p className="eyebrow">
                  YOUR DAILY PRODUCTIVITY
                </p>

                <h1>
                  Manage your day.
                  <br />
                  <span>Get things done.</span>
                </h1>

                <p className="hero-text">
                  Organize your tasks, track your progress
                  and stay focused on what matters most.
                </p>

                <button
                  className="primary-button"
                  onClick={() => setPage('tasks')}
                >
                  + Create New Task
                </button>
              </div>

              <div className="hero-card">

                <div className="hero-card-icon">✓</div>

                <h3>Today's Progress</h3>

                <div className="progress-circle">
                  <strong>{progress}%</strong>
                  <span>Complete</span>
                </div>

                <p>
                  {completedCount} of {tasks.length} tasks completed
                </p>

              </div>

            </div>

            {/* STATISTICS */}
            <div className="stats-grid">

              <div className="stat-card">
                <div className="stat-icon blue">📋</div>
                <div>
                  <span>Total Tasks</span>
                  <strong>{tasks.length}</strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon orange">⏳</div>
                <div>
                  <span>Pending</span>
                  <strong>{pendingCount}</strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon green">✓</div>
                <div>
                  <span>Completed</span>
                  <strong>{completedCount}</strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon purple">📈</div>
                <div>
                  <span>Progress</span>
                  <strong>{progress}%</strong>
                </div>
              </div>

            </div>

            {/* RECENT TASKS */}
            <div className="content-card">

              <div className="card-header">

                <div>
                  <h2>Recent Tasks</h2>
                  <p>Your latest activities</p>
                </div>

                <button
                  className="view-button"
                  onClick={() => setPage('tasks')}
                >
                  View All →
                </button>

              </div>

              {tasks.length === 0 ? (

                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h3>No tasks yet</h3>
                  <p>
                    Create your first task and start
                    organizing your day.
                  </p>

                  <button
                    className="primary-button"
                    onClick={() => setPage('tasks')}
                  >
                    Create Your First Task
                  </button>
                </div>

              ) : (

                <div className="recent-list">

                  {tasks.slice(-5).reverse().map((task) => (
                    <div
                      className="recent-item"
                      key={task.id}
                    >

                      <button
                        className={
                          task.completed
                            ? 'check-button checked'
                            : 'check-button'
                        }
                        onClick={() => completeTask(task.id)}
                      >
                        {task.completed ? '✓' : ''}
                      </button>

                      <div className="recent-info">

                        <h3
                          className={
                            task.completed
                              ? 'completed-title'
                              : ''
                          }
                        >
                          {task.title}
                        </h3>

                        <p>
                          {task.description ||
                            'No description'}
                        </p>

                      </div>

                      <span
                        className={
                          'priority ' +
                          task.priority.toLowerCase()
                        }
                      >
                        {task.priority}
                      </span>

                    </div>
                  ))}

                </div>

              )}

            </div>

          </section>
        )}

        {/* TASK PAGE */}
        {page === 'tasks' && (
          <section>

            <div className="page-title">

              <p className="eyebrow">
                TASK MANAGEMENT
              </p>

              <h1>My Tasks</h1>

              <p>
                Create, organize and track everything
                you need to accomplish.
              </p>

            </div>

            <div className="task-layout">

              {/* FORM */}
              <div className="form-card">

                <h2>
                  {editingId !== null
                    ? 'Edit Task'
                    : 'Add New Task'}
                </h2>

                <p className="form-subtitle">
                  Fill in the details below.
                </p>

                <form onSubmit={addOrUpdateTask}>

                  <label>Task Title *</label>

                  <input
                    type="text"
                    placeholder="Enter task title"
                    value={title}
                    onChange={(e) =>
                      setTitle(e.target.value)
                    }
                  />

                  <label>Description</label>

                  <textarea
                    placeholder="Enter task description"
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                  />

                  <label>Priority</label>

                  <select
                    value={priority}
                    onChange={(e) =>
                      setPriority(e.target.value)
                    }
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>

                  <label>Due Date</label>

                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) =>
                      setDueDate(e.target.value)
                    }
                  />

                  <button
                    type="submit"
                    className="primary-button full-width"
                  >
                    {editingId !== null
                      ? 'Update Task'
                      : '+ Add Task'}
                  </button>

                  {editingId !== null && (
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={clearForm}
                    >
                      Cancel
                    </button>
                  )}

                </form>

              </div>

              {/* TASK LIST */}
              <div className="content-card task-list-card">

                <div className="task-tools">

                  <div className="search-box">
                    <span>🔍</span>

                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                    />
                  </div>

                  <select
                    value={filter}
                    onChange={(e) =>
                      setFilter(e.target.value)
                    }
                  >
                    <option value="all">All Tasks</option>
                    <option value="pending">Pending</option>
                    <option value="completed">
                      Completed
                    </option>
                  </select>

                </div>

                <p className="task-count">
                  Showing {filteredTasks.length} task
                  {filteredTasks.length !== 1 ? 's' : ''}
                </p>

                {filteredTasks.length === 0 ? (

                  <div className="empty-state small">
                    <div className="empty-icon">🔎</div>
                    <h3>No tasks found</h3>
                    <p>
                      Add a task or change your filter.
                    </p>
                  </div>

                ) : (

                  <div className="task-list">

                    {filteredTasks.map((task) => (
                      <div
                        className={
                          task.completed
                            ? 'task-item task-done'
                            : 'task-item'
                        }
                        key={task.id}
                      >

                        <button
                          className={
                            task.completed
                              ? 'check-button checked'
                              : 'check-button'
                          }
                          onClick={() =>
                            completeTask(task.id)
                          }
                        >
                          {task.completed ? '✓' : ''}
                        </button>

                        <div className="task-details">

                          <h3>{task.title}</h3>

                          {task.description && (
                            <p>{task.description}</p>
                          )}

                          <div className="task-meta">

                            <span
                              className={
                                'priority ' +
                                task.priority.toLowerCase()
                              }
                            >
                              {task.priority}
                            </span>

                            {task.dueDate && (
                              <span>
                                📅 {task.dueDate}
                              </span>
                            )}

                            <span>
                              {task.completed
                                ? '✓ Completed'
                                : '○ Pending'}
                            </span>

                          </div>

                        </div>

                        <div className="task-actions">

                          <button
                            type="button"
                            onClick={() => startEdit(task)}
                          >
                            ✏️
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteTask(task.id)}
                          >
                            🗑️
                          </button>

                        </div>

                      </div>
                    ))}

                  </div>

                )}

              </div>

            </div>

          </section>
        )}

        {/* ABOUT */}
        {page === 'about' && (
          <section className="about-section">

            <div className="page-title center">

              <p className="eyebrow">
                ABOUT THE APPLICATION
              </p>

              <h1>Daily Task Manager</h1>

              <p>
                A responsive task management application
                built using ReactJS.
              </p>

            </div>

            <div className="about-grid">

              <div className="about-card">
                <div className="about-icon">🎯</div>
                <h2>Purpose</h2>
                <p>
                  Helps users organize daily activities
                  and improve productivity.
                </p>
              </div>

              <div className="about-card">
                <div className="about-icon">⚡</div>
                <h2>Features</h2>
                <p>
                  Add, edit, delete, search, filter and
                  complete tasks.
                </p>
              </div>

              <div className="about-card">
                <div className="about-icon">⚛️</div>
                <h2>Technology</h2>
                <p>
                  ReactJS, JSX, JavaScript ES6, HTML5
                  and CSS3.
                </p>
              </div>

              <div className="about-card">
                <div className="about-icon">💾</div>
                <h2>Storage</h2>
                <p>
                  Tasks are saved in browser localStorage.
                </p>
              </div>

            </div>

            <div className="workflow-card">

              <h2>Application Workflow</h2>

              <div className="workflow">

                <div>
                  <span>1</span>
                  <strong>Create</strong>
                  <p>Add a task</p>
                </div>

                <div>
                  <span>2</span>
                  <strong>Manage</strong>
                  <p>Edit or delete</p>
                </div>

                <div>
                  <span>3</span>
                  <strong>Complete</strong>
                  <p>Mark as completed</p>
                </div>

                <div>
                  <span>4</span>
                  <strong>Track</strong>
                  <p>View progress</p>
                </div>

              </div>

            </div>

          </section>
        )}

      </main>

      <footer>
        <p>
          Daily Task Manager © 2026 | ReactJS Assignment
        </p>
      </footer>

    </div>
  )
}

export default App