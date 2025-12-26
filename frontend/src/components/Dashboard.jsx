// 1. Updated Fetch Projects
const fetchProjects = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('token');
    // FIXED: Use VITE_API_URL instead of localhost
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/projects`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setProjects(Array.isArray(response.data) ? response.data : []);
  } catch (err) {
    toast.error("Could not load projects");
  } finally {
    setLoading(false);
  }
};

// 2. Updated Create Project
const handleCreateProject = async (e) => {
  e.preventDefault();
  if (!projectName.trim() || !description.trim()) return;
  const createToast = toast.loading('Creating project...');
  try {
    const token = localStorage.getItem('token');
    // FIXED: Use VITE_API_URL instead of localhost
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/projects`, 
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

// 3. Updated Delete Project
const handleDelete = async (id) => {
  if (!window.confirm("Permanently delete this project?")) return;
  const deleteToast = toast.loading('Deleting...');
  try {
    const token = localStorage.getItem('token');
    // FIXED: Use VITE_API_URL instead of localhost
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/projects/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setProjects((prev) => prev.filter(p => p.id !== id));
    toast.success('Project deleted', { id: deleteToast });
  } catch (err) { 
    console.error("Delete failed:", err);
    toast.error('Delete failed - try refreshing', { id: deleteToast }); 
  }
};
export default Dashboard;