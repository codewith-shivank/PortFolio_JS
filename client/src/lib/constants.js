/* ═══════════════════════════════════════════════════════════════
   Site-wide constants & personal data
   All hardcoded personal info lives here for easy updates
   ═══════════════════════════════════════════════════════════════ */

export const SITE = {
  name: 'Shivank Maurya',
  title: 'Shivank Maurya — MERN Stack Software Engineer',
  description: 'MERN Stack Software Engineer Portfolio — Shivank Maurya. Full Stack Developer specializing in React, Node.js, Express, and MongoDB. Available for full-time roles.',
  url: 'https://codewithshivank.dev',
  email: 'codewithshivank@gmail.com',
  location: 'Lucknow, India',
  availability: 'Open to Opportunities',
};

export const PERSONAL = {
  name: 'Shivank Maurya',
  firstName: 'Shivank',
  role: 'Software Engineer Intern / MERN Developer',
  tagline: 'I build robust MERN stack applications with clean architecture, responsive frontends, and scalable Node.js/Express APIs.',
  shortBio: 'BCA student and self-taught MERN Developer passionate about clean code, technical automation, and engineering scalable web products.',
  bio: [
    "I am a Computer Science/BCA student at BBDU (2025–2028) specializing in the MERN stack. I design and build production-ready web applications, focusing on robust Node.js/Express REST APIs, MongoDB schema architecture, and interactive React frontends.",
    "Alongside my studies, I work at Niftel supporting Swiggy's platform at scale, where I leverage custom Javascript automation scripts to streamline support lookups. This experience has built a strong engineering focus on platform reliability, quick troubleshooting, and user-centric design.",
    "I hold 4 industry certifications from Deloitte, EY, and Microsoft in AI, cybersecurity, and prompt engineering, and I am actively building open-source projects to grow as a software engineer.",
  ],
  highlights: [
    'MERN Stack (MongoDB · Express · React · Node.js)',
    'Technical Automation & Scripting (JavaScript / Node)',
    'Clean REST APIs & Secure Authentication (JWT / bcrypt)',
  ],
  careerObjective: 'Seeking a Software Engineer Intern or MERN Developer Intern role to build reliable web products, collaborate with engineering teams, and solve complex problems.',
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
  { id: 'contact', label: 'Contact' },
];

export const SKILLS_DATA = [
  // Frontend
  { name: 'React', category: 'frontend', icon: '⚛️' },
  { name: 'Next.js', category: 'frontend', icon: '▲' },
  { name: 'JavaScript', category: 'frontend', icon: '🟨' },
  { name: 'TypeScript', category: 'frontend', icon: '🔷' },
  { name: 'HTML5', category: 'frontend', icon: '🌐' },
  { name: 'CSS3', category: 'frontend', icon: '🎨' },
  { name: 'Tailwind CSS', category: 'frontend', icon: '💨' },
  { name: 'Framer Motion', category: 'frontend', icon: '✨' },
  // Backend
  { name: 'Node.js', category: 'backend', icon: '🟢' },
  { name: 'Express.js', category: 'backend', icon: '🚂' },
  { name: 'REST API', category: 'backend', icon: '🔗' },
  { name: 'JWT Auth', category: 'backend', icon: '🔒' },
  // Database
  { name: 'MongoDB', category: 'database', icon: '🍃' },
  { name: 'Mongoose', category: 'database', icon: '🔧' },
  { name: 'Firebase', category: 'database', icon: '🔥' },
  // Tools
  { name: 'Git', category: 'tools', icon: '📋' },
  { name: 'GitHub', category: 'tools', icon: '🐙' },
  { name: 'Postman', category: 'tools', icon: '📮' },
  { name: 'Figma', category: 'tools', icon: '🎯' },
  { name: 'VS Code', category: 'tools', icon: '💻' },
  // Deployment
  { name: 'Vercel', category: 'deployment', icon: '▲' },
  { name: 'Render', category: 'deployment', icon: '☁️' },
  { name: 'Docker', category: 'deployment', icon: '🐳' },
  { name: 'Linux / Bash', category: 'deployment', icon: '🐧' },
];

export const SKILL_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'database', label: 'Database' },
  { id: 'tools', label: 'Tools' },
  { id: 'deployment', label: 'Deployment' },
];

export const PROJECTS_DATA = [
  {
    id: 1,
    title: 'MERN Portfolio — Recruiter Focus',
    description: 'Full-stack MERN developer portfolio with Node.js/Express backend, MongoDB contact storage, admin dashboard, JWT auth, resume download tracking, and React/Vite/Tailwind frontend.',
    image: '/projects/portfolio.png',
    github: 'https://github.com/codewith-shivank/PortFolio_JS',
    liveUrl: 'https://codewithshivank.dev',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'JWT'],
    category: 'fullstack',
    featured: true,
    challenges: 'Designing a clean architecture with admin auth, contact form backend, and resume download analytics in a monorepo setup.',
    keyLearning: 'End-to-end MERN deployment with protected routes, middleware layers, and production-ready API structure.',
  },
  {
    id: 2,
    title: 'MERN Chat Application',
    description: 'Real-time messaging app with Socket.io, JWT authentication, online status indicators, and a modern responsive UI.',
    image: '/projects/chat-app.png',
    github: 'https://github.com/codewith-shivank',
    liveUrl: '#',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'JWT'],
    category: 'fullstack',
    featured: true,
    challenges: 'Managing bi-directional real-time events with Socket.io while maintaining authentication state and online presence.',
    keyLearning: 'WebSocket architecture, event-driven backend design, and real-time UI state management.',
  },
  {
    id: 3,
    title: 'E-Commerce Admin Dashboard',
    description: 'Feature-complete admin dashboard with product CRUD, order management, sales analytics charts, and role-based access control.',
    image: '/projects/ecommerce.png',
    github: 'https://github.com/codewith-shivank',
    liveUrl: '#',
    techStack: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Chart.js'],
    category: 'fullstack',
    featured: false,
    challenges: 'Building a performant data table with server-side pagination and real-time chart updates.',
    keyLearning: 'Dashboard UX patterns, REST API design for CRUD operations, and data visualization with Chart.js.',
  },
  {
    id: 4,
    title: 'AI Content Generator',
    description: 'AI-powered content tool using OpenAI API with customizable prompt templates, generation history, and one-click export.',
    image: '/projects/ai-content.png',
    github: 'https://github.com/codewith-shivank',
    liveUrl: '#',
    techStack: ['React', 'Node.js', 'OpenAI API', 'Tailwind CSS', 'Express'],
    category: 'fullstack',
    featured: false,
    challenges: 'Handling streaming API responses from OpenAI and rate-limiting per user session.',
    keyLearning: 'Integrating LLM APIs, streaming response rendering in React, and prompt engineering basics.',
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
    company: 'Niftel (Swiggy Operations)',
    role: 'Operations Associate (Technical Automation)',
    duration: '2024 — Present',
    description: "Managing real-time operational ticket resolution for Swiggy's platform at scale. Built internal scripting tools to optimize lookup efficiency and response metrics.",
    achievements: [
      'Developed custom Javascript automation scripts, reducing support ticket lookup time by 30%.',
      'Resolved 500+ high-severity platform escalations weekly while maintaining a 98% satisfaction rating.',
      'Documented technical troubleshooting procedures, accelerating onboarding times for new team members.',
    ],
  },
  {
    id: 2,
    company: 'BBDU',
    role: 'BCA (Computer Applications) Student',
    duration: '2025 — 2028',
    description: 'Bachelor of Computer Applications focusing on algorithms, data structures, database design, and object-oriented programming.',
    achievements: [
      'Maintained excellent academic performance while self-learning industry-ready web development stacks.',
      'Active technical contributor in peer programming clubs, mentoring other students in Git workflows.',
      'Built 4+ full-stack projects showcasing MERN, RESTful services, and real-time operations.',
    ],
  },
];


export const TIMELINE_DATA = [
  { year: '2023', title: 'Started Web Development', desc: 'Began learning HTML, CSS, and JavaScript. Built first responsive websites and landing pages.' },
  { year: '2024', title: 'MERN Stack & Backend', desc: 'Built full-stack applications with React, Node.js, Express, and MongoDB. Earned 4 certifications from Deloitte, EY, and Microsoft.' },
  { year: '2025', title: 'BCA & Production Apps', desc: 'Enrolled in BCA at BBDU. Building production-grade MERN applications with auth, REST APIs, and admin dashboards.' },
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
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
