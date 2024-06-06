import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await axios.get(`${API_URL}/todos`);
      setTasks(response.data);
    };
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (task.trim()) {
      await axios.post(`${API_URL}/todos`, { title: task });
      setTask('');
      const response = await axios.get(`${API_URL}/todos`);
      setTasks(response.data);
    }
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/todos/${id}`);
    const response = await axios.get(`${API_URL}/todos`);
    setTasks(response.data);
  };

  return (
    <div className="app">
      <div className="reminder-app">
        <input
          type="text"
          placeholder="Enter a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              {task.title} <button onClick={() => deleteTask(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
