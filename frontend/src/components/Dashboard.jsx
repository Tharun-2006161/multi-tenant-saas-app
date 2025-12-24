import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(response.data);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/projects', 
        { name, description }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName('');
      setDescription('');
      fetchProjects();
    } catch (err) {
      alert("Error creating project");
    }
  };

  // --- NEW DELETE FUNCTION ---
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProjects(); // Refresh the list
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Project Dashboard</h2>
        <button onClick={handleLogout} style={{ backgroundColor: '#555', color: 'white', border: 'none', padding: '10px', borderRadius: '5px' }}>Logout</button>
      </div>

      <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f4f4f4' }}>
        <h3>Create New Project</h3>
        <form onSubmit={handleCreateProject}>
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ marginRight: '10px' }} />
          <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ marginRight: '10px' }} />
          <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '4px' }}>Add Project</button>
        </form>
      </div>

      <hr />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
        {projects.map(p => (
          <div key={p.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '10px', backgroundColor: 'white', position: 'relative' }}>
            <h4>{p.name}</h4>
            <p style={{ color: '#666' }}>{p.description}</p>
            {/* DELETE BUTTON */}
            <button 
              onClick={() => handleDelete(p.id)} 
              style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;