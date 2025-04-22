import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import TaskColumn from './components/TaskColumn';
import TaskForm from './components/TaskForm';

function App() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define API URL - replace with your actual API
  const API_URL = 'https://jsonplaceholder.typicode.com/todos';

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      let data = await response.json();
      
      // Transform data to fit our schema 
      data = data.slice(0, 15).map(item => ({
        id: item.id,
        title: item.title,
        description: `Task description ${item.id}`,
        status: item.completed ? 'Done' : item.id % 3 === 0 ? 'In Progress' : 'To Do'
      }));
      
      setTasks(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (newTask) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      
      const data = await response.json();
      
      // For jsonplaceholder, it doesn't actually save our data but returns a response with an id
      const taskWithId = {
        ...newTask,
        id: data.id || tasks.length + 1
      };
      
      setTasks([...tasks, taskWithId]);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
      console.error('Error adding task:', err);
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    try {
      // Optimistically update UI
      const updatedTasks = tasks.map(task => 
        task.id === id ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);
      
      // API call to update task
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task status');
      }
      
      // Note: jsonplaceholder doesn't actually update the data but would return a response in a real API
    } catch (err) {
      // Revert the optimistic update if API call fails
      setError(err.message);
      console.error('Error updating task:', err);
      fetchTasks(); // Refresh tasks from server
    }
  };

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData('taskId'));
    updateTaskStatus(taskId, status);
  };

  if (loading) {
    return <div className="container text-center my-5"><div className="spinner-border" role="status"></div></div>;
  }

  if (error) {
    return <div className="container alert alert-danger my-5">Error: {error}</div>;
  }

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Task Management Dashboard</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(true)}
        >
          Add New Task
        </button>
      </div>

      <div className="row">
        {['To Do', 'In Progress', 'Done'].map(status => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks.filter(task => task.status === status)}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ))}
      </div>

      {showForm && (
        <TaskForm 
          onAddTask={addTask} 
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

export default App;