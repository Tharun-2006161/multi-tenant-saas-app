import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
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
      console.error("Fetch error", err);
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
        console.error("Token decode error", error);
        localStorage.removeItem('token');
        navigate('/login');
      }
      fetchProjects();
    }
  }, [navigate]);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalProjects = projects.length;
  const recentProjects = projects.filter(p => {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    return new Date(p.created_at || Date.now()) > oneDayAgo;
  }).length;

  const handleCreateProject = async (e) => {
    e.preventDefault();
    // Extra safety check before sending to API
    if (!projectName.trim() || !description.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/projects', 
        { name: projectName, description }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects((prev) => [...prev, response.data]);
      setProjectName(''); 
      setDescription('');
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || "Server issue"));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this project?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProjects((prev) => prev.filter(p => p.id !== id));
      } catch (err) { alert("Delete failed"); }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Validation Check: Button is only enabled if fields aren't empty
  const isFormInvalid = !projectName.trim() || !description.trim();

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      
      {/* HEADER BAR */}
      <nav style={{ backgroundColor: '#1a73e8', color: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: 0 }}>SaaS Pro Dashboard</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>Welcome, <strong>{userName}</strong></span>
          <button onClick={handleLogout} style={{ backgroundColor: 'white', border: 'none', color: '#1a73e8', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
        
        {/* STATS ROW */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
          <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderLeft: '6px solid #1a73e8' }}>
            <p style={{ margin: 0, color: '#5f6368', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Projects</p>
            <h2 style={{ margin: '5px 0 0 0', color: '#333' }}>{totalProjects}</h2>
          </div>
          <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderLeft: '6px solid #34a853' }}>
            <p style={{ margin: 0, color: '#5f6368', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Recent (24h)</p>
            <h2 style={{ margin: '5px 0 0 0', color: '#333' }}>{recentProjects}</h2>
          </div>
        </div>

        {/* CREATE SECTION */}
        <section style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>New Project</h3>
          <form onSubmit={handleCreateProject} style={{ display: 'flex', gap: '15px' }}>
            <input 
              placeholder="Project Name" 
              value={projectName} 
              onChange={(e) => setProjectName(e.target.value)} 
              required 
              style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }} 
            />
            <input 
              placeholder="Details" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
              style={{ flex: 2, padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }} 
            />
            <button 
              type="submit" 
              disabled={isFormInvalid}
              style={{ 
                backgroundColor: isFormInvalid ? '#ccc' : '#1a73e8', 
                color: 'white', 
                border: 'none', 
                padding: '10px 25px', 
                borderRadius: '6px', 
                fontWeight: 'bold', 
                cursor: isFormInvalid ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s ease'
              }}
            >
              Create
            </button>
          </form>
        </section>

        {/* SEARCH BAR */}
        <div style={{ marginBottom: '30px' }}>
          <input 
            type="text"
            placeholder="🔍 Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #ccc', fontSize: '16px', boxSizing: 'border-box' }}
          />
        </div>

        {/* PROJECTS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '40px' }}>
              <div style={{ 
                border: '4px solid #f3f3f3', 
                borderTop: '4px solid #1a73e8', 
                borderRadius: '50%', 
                width: '40px', 
                height: '40px', 
                animation: 'spin 1s linear infinite',
                margin: '0 auto 10px'
              }}></div>
              <p style={{ color: '#5f6368' }}>Loading projects...</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map(p => (
              <div key={p.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#1a73e8' }}>{p.name}</h4>
                  <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
                </div>
                <p style={{ color: '#5f6368', fontSize: '14px', lineHeight: '1.5' }}>{p.description}</p>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#888', padding: '40px' }}>No projects found.</p>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;