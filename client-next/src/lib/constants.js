/* ═══════════════════════════════════════════════════════════════
   Site-wide constants & personal data
   All hardcoded personal info lives here for easy updates
   ═══════════════════════════════════════════════════════════════ */

export const SITE = {
  name: 'CodeWithShivank',
  title: 'CodeWithShivank — MERN Stack Developer',
  description: 'Premium MERN Stack Developer Portfolio — Shivank Maurya',
  url: 'https://codewithshivank.dev',
  email: 'codewithshivank@gmail.com',
  location: 'Lucknow, India',
  availability: 'Available for full-time & freelance',
};

export const PERSONAL = {
  name: 'Shivank Maurya',
  role: 'Full Stack Developer',
  tagline: 'Building immersive web experiences with the MERN stack, Three.js, and obsessive attention to craft.',
  bio: [
    "I build things with code and fix things for people — and I want to do both as a software engineer. Currently a BCA student at BBDU (2025–2028) and a Customer Support Associate at Niftel, where I handle real-time issue resolution for Swiggy's platform at scale.",
    "That experience taught me something most CS students don't get until their first job: users don't care about elegant code, they care about things that work.",
    "Now I'm channeling that product sense into full-stack development — React, Node.js, MongoDB, Express — and AI tooling, with 4 certifications in prompt engineering and cyber/tech simulations from Deloitte, EY, and Microsoft.",
  ],
  startedYear: 2023,
  resumeUrl: '/resume.pdf',
};

export const SOCIAL_LINKS = [
  { label: 'GitHub', url: 'https://github.com/codewith-shivank', icon: 'github' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/shivank-maurya-21257a303/', icon: 'linkedin' },
  { label: 'X / Twitter', url: 'https://x.com/codewithshivank', icon: 'twitter' },
  { label: 'YouTube', url: 'https://www.youtube.com/@CodeWithShivank12', icon: 'youtube' },
];

export const NAV_SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'services', label: 'Services' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'contact', label: 'Contact' },
];

export const SKILLS_DATA = [
  // Frontend
  { name: 'React', category: 'frontend', proficiency: 90, icon: '⚛️' },
  { name: 'Next.js', category: 'frontend', proficiency: 75, icon: '▲' },
  { name: 'JavaScript', category: 'frontend', proficiency: 92, icon: '🟨' },
  { name: 'TypeScript', category: 'frontend', proficiency: 70, icon: '🔷' },
  { name: 'HTML5', category: 'frontend', proficiency: 95, icon: '🌐' },
  { name: 'CSS3', category: 'frontend', proficiency: 90, icon: '🎨' },
  { name: 'Tailwind CSS', category: 'frontend', proficiency: 88, icon: '💨' },
  { name: 'Three.js', category: 'frontend', proficiency: 72, icon: '🧊' },
  { name: 'Framer Motion', category: 'frontend', proficiency: 85, icon: '✨' },
  { name: 'GSAP', category: 'frontend', proficiency: 78, icon: '🎬' },
  // Backend
  { name: 'Node.js', category: 'backend', proficiency: 85, icon: '🟢' },
  { name: 'Express.js', category: 'backend', proficiency: 82, icon: '🚂' },
  { name: 'REST API', category: 'backend', proficiency: 88, icon: '🔗' },
  { name: 'GraphQL', category: 'backend', proficiency: 55, icon: '◈' },
  // Database
  { name: 'MongoDB', category: 'database', proficiency: 80, icon: '🍃' },
  { name: 'Mongoose', category: 'database', proficiency: 78, icon: '🔧' },
  { name: 'Firebase', category: 'database', proficiency: 65, icon: '🔥' },
  // Cloud & Tools
  { name: 'Git', category: 'tools', proficiency: 88, icon: '📋' },
  { name: 'GitHub', category: 'tools', proficiency: 90, icon: '🐙' },
  { name: 'Vercel', category: 'tools', proficiency: 82, icon: '▲' },
  { name: 'VS Code', category: 'tools', proficiency: 92, icon: '💻' },
  { name: 'Figma', category: 'tools', proficiency: 60, icon: '🎯' },
  { name: 'Postman', category: 'tools', proficiency: 80, icon: '📮' },
  { name: 'Docker', category: 'tools', proficiency: 50, icon: '🐳' },
];

export const SKILL_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'database', label: 'Database' },
  { id: 'tools', label: 'Tools' },
];

export const PROJECTS_DATA = [
  {
    id: 1,
    title: 'Portfolio V2 — Immersive 3D',
    description: 'An immersive developer portfolio with WebGL shaders, 3D physics-based project cards, an interactive skill solar system, and cinematic loading experience.',
    image: '/projects/portfolio-v2.png',
    github: 'https://github.com/codewith-shivank/PortFolio_JS',
    liveUrl: 'https://codewithshivank.dev',
    techStack: ['React', 'Three.js', 'WebGL', 'Framer Motion', 'Cannon.js'],
    category: 'fullstack',
    featured: true,
  },
  {
    id: 2,
    title: 'MERN Chat Application',
    description: 'Real-time messaging application with socket.io, JWT authentication, online status, and modern UI.',
    image: '/projects/chat-app.png',
    github: 'https://github.com/codewith-shivank',
    liveUrl: '#',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io'],
    category: 'fullstack',
    featured: true,
  },
  {
    id: 3,
    title: 'E-Commerce Dashboard',
    description: 'Full-featured admin dashboard for e-commerce platforms with analytics, order management, and inventory tracking.',
    image: '/projects/ecommerce.png',
    github: 'https://github.com/codewith-shivank',
    liveUrl: '#',
    techStack: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Chart.js'],
    category: 'fullstack',
    featured: false,
  },
  {
    id: 4,
    title: 'AI Content Generator',
    description: 'AI-powered content generation tool using OpenAI API with prompt templates, history, and export features.',
    image: '/projects/ai-content.png',
    github: 'https://github.com/codewith-shivank',
    liveUrl: '#',
    techStack: ['React', 'Node.js', 'OpenAI API', 'Tailwind CSS'],
    category: 'frontend',
    featured: false,
  },
];

export const PROJECT_CATEGORIES = [
  { id: 'all', label: 'All Projects' },
  { id: 'fullstack', label: 'Full Stack' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
];

export const EXPERIENCE_DATA = [
  {
    id: 1,
    company: 'Niftel',
    role: 'Customer Support Associate',
    duration: '2024 — Present',
    description: "Handling real-time issue resolution for Swiggy's platform at scale. Managing customer escalations and technical troubleshooting.",
    achievements: [
      'Resolved 500+ customer issues per week',
      'Improved response time by 30%',
      'Developed internal tooling scripts',
    ],
  },
  {
    id: 2,
    company: 'BBDU',
    role: 'BCA Student',
    duration: '2025 — 2028',
    description: 'Bachelor of Computer Applications with focus on software engineering, data structures, and web technologies.',
    achievements: [
      'Active in coding communities',
      'Building open-source projects',
      'Self-taught full-stack development',
    ],
  },
];

export const SERVICES_DATA = [
  {
    icon: '🌐',
    title: 'Web Development',
    description: 'End-to-end web application development with modern frameworks and best practices.',
  },
  {
    icon: '⚛️',
    title: 'Frontend Engineering',
    description: 'Pixel-perfect, responsive, and performant user interfaces with React and modern CSS.',
  },
  {
    icon: '🔧',
    title: 'Backend Development',
    description: 'Scalable APIs and server-side logic with Node.js, Express, and MongoDB.',
  },
  {
    icon: '🚀',
    title: 'MERN Stack',
    description: 'Full-stack applications using MongoDB, Express, React, and Node.js ecosystem.',
  },
  {
    icon: '🎨',
    title: 'UI/UX Design',
    description: 'Intuitive and beautiful user experiences with modern design principles and tools.',
  },
  {
    icon: '⚡',
    title: 'Performance Optimization',
    description: 'Speed audits, bundle optimization, lazy loading, and Lighthouse score improvements.',
  },
];

export const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: 'Client Name',
    role: 'CEO',
    company: 'Tech Startup',
    quote: "Shivank delivered an exceptional web application that exceeded our expectations. His attention to detail and commitment to quality is remarkable.",
    avatar: '👤',
    rating: 5,
  },
  {
    id: 2,
    name: 'Team Lead',
    role: 'Engineering Manager',
    company: 'Digital Agency',
    quote: "Working with Shivank was a great experience. He brings creative solutions and writes clean, maintainable code.",
    avatar: '👤',
    rating: 5,
  },
  {
    id: 3,
    name: 'Project Manager',
    role: 'PM',
    company: 'Software Company',
    quote: "Impressive skills in both frontend and backend development. Shivank consistently delivers high-quality work on time.",
    avatar: '👤',
    rating: 5,
  },
];

export const TIMELINE_DATA = [
  { year: '2023', title: 'Started Web Development', desc: 'Began learning HTML, CSS, and JavaScript. Created first responsive websites.' },
  { year: '2024', title: 'Mastered React & MERN', desc: 'Developed multiple React applications, learned Node.js, Express, MongoDB.' },
  { year: '2025', title: 'Full Stack & 3D Web', desc: 'Building with Three.js, WebGL, physics engines, and AI integrations. Started BCA at BBDU.' },
];

export const CERTIFICATES_DATA = [
  { title: 'Prompt Engineering', issuer: 'Deloitte', year: '2024' },
  { title: 'Cybersecurity Simulation', issuer: 'EY', year: '2024' },
  { title: 'Tech Simulation', issuer: 'Microsoft', year: '2024' },
  { title: 'AI Fundamentals', issuer: 'Deloitte', year: '2024' },
];

export const STATS = [
  { num: '2+', label: 'Years Coding' },
  { num: '10+', label: 'Projects Built' },
  { num: '4', label: 'Certifications' },
  { num: '∞', label: 'Learning' },
];

/** API base URL for backend calls */
export const API_BASE = (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_URL) || 'http://localhost:5000/api';
