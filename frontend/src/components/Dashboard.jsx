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

  useEffect(() => { fetchProjects(); }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/projects', { name, description }, 
        { headers: { Authorization: `Bearer ${token}` } });
      setName(''); setDescription('');
      fetchProjects();
    } catch (err) { alert("Error creating project"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this project?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProjects();
      } catch (err) { alert("Delete failed"); }
    }
  };

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      {/* HEADER BAR */}
      <nav style={{ backgroundColor: '#1a73e8', color: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: 0 }}>SaaS Pro Dashboard</h2>
        <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} style={{ backgroundColor: 'transparent', border: '1px solid white', color: 'white', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
        
        {/* CREATE SECTION */}
        <section style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>New Project</h3>
          <form onSubmit={handleCreateProject} style={{ display: 'flex', gap: '15px' }}>
            <input placeholder="Project Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }} />
            <input placeholder="Details" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ flex: 2, padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }} />
            <button type="submit" style={{ backgroundColor: '#1a73e8', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Create</button>
          </form>
        </section>

        {/* PROJECTS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {projects.map(p => (
            <div key={p.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #eee', transition: 'transform 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#1a73e8' }}>{p.name}</h4>
                <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontWeight: 'bold' }}>&times;</button>
              </div>
              <p style={{ color: '#5f6368', fontSize: '14px', lineHeight: '1.5' }}>{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;