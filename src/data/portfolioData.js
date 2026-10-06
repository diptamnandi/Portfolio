export const PERSONAL_INFO = {
  name: "Diptam Nandi",
  role: "B.Tech Computer Science & Engineering Student",
  tagline: "Building resilient systems, interactive web applications, and intuitive digital experiences.",
  bio: "I am an undergraduate Computer Science and Engineering student passionate about full-stack web engineering, algorithms, and distributed systems. When not coding, I explore 3D web graphics, optimize software performance, and delve into system architecture.",
  location: "India",
  status: "Open to Software Engineering Internships & Full-time Roles",
  email: "diptamnandi.work@gmail.com",
  github: "https://github.com/diptamnandi",
  linkedin: "https://linkedin.com/in/diptamnandi",
  twitter: "https://twitter.com/diptamnandi",
};

export const NAV_LINKS = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Education", href: "#education" },
  { name: "Contact", href: "#contact" },
];

export const SKILL_CATEGORIES = [
  {
    title: "Programming Languages",
    icon: "Code2",
    skills: ["C", "C++", "Java", "JavaScript (ES6+)", "TypeScript", "Python", "SQL"],
  },
  {
    title: "Frontend & 3D Web",
    icon: "Layout",
    skills: ["React.js", "Vite", "Tailwind CSS", "HTML5 / Semantic CSS", "Three.js", "Framer Motion"],
  },
  {
    title: "Backend & Databases",
    icon: "Server",
    skills: ["Node.js", "Express.js", "REST APIs", "WebSockets", "MongoDB", "PostgreSQL", "MySQL"],
  },
  {
    title: "Tools & CS Fundamentals",
    icon: "Terminal",
    skills: ["Git & GitHub", "Linux / Bash", "Docker Basics", "Data Structures & Algorithms", "DBMS", "Operating Systems", "Computer Networks"],
  },
];

export const PROJECTS = [
  {
    id: "algo-3d",
    title: "AlgoVisualizer 3D",
    description: "An interactive, visual learning platform for sorting algorithms, graph pathfinding, and binary search trees with real-time step controls and spatial rendering.",
    tags: ["React", "Three.js", "Tailwind CSS", "Data Structures", "Algorithms"],
    githubUrl: "https://github.com/diptamnandi/algo-visualizer-3d",
    liveUrl: "https://algo-visualizer-3d.vercel.app",
    featured: true,
    highlights: [
      "Dynamic step-by-step visual execution of Dijkstra, A*, and Sorting algorithms",
      "Interactive 3D canvas viewport with camera rotation and zoom",
      "Adjustable execution speed and custom input array generator"
    ]
  },
  {
    id: "nexus-chat",
    title: "NexusChat — Real-Time Collab",
    description: "A low-latency chat and team collaboration web application featuring persistent channels, markdown formatting, and live presence detection.",
    tags: ["React", "Node.js", "Socket.io", "MongoDB", "Express"],
    githubUrl: "https://github.com/diptamnandi/nexus-chat",
    liveUrl: "https://nexus-chat-realtime.vercel.app",
    featured: true,
    highlights: [
      "Bi-directional WebSocket communication for sub-millisecond message delivery",
      "JWT-based authentication with encrypted room state management",
      "Responsive glassmorphism UI with unread message notifications"
    ]
  },
  {
    id: "dev-metrics",
    title: "DevMetrics Dashboard",
    description: "Developer productivity and repository insights tool tracking commit velocity, code review cadence, and language breakdown using the GitHub REST & GraphQL APIs.",
    tags: ["React", "Chart.js", "Tailwind CSS", "GitHub API", "Vite"],
    githubUrl: "https://github.com/diptamnandi/dev-metrics-dashboard",
    liveUrl: "https://dev-metrics.vercel.app",
    featured: true,
    highlights: [
      "Integrated GitHub API authentication with rate-limit monitoring",
      "Interactive time-series charts and language composition breakdown",
      "Local caching layer for offline access and rapid recalculation"
    ]
  },
  {
    id: "sysmon-cli",
    title: "SysMon — Terminal Resource Engine",
    description: "A lightweight systems resource monitor CLI utility reporting CPU core frequency, memory consumption, active network sockets, and process trees.",
    tags: ["C++", "Linux", "POSIX APIs", "Systems Programming"],
    githubUrl: "https://github.com/diptamnandi/sysmon-cli",
    liveUrl: "",
    featured: false,
    highlights: [
      "Reads directly from `/proc` virtual filesystem on Linux",
      "Custom terminal UI rendered with ANSI escape sequences",
      "Zero external runtime dependencies with low CPU overhead"
    ]
  },
];

export const EDUCATION = [
  {
    degree: "Bachelor of Technology in Computer Science & Engineering",
    institution: "B.Tech CSE Undergraduate",
    period: "2022 — 2026",
    details: "Focused on core computer science foundations including Design & Analysis of Algorithms, Object-Oriented Programming, Database Management Systems, Computer Architecture, and Operating Systems.",
    coursework: ["Data Structures & Algorithms", "Database Management Systems", "Operating Systems", "Computer Networks", "Software Engineering", "Theory of Computation"]
  },
  {
    degree: "Higher Secondary Education (Science / PCM & CS)",
    institution: "Senior Secondary School",
    period: "Completed",
    details: "Specialized in Physics, Chemistry, Mathematics, and Computer Science with foundational training in C++ and Object-Oriented problem solving.",
    coursework: ["Physics", "Mathematics", "Computer Science", "Chemistry"]
  }
];
