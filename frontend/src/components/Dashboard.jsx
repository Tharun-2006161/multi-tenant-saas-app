import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // If no token exists, send the user back to Login
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/projects', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setProjects(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching projects", err);
        // If the token is expired or invalid, log them out
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchProjects();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading your secure workspace...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Project Dashboard</h2>
        <button 
          onClick={handleLogout}
          style={{ padding: '8px 16px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
      <hr />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {projects.length === 0 ? (
          <p>No projects found. Use Thunder Client to add some to your tenant!</p>
        ) : (
          projects.map(project => (
            <div key={project.id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{project.name}</h3>
              <p style={{ color: '#666', fontSize: '14px' }}>{project.description}</p>
              <div style={{ marginTop: '15px' }}>
                <span style={{ 
                  backgroundColor: project.status === 'completed' ? '#d4edda' : '#fff3cd',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {project.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;