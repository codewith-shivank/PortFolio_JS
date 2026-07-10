# Premium MERN Stack Developer Portfolio

A world-class, production-ready, interactive full-stack portfolio website built with React 19, Vite, Tailwind CSS v4, Framer Motion, GSAP, Lenis, Node.js, Express.js, and MongoDB.

Inspired by premium SaaS landing page designs (like Blackbox.ai) and award-winning developer portfolios, it blends immersive 3D WebGL experiences with high-performance modern web design.

---

## 🚀 Key Features

### 💻 Immersive Frontend
- **3D Particle Loader**: Immersive entry screen spelling out the name utilizing Three.js and custom GLSL vertex/fragment shaders.
- **Background Shader Canvas**: Smooth, morphing interactive WebGL shader background responsive to scroll navigation.
- **Skills Universe**: An interactive 3D solar system built using React Three Fiber where planets represent skills, sized by proficiency.
- **Physics Desk**: Project cards with real physical mass, collision gravity, and velocity built with Cannon.js (cannon-es).
- **Smooth Navigation**: Silk-smooth scrolling via Lenis scroll integration paired with scroll spy indicator dots.
- **Context-Aware Magnetic Cursor**: Custom cursor showing custom hover states, magnetic rings, text-labels, and mix-blend overrides.

### 🛡️ Admin Dashboard & CRUD API
- **Admin Control Panel**: Fully functional React Admin Portal at `/admin` built with glassmorphism UI styles.
- **JWT Authentication**: Secure login routes with JSON Web Token storage and Axios authorization headers.
- **CRUD Operations**: Live admin panel controls to Create, Read, Update, and Delete projects, skills, experience entries, and testimonies.
- **Messaging Inbox**: Detailed feedback panel listing contact inquiries submitted through the form with mark-as-read and delete events.
- **Contact Inquiries**: Seamless contact form integrated with client-side EmailJS and custom status handlers.

---

## 🛠️ Tech Stack

- **Core**: React 19, Vite, Tailwind CSS v4, React Router 7
- **Animations**: Framer Motion, GSAP, Lenis Smooth Scroll
- **3D Engine**: Three.js, React Three Fiber, React Three Drei, Cannon.js (cannon-es)
- **Backend API**: Node.js, Express.js, JWT, Helmet, Express Rate Limit
- **Database**: MongoDB, Mongoose ODM

---

## 📦 Project Structure

```
.
├── client/                 # Frontend Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3d/         # 3D Canvases (Loader, SolarSystem, PhysicsDesk)
│   │   │   ├── layout/     # CustomCursor, Navbar, Footer, SmoothScroll
│   │   │   ├── ui/         # Buttons, GlowCards, SectionHeadings
│   │   │   └── features/   # Gamification, UIOverlays
│   │   ├── context/        # ThemeContext, AuthContext
│   │   ├── sections/       # Scroll Spy Sections
│   │   └── pages/          # Admin login and Dashboard pages
│   └── index.html
│
└── server/                 # Express.js API Backend
    └── src/
        ├── config/         # MongoDB Configuration
        ├── middleware/     # Auth, errorHandler
        ├── models/         # Mongoose DB Schemas
        └── routes/         # Express routing endpoints
```

---

## ⚙️ Local Setup Instructions

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org) (v18+ recommended) and [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally.

### 2. Clone and Setup Environment
Copy `.env.example` templates to `.env` in both client and server directories:

```bash
# Server Environment Setup
cd server
cp .env.example .env

# Client Environment Setup
cd ../client
cp .env.example .env
```

Set your MongoDB connection string and JWT secret in `server/.env`.

### 3. Install Dependencies
Install all package packages using root workspaces:
```bash
npm run install:all
```

### 4. Run Development Servers
Start both the Vite client server and the Node.js Express server concurrently:
```bash
npm run dev
```

- **Client Server**: `http://localhost:3000`
- **Backend API Server**: `http://localhost:5000`

---

## 🔒 Registering the Admin Account
To create your administrator account to access `/admin`:
1. Make a POST request to `/api/auth/register-admin-first-time` using Postman or cURL.
2. Provide your registration credentials and the matching `ADMIN_REGISTRATION_SECRET` defined in your environment variable:

```json
{
  "name": "Shivank Maurya",
  "email": "admin@email.com",
  "password": "yourpassword",
  "secretKey": "shivank-portfolio-secret-1357"
}
```

---

## 🌐 API Endpoint Specifications

| Endpoint | Method | Description | Access |
|---|---|---|---|
| `/api/auth/login` | POST | Authenticate admin user | Public |
| `/api/auth/me` | GET | Retrieve session details | Private |
| `/api/projects` | GET | List all projects | Public |
| `/api/projects` | POST | Add a new project | Private/Admin |
| `/api/projects/:id` | DELETE | Delete project entry | Private/Admin |
| `/api/skills` | GET | List all skills | Public |
| `/api/skills` | POST | Add a new skill | Private/Admin |
| `/api/skills/:id` | DELETE | Delete skill entry | Private/Admin |
| `/api/contact` | POST | Send contact form message | Public |
| `/api/contact` | GET | Get inbox messages | Private/Admin |
| `/api/contact/:id/read` | PUT | Mark message as read | Private/Admin |

---

## 🚀 Deployment

### Frontend (Vercel)
The client compiles cleanly to `dist` and is ready for Vercel imports. Ensure to add the `VITE_API_URL` environment variable pointing to your deployed backend.

### Backend (Render / Railway)
The backend index is at `server/src/index.js` and is fully compatible with PaaS engines. Make sure `MONGO_URI`, `JWT_SECRET` and CORS allowed origins are properly declared.
