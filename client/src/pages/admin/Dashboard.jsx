import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { API_BASE } from '@/lib/constants';
import Button from '@/components/ui/Button';
import GlowCard from '@/components/ui/GlowCard';

/**
 * Admin Dashboard featuring full CRUD management controls for projects, skills, experience, and contact messages
 */
export default function Dashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('messages');

  // Dashboard datasets
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);

  // Form states
  const [newProject, setNewProject] = useState({ title: '', description: '', image: '', github: '#', liveUrl: '#', techStack: '', category: 'frontend', featured: false });
  const [newSkill, setNewSkill] = useState({ name: '', category: 'frontend', proficiency: 80, icon: '💻' });
  const [newExperience, setNewExperience] = useState({ company: '', role: '', duration: '', description: '', achievements: '' });

  // Error/Success status
  const [status, setStatus] = useState({ type: '', msg: '' });

  // Fetch all datasets
  const fetchData = async () => {
    try {
      const [msgRes, projRes, skillRes, expRes] = await Promise.all([
        axios.get(`${API_BASE}/contact`),
        axios.get(`${API_BASE}/projects`),
        axios.get(`${API_BASE}/skills`),
        axios.get(`${API_BASE}/experience`),
      ]);
      setMessages(msgRes.data);
      setProjects(projRes.data);
      setSkills(skillRes.data);
      setExperiences(expRes.data);
    } catch (err) {
      console.error('Fetch dashboard data failed:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showStatus = (type, msg) => {
    setStatus({ type, msg });
    setTimeout(() => setStatus({ type: '', msg: '' }), 4000);
  };

  // CRUD handlers
  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProject,
        techStack: newProject.techStack.split(',').map(t => t.trim()).filter(Boolean),
      };
      await axios.post(`${API_BASE}/projects`, payload);
      setNewProject({ title: '', description: '', image: '', github: '#', liveUrl: '#', techStack: '', category: 'frontend', featured: false });
      showStatus('success', 'Project created successfully');
      fetchData();
    } catch (err) {
      showStatus('error', err.response?.data?.message || 'Create project failed');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await axios.delete(`${API_BASE}/projects/${id}`);
      showStatus('success', 'Project deleted successfully');
      fetchData();
    } catch (err) {
      showStatus('error', 'Delete project failed');
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/skills`, newSkill);
      setNewSkill({ name: '', category: 'frontend', proficiency: 80, icon: '💻' });
      showStatus('success', 'Skill created successfully');
      fetchData();
    } catch (err) {
      showStatus('error', err.response?.data?.message || 'Create skill failed');
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await axios.delete(`${API_BASE}/skills/${id}`);
      showStatus('success', 'Skill deleted successfully');
      fetchData();
    } catch (err) {
      showStatus('error', 'Delete skill failed');
    }
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newExperience,
        achievements: newExperience.achievements.split('\n').map(a => a.trim()).filter(Boolean),
      };
      await axios.post(`${API_BASE}/experience`, payload);
      setNewExperience({ company: '', role: '', duration: '', description: '', achievements: '' });
      showStatus('success', 'Experience created successfully');
      fetchData();
    } catch (err) {
      showStatus('error', err.response?.data?.message || 'Create experience failed');
    }
  };

  const handleDeleteExperience = async (id) => {
    if (!window.confirm('Delete this experience?')) return;
    try {
      await axios.delete(`${API_BASE}/experience/${id}`);
      showStatus('success', 'Experience entry deleted successfully');
      fetchData();
    } catch (err) {
      showStatus('error', 'Delete experience entry failed');
    }
  };

  const handleMarkReadMessage = async (id) => {
    try {
      await axios.put(`${API_BASE}/contact/${id}/read`);
      fetchData();
    } catch (err) {
      showStatus('error', 'Update message status failed');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await axios.delete(`${API_BASE}/contact/${id}`);
      showStatus('success', 'Message deleted');
      fetchData();
    } catch (err) {
      showStatus('error', 'Delete message failed');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const inputStyle = "w-full px-4 py-2.5 rounded-lg bg-white/5 border border-border-glass text-text-primary placeholder-text-muted focus:border-accent-violet/50 focus:outline-none transition-colors duration-300 font-body text-xs";

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Navbar */}
      <header className="border-b border-border-glass bg-bg-secondary/40 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-[100]">
        <h1 className="font-display font-extrabold text-xl gradient-text">
          Control Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[0.65rem] text-text-muted uppercase hidden sm:block">
            Signed in as: {user?.email}
          </span>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Status notification */}
        {status.msg && (
          <div className={`mb-6 p-4 rounded-xl border font-mono text-xs text-center ${
            status.type === 'success'
              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
              : 'border-red-500/20 bg-red-500/10 text-red-400'
          }`}>
            {status.msg}
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-border-glass pb-4">
          {[
            { id: 'messages', label: `Messages (${messages.length})` },
            { id: 'projects', label: `Projects (${projects.length})` },
            { id: 'skills', label: `Skills (${skills.length})` },
            { id: 'experience', label: `Experience (${experiences.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-accent-violet/20 border border-accent-violet text-text-primary'
                  : 'border border-border-glass text-text-muted hover:border-accent-violet/30 hover:text-text-secondary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        <div className="grid grid-cols-1 gap-8">
          {/* messages panel */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-text-muted font-mono text-xs">
                  No contact messages found.
                </div>
              ) : (
                messages.map((msg) => (
                  <GlowCard key={msg._id} className="p-6" glowColor="rgba(124, 109, 250, 0.1)">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                      <div>
                        <h4 className="font-display font-bold text-base text-text-primary flex items-center gap-2">
                          {msg.name}
                          {!msg.read && (
                            <span className="px-2 py-0.5 rounded-full bg-accent-cyan/20 border border-accent-cyan/30 text-accent-cyan font-mono text-[0.55rem] tracking-wider uppercase">
                              New
                            </span>
                          )}
                        </h4>
                        <span className="font-mono text-xs text-text-muted">{msg.email}</span>
                      </div>
                      <div className="flex gap-2">
                        {!msg.read && (
                          <Button variant="success" size="sm" onClick={() => handleMarkReadMessage(msg._id)}>
                            Mark Read
                          </Button>
                        )}
                        <Button variant="danger" size="sm" onClick={() => handleDeleteMessage(msg._id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                    <p className="font-body text-sm text-text-secondary whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </GlowCard>
                ))
              )}
            </div>
          )}

          {/* projects panel */}
          {activeTab === 'projects' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form */}
              <div className="lg:col-span-4">
                <GlowCard className="p-6" glowColor="rgba(255, 107, 157, 0.15)">
                  <h3 className="font-display font-bold text-base text-text-primary mb-6">
                    Add New Project
                  </h3>
                  <form onSubmit={handleAddProject} className="space-y-4">
                    <input
                      type="text"
                      required
                      placeholder="Title"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      className={inputStyle}
                    />
                    <textarea
                      required
                      placeholder="Description"
                      rows={3}
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      className={`${inputStyle} resize-none`}
                    />
                    <input
                      type="text"
                      required
                      placeholder="Image URL"
                      value={newProject.image}
                      onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                      className={inputStyle}
                    />
                    <input
                      type="text"
                      placeholder="GitHub URL"
                      value={newProject.github}
                      onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                      className={inputStyle}
                    />
                    <input
                      type="text"
                      placeholder="Live URL"
                      value={newProject.liveUrl}
                      onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                      className={inputStyle}
                    />
                    <input
                      type="text"
                      required
                      placeholder="Tech Stack (comma separated)"
                      value={newProject.techStack}
                      onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                      className={inputStyle}
                    />
                    <select
                      value={newProject.category}
                      onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                      className={inputStyle}
                    >
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="fullstack">Full Stack</option>
                    </select>
                    <label className="flex items-center gap-2 font-mono text-[0.65rem] text-text-secondary cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newProject.featured}
                        onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                        className="rounded border-border-glass bg-transparent accent-accent-violet"
                      />
                      Featured Project
                    </label>
                    <Button type="submit" variant="primary" className="w-full py-2.5">
                      Create Project
                    </Button>
                  </form>
                </GlowCard>
              </div>

              {/* List */}
              <div className="lg:col-span-8 space-y-4">
                {projects.map((proj) => (
                  <GlowCard key={proj._id} className="p-5 flex justify-between items-center" glowColor="rgba(255, 107, 157, 0.1)">
                    <div>
                      <h4 className="font-display font-bold text-sm text-text-primary">
                        {proj.title}
                      </h4>
                      <span className="font-mono text-[0.6rem] text-text-muted tracking-wider uppercase block mt-1">
                        {proj.category} · {proj.featured ? 'Featured' : 'Standard'}
                      </span>
                    </div>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteProject(proj._id)}>
                      Delete
                    </Button>
                  </GlowCard>
                ))}
              </div>
            </div>
          )}

          {/* skills panel */}
          {activeTab === 'skills' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form */}
              <div className="lg:col-span-4">
                <GlowCard className="p-6" glowColor="rgba(124, 109, 250, 0.15)">
                  <h3 className="font-display font-bold text-base text-text-primary mb-6">
                    Add New Skill
                  </h3>
                  <form onSubmit={handleAddSkill} className="space-y-4">
                    <input
                      type="text"
                      required
                      placeholder="Skill Name"
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                      className={inputStyle}
                    />
                    <select
                      value={newSkill.category}
                      onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                      className={inputStyle}
                    >
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="database">Database</option>
                      <option value="tools">Tools</option>
                    </select>
                    <div>
                      <label className="block font-mono text-[0.6rem] text-text-muted mb-1">
                        Proficiency: {newSkill.proficiency}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={newSkill.proficiency}
                        onChange={(e) => setNewSkill({ ...newSkill, proficiency: Number(e.target.value) })}
                        className="w-full accent-accent-violet"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Icon (e.g. ⚛️)"
                      value={newSkill.icon}
                      onChange={(e) => setNewSkill({ ...newSkill, icon: e.target.value })}
                      className={inputStyle}
                    />
                    <Button type="submit" variant="primary" className="w-full py-2.5">
                      Create Skill
                    </Button>
                  </form>
                </GlowCard>
              </div>

              {/* List */}
              <div className="lg:col-span-8 space-y-4">
                {skills.map((skill) => (
                  <GlowCard key={skill._id} className="p-5 flex justify-between items-center" glowColor="rgba(124, 109, 250, 0.1)">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{skill.icon}</span>
                      <div>
                        <h4 className="font-display font-bold text-sm text-text-primary">
                          {skill.name}
                        </h4>
                        <span className="font-mono text-[0.6rem] text-text-muted tracking-wider uppercase">
                          {skill.category} · {skill.proficiency}%
                        </span>
                      </div>
                    </div>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteSkill(skill._id)}>
                      Delete
                    </Button>
                  </GlowCard>
                ))}
              </div>
            </div>
          )}

          {/* experience panel */}
          {activeTab === 'experience' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form */}
              <div className="lg:col-span-4">
                <GlowCard className="p-6" glowColor="rgba(0, 212, 255, 0.15)">
                  <h3 className="font-display font-bold text-base text-text-primary mb-6">
                    Add Experience
                  </h3>
                  <form onSubmit={handleAddExperience} className="space-y-4">
                    <input
                      type="text"
                      required
                      placeholder="Company"
                      value={newExperience.company}
                      onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                      className={inputStyle}
                    />
                    <input
                      type="text"
                      required
                      placeholder="Role"
                      value={newExperience.role}
                      onChange={(e) => setNewExperience({ ...newExperience, role: e.target.value })}
                      className={inputStyle}
                    />
                    <input
                      type="text"
                      required
                      placeholder="Duration (e.g. 2024 - Present)"
                      value={newExperience.duration}
                      onChange={(e) => setNewExperience({ ...newExperience, duration: e.target.value })}
                      className={inputStyle}
                    />
                    <textarea
                      required
                      placeholder="Description"
                      rows={3}
                      value={newExperience.description}
                      onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                      className={`${inputStyle} resize-none`}
                    />
                    <textarea
                      placeholder="Achievements (one per line)"
                      rows={3}
                      value={newExperience.achievements}
                      onChange={(e) => setNewExperience({ ...newExperience, achievements: e.target.value })}
                      className={`${inputStyle} resize-none`}
                    />
                    <Button type="submit" variant="primary" className="w-full py-2.5">
                      Create Experience
                    </Button>
                  </form>
                </GlowCard>
              </div>

              {/* List */}
              <div className="lg:col-span-8 space-y-4">
                {experiences.map((exp) => (
                  <GlowCard key={exp._id} className="p-5 flex justify-between items-center" glowColor="rgba(0, 212, 255, 0.1)">
                    <div>
                      <h4 className="font-display font-bold text-sm text-text-primary">
                        {exp.role}
                      </h4>
                      <span className="font-mono text-[0.6rem] text-text-muted tracking-wider uppercase mt-1 block">
                        {exp.company} · {exp.duration}
                      </span>
                    </div>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteExperience(exp._id)}>
                      Delete
                    </Button>
                  </GlowCard>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
