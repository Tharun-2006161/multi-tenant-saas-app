import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import './App.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [userName, setUserName] = useState('User');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      toast.error("Could not load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.full_name || "User");
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      fetchProjects();
    }
  }, [navigate]);

  const filteredProjects = projects.filter(project =>
    (project.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalProjects = projects.length;
  const recentProjects = projects.filter(p => {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    return new Date(p.created_at) > oneDayAgo;
  }).length;

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectName.trim() || !description.trim()) return;
    const createToast = toast.loading('Creating project...');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/projects', 
        { name: projectName, description, category }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects((prev) => [response.data, ...prev]);
      setProjectName(''); 
      setDescription('');
      setCategory('General');
      toast.success('Project created!', { id: createToast });
    } catch (err) {
      toast.error('Failed to create project', { id: createToast });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this project?")) return;
    const deleteToast = toast.loading('Deleting...');
    try {
      const token = localStorage.getItem('token');
      // Using the absolute path to port 5000 ensures no connection refusal
      await axios.delete(`http://localhost:5000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update the UI only after success
      setProjects((prev) => prev.filter(p => p.id !== id));
      toast.success('Project deleted', { id: deleteToast });
    } catch (err) { 
      console.error("Delete failed:", err);
      toast.error('Delete failed - try refreshing', { id: deleteToast }); 
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast('Logged out', { icon: '👋' });
    navigate('/login');
  };

  const isFormInvalid = !projectName.trim() || !description.trim();

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif', paddingBottom: '40px' }}>
      <Toaster position="top-right" />
      <nav style={{ backgroundColor: '#1a73e8', color: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: 0 }}>SaaS Pro Dashboard</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>Welcome, <strong>{userName}</strong></span>
          <button onClick={handleLogout} style={{ backgroundColor: 'white', border: 'none', color: '#1a73e8', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
          <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '12px', borderLeft: '6px solid #1a73e8', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <p style={{ margin: 0, color: '#5f6368', fontSize: '12px', fontWeight: 'bold' }}>TOTAL PROJECTS</p>
            <h2 style={{ margin: '5px 0 0 0' }}>{totalProjects}</h2>
          </div>
          <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '12px', borderLeft: '6px solid #34a853', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <p style={{ margin: 0, color: '#5f6368', fontSize: '12px', fontWeight: 'bold' }}>RECENT (24H)</p>
            <h2 style={{ margin: '5px 0 0 0' }}>{recentProjects}</h2>
          </div>
        </div>

        <section style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px' }}>New Project</h3>
          <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '15px' }}>
                <input placeholder="Project Name" value={projectName} onChange={(e) => setProjectName(e.target.value)} required style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }} />
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: 'white' }}>
                    <option value="General">General</option>
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                </select>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
                <input placeholder="Details / Description" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }} />
                <button type="submit" disabled={isFormInvalid} style={{ backgroundColor: isFormInvalid ? '#ccc' : '#1a73e8', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '6px', fontWeight: 'bold', cursor: isFormInvalid ? 'not-allowed' : 'pointer' }}>Create</button>
            </div>
          </form>
        </section>

        <div style={{ position: 'relative', marginBottom: '30px' }}>
          <input type="text" placeholder="🔍 Search projects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #ccc', fontSize: '16px', boxSizing: 'border-box' }} />
          {searchTerm && <button onClick={() => setSearchTerm('')} style={{ position: 'absolute', right: '15px', top: '15px', border: 'none', background: 'none', color: '#999', cursor: 'pointer' }}>Clear</button>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '40px' }}>
              <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #1a73e8', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 10px' }}></div>
              <p>Loading projects...</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map(p => (
              <div key={p.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #eee', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '15px', right: '45px', fontSize: '10px', backgroundColor: '#e8f0fe', color: '#1a73e8', padding: '3px 8px', borderRadius: '10px', fontWeight: 'bold' }}>{p.category || 'General'}</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ margin: '0 0 5px 0', color: '#1a73e8' }}>{p.name}</h4>
                  <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
                </div>
                <p style={{ color: '#5f6368', fontSize: '13px', lineHeight: '1.5', margin: '0 0 10px 0' }}>{p.description}</p>
                <div style={{ fontSize: '11px', color: '#999', borderTop: '1px solid #f5f5f5', paddingTop: '8px' }}>Created: {new Date(p.created_at).toLocaleDateString()}</div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '60px 20px', backgroundColor: 'white', borderRadius: '15px', border: '2px dashed #ddd' }}>
              <div style={{ fontSize: '50px' }}>📁</div>
              <h3>{searchTerm ? "No matches found" : "Your workspace is empty"}</h3>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Dashboard;