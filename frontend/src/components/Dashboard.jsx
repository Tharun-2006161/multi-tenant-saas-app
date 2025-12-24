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
      fetchProjects(); // Refresh the list automatically!
    } catch (err) {
      alert("Error creating project");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Project Dashboard</h2>
        <button onClick={handleLogout} style={{ backgroundColor: 'red', color: 'white' }}>Logout</button>
      </div>

      {/* NEW PROJECT FORM */}
      <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #444', borderRadius: '8px' }}>
        <h3>Create New Project</h3>
        <form onSubmit={handleCreateProject}>
          <input placeholder="Project Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          <button type="submit">Add Project</button>
        </form>
      </div>

      <hr />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {projects.map(p => (
          <div key={p.id} style={{ border: '1px solid #ccc', padding: '10px' }}>
            <h4>{p.name}</h4>
            <p>{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;