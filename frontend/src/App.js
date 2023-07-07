import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: '',
    assignedUser: '',
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createTask = async () => {
    try {
      const response = await axios.post('http://localhost:5000/tasks', newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks([...tasks, response.data]);
      setNewTask({
        title: '',
        description: '',
        dueDate: '',
        status: '',
        assignedUser: '',
      });
    } catch (error) {
      console.log(error);
    }
  };

  const login = async () => {
    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        username,
        password,
      });
      const { token } = response.data;
      setToken(token);
      setLoggedIn(true);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    setToken('');
    setLoggedIn(false);
  };

  const updateTask = async (id, updatedTask) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${id}`, updatedTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedTasks = tasks.map((task) => (task.id === id ? updatedTask : task));
      setTasks(updatedTasks);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {!loggedIn ? (
        <div>
          <h1>Login</h1>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button onClick={login}>Login</button>
        </div>
      ) : (
        <div>
          <h1>Task Management System</h1>
          <button onClick={logout}>Logout</button>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createTask();
            }}
          >
            <input
              type="text"
              placeholder="Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              required
            />
            <input
              type="date"
              placeholder="Due Date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Status"
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Assigned User"
              value={newTask.assignedUser}
              onChange={(e) => setNewTask({ ...newTask, assignedUser: e.target.value })}
              required
            />
            <button type="submit">Create Task</button>
          </form>
          <h2>Tasks</h2>
          {tasks.map((task) => (
            <div key={task.id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Due Date: {task.dueDate}</p>
              <p>Status: {task.status}</p>
              <p>Assigned User: {task.assignedUser}</p>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
              <button
                onClick={() => {
                  const updatedTask = {
                    ...task,
                    status: task.status === 'Pending' ? 'Completed' : 'Pending',
                  };
                  updateTask(task.id, updatedTask);
                }}
              >
                Mark as {task.status === 'Pending' ? 'Completed' : 'Pending'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
