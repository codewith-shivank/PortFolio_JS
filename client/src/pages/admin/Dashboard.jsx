import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  collection,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import {
  FaEnvelope,
  FaComments,
  FaHeart,
  FaUsers,
  FaTrash,
  FaCheck,
  FaArchive,
  FaShieldAlt,
} from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { API_BASE, PROJECTS_DATA } from '@/lib/constants';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import Button from '@/components/ui/Button';
import GlowCard from '@/components/ui/GlowCard';

/**
 * Admin Dashboard featuring full Firestore real-time control for:
 * - Contact Inquiries (unread/read/archived, delete)
 * - Guestbook Endorsements (moderation, delete)
 * - Project Likes Engagement analytics
 * - Authenticated Visitors / User directory
 * - MERN Projects, Skills, and Experience management
 */
export default function Dashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inquiries');

  // Firestore Real-time Datasets
  const [inquiries, setInquiries] = useState([]);
  const [guestbook, setGuestbook] = useState([]);
  const [projectLikes, setProjectLikes] = useState([]);
  const [usersList, setUsersList] = useState([]);

  // Local/MERN API Datasets
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);

  // Form states
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    image: '',
    github: '#',
    liveUrl: '#',
    techStack: '',
    category: 'frontend',
    featured: false,
  });
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'frontend',
    proficiency: 80,
    icon: '💻',
  });
  const [newExperience, setNewExperience] = useState({
    company: '',
    role: '',
    duration: '',
    description: '',
    achievements: '',
  });

  // Error/Success status
  const [status, setStatus] = useState({ type: '', msg: '' });

  // 1. Subscribe to Firestore Collections in Real-time
  useEffect(() => {
    // Inquiries
    const unsubInquiries = onSnapshot(
      collection(db, 'inquiries'),
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setInquiries(docs);
      },
      (err) => console.error('Inquiries snapshot error:', err)
    );

    // Guestbook
    const unsubGuestbook = onSnapshot(
      collection(db, 'guestbook'),
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setGuestbook(docs);
      },
      (err) => console.error('Guestbook snapshot error:', err)
    );

    // Project Likes
    const unsubLikes = onSnapshot(
      collection(db, 'projectLikes'),
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setProjectLikes(docs);
      },
      (err) => console.error('Likes snapshot error:', err)
    );

    // Users
    const unsubUsers = onSnapshot(
      collection(db, 'users'),
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        docs.sort((a, b) => new Date(b.lastLoginAt) - new Date(a.lastLoginAt));
        setUsersList(docs);
      },
      (err) => console.error('Users snapshot error:', err)
    );

    return () => {
      unsubInquiries();
      unsubGuestbook();
      unsubLikes();
      unsubUsers();
    };
  }, []);

  // 2. Fetch MERN API datasets (gracefully fallback if offline)
  const fetchMernData = async () => {
    try {
      const [projRes, skillRes, expRes] = await Promise.allSettled([
        axios.get(`${API_BASE}/projects`),
        axios.get(`${API_BASE}/skills`),
        axios.get(`${API_BASE}/experience`),
      ]);
      if (projRes.status === 'fulfilled') setProjects(projRes.value.data);
      if (skillRes.status === 'fulfilled') setSkills(skillRes.value.data);
      if (expRes.status === 'fulfilled') setExperiences(expRes.value.data);
    } catch (err) {
      console.error('Fetch MERN data failed:', err);
    }
  };

  useEffect(() => {
    fetchMernData();
  }, []);

  const showStatus = (type, msg) => {
    setStatus({ type, msg });
    setTimeout(() => setStatus({ type: '', msg: '' }), 4000);
  };

  // Firestore Inquiry Handlers
  const handleUpdateInquiryStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'inquiries', id), { status: newStatus });
      showStatus('success', `Inquiry marked as ${newStatus}`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `inquiries/${id}`);
      showStatus('error', 'Failed to update status');
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Delete this inquiry permanently from Firestore?')) return;
    try {
      await deleteDoc(doc(db, 'inquiries', id));
      showStatus('success', 'Inquiry deleted');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `inquiries/${id}`);
      showStatus('error', 'Failed to delete inquiry');
    }
  };

  // Firestore Guestbook Handlers
  const handleDeleteGuestbook = async (id) => {
    if (!window.confirm('Delete this endorsement from Firestore?')) return;
    try {
      await deleteDoc(doc(db, 'guestbook', id));
      showStatus('success', 'Endorsement removed');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `guestbook/${id}`);
      showStatus('error', 'Failed to delete endorsement');
    }
  };

  // MERN CRUD Handlers
  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProject,
        techStack: newProject.techStack
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };
      await axios.post(`${API_BASE}/projects`, payload);
      setNewProject({
        title: '',
        description: '',
        image: '',
        github: '#',
        liveUrl: '#',
        techStack: '',
        category: 'frontend',
        featured: false,
      });
      showStatus('success', 'Project created successfully');
      fetchMernData();
    } catch (err) {
      showStatus('error', err.response?.data?.message || 'Create project failed');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await axios.delete(`${API_BASE}/projects/${id}`);
      showStatus('success', 'Project deleted successfully');
      fetchMernData();
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
      fetchMernData();
    } catch (err) {
      showStatus('error', err.response?.data?.message || 'Create skill failed');
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await axios.delete(`${API_BASE}/skills/${id}`);
      showStatus('success', 'Skill deleted successfully');
      fetchMernData();
    } catch (err) {
      showStatus('error', 'Delete skill failed');
    }
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newExperience,
        achievements: newExperience.achievements
          .split('\n')
          .map((a) => a.trim())
          .filter(Boolean),
      };
      await axios.post(`${API_BASE}/experience`, payload);
      setNewExperience({
        company: '',
        role: '',
        duration: '',
        description: '',
        achievements: '',
      });
      showStatus('success', 'Experience created successfully');
      fetchMernData();
    } catch (err) {
      showStatus('error', err.response?.data?.message || 'Create experience failed');
    }
  };

  const handleDeleteExperience = async (id) => {
    if (!window.confirm('Delete this experience?')) return;
    try {
      await axios.delete(`${API_BASE}/experience/${id}`);
      showStatus('success', 'Experience entry deleted successfully');
      fetchMernData();
    } catch (err) {
      showStatus('error', 'Delete experience entry failed');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Group likes count by project
  const likesCountByProject = projectLikes.reduce((acc, like) => {
    acc[like.projectId] = (acc[like.projectId] || 0) + 1;
    return acc;
  }, {});

  const inputStyle =
    'w-full px-4 py-2.5 rounded-lg bg-white/5 border border-border-glass text-text-primary placeholder-text-muted focus:border-accent-violet/50 focus:outline-none transition-colors duration-300 font-body text-xs';

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Navbar */}
      <header className="border-b border-border-glass bg-bg-secondary/40 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-[100]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-600/20 text-purple-400">
            <FaShieldAlt className="text-base" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-lg text-white">
              Portfolio Control Center
            </h1>
            <p className="font-mono text-[0.65rem] text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected to Cloud Firestore & Google Auth
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-mono text-[0.65rem] text-text-muted uppercase hidden sm:block">
            {user?.email}
          </span>
          <Button variant="secondary" size="sm" onClick={() => navigate('/')}>
            View Portfolio ↗
          </Button>
          <Button variant="danger" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Status notification */}
        {status.msg && (
          <div
            className={`mb-6 p-4 rounded-xl border font-mono text-xs text-center ${
              status.type === 'success'
                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                : 'border-red-500/20 bg-red-500/10 text-red-400'
            }`}
          >
            {status.msg}
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-border-glass pb-4">
          {[
            {
              id: 'inquiries',
              label: `Inquiries (${inquiries.length})`,
              icon: FaEnvelope,
            },
            {
              id: 'guestbook',
              label: `Guestbook (${guestbook.length})`,
              icon: FaComments,
            },
            {
              id: 'likes',
              label: `Project Likes (${projectLikes.length})`,
              icon: FaHeart,
            },
            {
              id: 'users',
              label: `Registered Users (${usersList.length})`,
              icon: FaUsers,
            },
            {
              id: 'projects',
              label: `Projects (${projects.length || PROJECTS_DATA.length})`,
            },
            { id: 'skills', label: `Skills (${skills.length})` },
            { id: 'experience', label: `Experience (${experiences.length})` },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-purple-600/30 border border-purple-500 text-white font-semibold'
                    : 'border border-white/10 text-neutral-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {Icon && <Icon className="text-xs" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab panels */}
        <div className="grid grid-cols-1 gap-8">
          {/* 1. Firestore Inquiries */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2">
                <h2 className="font-display font-bold text-base text-white">
                  Contact Inquiries ({inquiries.length})
                </h2>
                <span className="font-mono text-xs text-text-muted">
                  Stored in Firestore `/inquiries`
                </span>
              </div>

              {inquiries.length === 0 ? (
                <div className="text-center py-16 text-text-muted font-mono text-xs border border-white/5 rounded-2xl bg-white/[0.01]">
                  No inquiries received yet.
                </div>
              ) : (
                inquiries.map((inq) => (
                  <GlowCard
                    key={inq.id}
                    className="p-6"
                    glowColor="rgba(124, 109, 250, 0.1)"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h4 className="font-display font-bold text-base text-text-primary">
                            {inq.name}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-full font-mono text-[0.6rem] uppercase tracking-wider ${
                              inq.status === 'unread'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : inq.status === 'read'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                            }`}
                          >
                            {inq.status || 'unread'}
                          </span>
                        </div>
                        <p className="font-mono text-xs text-text-muted mt-1">
                          {inq.email} •{' '}
                          {inq.createdAt
                            ? new Date(inq.createdAt).toLocaleString()
                            : 'Recent'}
                        </p>
                        {inq.subject && (
                          <p className="text-xs font-semibold text-purple-300 mt-2">
                            Subject: {inq.subject}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <a
                          href={`mailto:${inq.email}?subject=${encodeURIComponent(
                            `Re: ${inq.subject || 'Portfolio Inquiry'}`
                          )}`}
                          className="btn btn-outline text-xs py-1.5 px-3"
                        >
                          Reply ✉️
                        </a>

                        {inq.status !== 'read' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              handleUpdateInquiryStatus(inq.id, 'read')
                            }
                          >
                            <FaCheck className="mr-1" /> Mark Read
                          </Button>
                        )}

                        {inq.status !== 'archived' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              handleUpdateInquiryStatus(inq.id, 'archived')
                            }
                          >
                            <FaArchive className="mr-1" /> Archive
                          </Button>
                        )}

                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteInquiry(inq.id)}
                        >
                          <FaTrash className="mr-1" /> Delete
                        </Button>
                      </div>
                    </div>

                    <p className="font-body text-sm text-text-secondary whitespace-pre-wrap bg-black/40 p-4 rounded-xl border border-white/5">
                      {inq.message}
                    </p>
                  </GlowCard>
                ))
              )}
            </div>
          )}

          {/* 2. Firestore Guestbook Endorsements */}
          {activeTab === 'guestbook' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2">
                <h2 className="font-display font-bold text-base text-white">
                  Visitor Endorsements & Recommendations ({guestbook.length})
                </h2>
                <span className="font-mono text-xs text-text-muted">
                  Stored in Firestore `/guestbook`
                </span>
              </div>

              {guestbook.length === 0 ? (
                <div className="text-center py-16 text-text-muted font-mono text-xs border border-white/5 rounded-2xl bg-white/[0.01]">
                  No endorsements published yet.
                </div>
              ) : (
                guestbook.map((entry) => (
                  <GlowCard
                    key={entry.id}
                    className="p-6"
                    glowColor="rgba(16, 185, 129, 0.1)"
                  >
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        {entry.userPhoto ? (
                          <img
                            src={entry.userPhoto}
                            alt={entry.userName}
                            className="w-9 h-9 rounded-full object-cover border border-white/20"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-purple-600/30 text-white font-mono text-xs flex items-center justify-center font-bold">
                            {entry.userName?.charAt(0) || 'U'}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-white text-sm">
                            {entry.userName}
                          </p>
                          <p className="font-mono text-[0.65rem] text-text-muted">
                            {entry.userEmail || 'Google Verified Visitor'} •{' '}
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteGuestbook(entry.id)}
                      >
                        <FaTrash className="mr-1" /> Delete
                      </Button>
                    </div>

                    <p className="text-sm font-body text-neutral-300 whitespace-pre-wrap bg-black/40 p-4 rounded-xl border border-white/5">
                      {entry.message}
                    </p>
                  </GlowCard>
                ))
              )}
            </div>
          )}

          {/* 3. Firestore Project Likes Engagement */}
          {activeTab === 'likes' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-2">
                <h2 className="font-display font-bold text-base text-white">
                  Project Likes & Visitor Engagement ({projectLikes.length} Total Likes)
                </h2>
                <span className="font-mono text-xs text-text-muted">
                  Stored in Firestore `/projectLikes`
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PROJECTS_DATA.map((proj) => {
                  const count = likesCountByProject[proj.id] || 0;
                  return (
                    <div
                      key={proj.id}
                      className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-white text-sm">
                          {proj.title}
                        </h4>
                        <p className="font-mono text-xs text-neutral-500 uppercase">
                          {proj.category}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 font-mono text-sm font-bold">
                        <FaHeart className="text-xs" />
                        <span>{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-white/10">
                <h3 className="font-mono text-xs uppercase tracking-wider text-neutral-400 mb-3">
                  Recent Endorsement Log
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {projectLikes.map((like) => (
                    <div
                      key={like.id}
                      className="p-2.5 rounded-lg border border-white/5 bg-white/5 flex items-center justify-between text-xs"
                    >
                      <span className="text-white font-medium">
                        {like.userName}
                      </span>
                      <span className="text-neutral-400 font-mono text-[0.7rem]">
                        Liked project ID: {like.projectId}
                      </span>
                      <span className="text-neutral-500 font-mono text-[0.65rem]">
                        {new Date(like.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. Registered Users Directory */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2">
                <h2 className="font-display font-bold text-base text-white">
                  Authenticated Visitors & Users ({usersList.length})
                </h2>
                <span className="font-mono text-xs text-text-muted">
                  Stored in Firestore `/users`
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {usersList.map((usr) => (
                  <div
                    key={usr.id}
                    className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex items-center gap-3.5"
                  >
                    {usr.photoURL ? (
                      <img
                        src={usr.photoURL}
                        alt={usr.displayName}
                        className="w-10 h-10 rounded-full object-cover border border-white/20"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-600/30 text-white font-bold flex items-center justify-center font-mono text-xs">
                        {usr.displayName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div className="overflow-hidden flex-1">
                      <p className="font-semibold text-white text-xs truncate">
                        {usr.displayName}
                      </p>
                      <p className="font-mono text-[0.65rem] text-neutral-400 truncate">
                        {usr.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-[0.55rem] uppercase px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">
                          {usr.role || 'user'}
                        </span>
                        <span className="font-mono text-[0.55rem] text-neutral-500">
                          {usr.lastLoginAt
                            ? new Date(usr.lastLoginAt).toLocaleDateString()
                            : 'Recent'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Projects management */}
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
                      onChange={(e) =>
                        setNewProject({ ...newProject, title: e.target.value })
                      }
                      className={inputStyle}
                    />
                    <textarea
                      required
                      placeholder="Description"
                      rows={3}
                      value={newProject.description}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          description: e.target.value,
                        })
                      }
                      className={`${inputStyle} resize-none`}
                    />
                    <input
                      type="text"
                      required
                      placeholder="Image URL"
                      value={newProject.image}
                      onChange={(e) =>
                        setNewProject({ ...newProject, image: e.target.value })
                      }
                      className={inputStyle}
                    />
                    <input
                      type="text"
                      placeholder="GitHub URL"
                      value={newProject.github}
                      onChange={(e) =>
                        setNewProject({ ...newProject, github: e.target.value })
                      }
                      className={inputStyle}
                    />
                    <input
                      type="text"
                      placeholder="Live Demo URL"
                      value={newProject.liveUrl}
                      onChange={(e) =>
                        setNewProject({ ...newProject, liveUrl: e.target.value })
                      }
                      className={inputStyle}
                    />
                    <input
                      type="text"
                      placeholder="Tech Stack (comma separated)"
                      value={newProject.techStack}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          techStack: e.target.value,
                        })
                      }
                      className={inputStyle}
                    />
                    <div className="flex gap-4">
                      <select
                        value={newProject.category}
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            category: e.target.value,
                          })
                        }
                        className={inputStyle}
                      >
                        <option value="frontend">Frontend</option>
                        <option value="fullstack">Fullstack</option>
                      </select>
                      <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-text-secondary whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={newProject.featured}
                          onChange={(e) =>
                            setNewProject({
                              ...newProject,
                              featured: e.target.checked,
                            })
                          }
                          className="rounded border-border-glass bg-white/5 text-accent-violet focus:ring-accent-violet"
                        />
                        Featured
                      </label>
                    </div>
                    <Button variant="primary" size="md" className="w-full">
                      Create Project
                    </Button>
                  </form>
                </GlowCard>
              </div>

              {/* List */}
              <div className="lg:col-span-8 space-y-4">
                {(projects.length > 0 ? projects : PROJECTS_DATA).map((proj) => (
                  <GlowCard key={proj._id || proj.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-display font-bold text-base text-text-primary">
                          {proj.title}
                        </h4>
                        <p className="font-body text-xs text-text-secondary mt-1">
                          {proj.description}
                        </p>
                      </div>
                      {proj._id && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteProject(proj._id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </GlowCard>
                ))}
              </div>
            </div>
          )}

          {/* 6. Skills Management */}
          {activeTab === 'skills' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-4">
                <GlowCard className="p-6">
                  <h3 className="font-display font-bold text-base text-text-primary mb-6">
                    Add New Skill
                  </h3>
                  <form onSubmit={handleAddSkill} className="space-y-4">
                    <input
                      type="text"
                      required
                      placeholder="Skill Name"
                      value={newSkill.name}
                      onChange={(e) =>
                        setNewSkill({ ...newSkill, name: e.target.value })
                      }
                      className={inputStyle}
                    />
                    <select
                      value={newSkill.category}
                      onChange={(e) =>
                        setNewSkill({ ...newSkill, category: e.target.value })
                      }
                      className={inputStyle}
                    >
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="database">Database</option>
                      <option value="tools">Tools & DevOps</option>
                    </select>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      placeholder="Proficiency (1-100)"
                      value={newSkill.proficiency}
                      onChange={(e) =>
                        setNewSkill({
                          ...newSkill,
                          proficiency: Number(e.target.value),
                        })
                      }
                      className={inputStyle}
                    />
                    <input
                      type="text"
                      placeholder="Icon Emoji (e.g. ⚛️)"
                      value={newSkill.icon}
                      onChange={(e) =>
                        setNewSkill({ ...newSkill, icon: e.target.value })
                      }
                      className={inputStyle}
                    />
                    <Button variant="primary" size="md" className="w-full">
                      Add Skill
                    </Button>
                  </form>
                </GlowCard>
              </div>

              <div className="lg:col-span-8 space-y-4">
                {skills.map((skill) => (
                  <GlowCard
                    key={skill._id}
                    className="p-4 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{skill.icon}</span>
                      <span className="font-body text-sm text-text-primary">
                        {skill.name}
                      </span>
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteSkill(skill._id)}
                    >
                      Delete
                    </Button>
                  </GlowCard>
                ))}
              </div>
            </div>
          )}

          {/* 7. Experience Management */}
          {activeTab === 'experience' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-4">
                <GlowCard className="p-6">
                  <h3 className="font-display font-bold text-base text-text-primary mb-6">
                    Add Experience
                  </h3>
                  <form onSubmit={handleAddExperience} className="space-y-4">
                    <input
                      type="text"
                      required
                      placeholder="Company"
                      value={newExperience.company}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          company: e.target.value,
                        })
                      }
                      className={inputStyle}
                    />
                    <input
                      type="text"
                      required
                      placeholder="Role"
                      value={newExperience.role}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          role: e.target.value,
                        })
                      }
                      className={inputStyle}
                    />
                    <input
                      type="text"
                      required
                      placeholder="Duration (e.g. 2024 - Present)"
                      value={newExperience.duration}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          duration: e.target.value,
                        })
                      }
                      className={inputStyle}
                    />
                    <textarea
                      placeholder="Description"
                      rows={3}
                      value={newExperience.description}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          description: e.target.value,
                        })
                      }
                      className={`${inputStyle} resize-none`}
                    />
                    <textarea
                      placeholder="Achievements (one per line)"
                      rows={3}
                      value={newExperience.achievements}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          achievements: e.target.value,
                        })
                      }
                      className={`${inputStyle} resize-none`}
                    />
                    <Button variant="primary" size="md" className="w-full">
                      Add Experience
                    </Button>
                  </form>
                </GlowCard>
              </div>

              <div className="lg:col-span-8 space-y-4">
                {experiences.map((exp) => (
                  <GlowCard key={exp._id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-display font-bold text-base text-text-primary">
                          {exp.role} @ {exp.company}
                        </h4>
                        <span className="font-mono text-xs text-text-muted">
                          {exp.duration}
                        </span>
                        <p className="font-body text-xs text-text-secondary mt-2">
                          {exp.description}
                        </p>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteExperience(exp._id)}
                      >
                        Delete
                      </Button>
                    </div>
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
