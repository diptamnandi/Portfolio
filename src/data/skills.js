/**
 * Technical Skills Dataset
 * Categorized into: Frontend, Backend, Database, AI/ML, Tools
 */
export const SKILLS_DATA = [
  {
    category: 'Frontend',
    icon: 'Layout',
    description: 'Modern reactive user interfaces, component design systems, and 3D web graphics.',
    skills: [
      { name: 'React.js', level: 'Advanced', highlighted: true },
      { name: 'JavaScript (ES6+)', level: 'Advanced', highlighted: true },
      { name: 'TypeScript', level: 'Intermediate', highlighted: true },
      { name: 'Tailwind CSS', level: 'Advanced', highlighted: true },
      { name: 'Three.js / React Three Fiber', level: 'Intermediate', highlighted: true },
      { name: 'HTML5 & Semantic Markup', level: 'Advanced', highlighted: false },
      { name: 'CSS3 / Glassmorphism / Animations', level: 'Advanced', highlighted: false },
      { name: 'Framer Motion', level: 'Intermediate', highlighted: false },
      { name: 'Next.js (Basics)', level: 'Familiar', highlighted: false },
    ],
  },
  {
    category: 'Backend',
    icon: 'Server',
    description: 'Scalable service architectures, RESTful APIs, WebSockets, and multithreaded systems.',
    skills: [
      { name: 'Node.js', level: 'Advanced', highlighted: true },
      { name: 'Express.js', level: 'Advanced', highlighted: true },
      { name: 'Java (Core & OOP)', level: 'Advanced', highlighted: true },
      { name: 'C / C++', level: 'Advanced', highlighted: true },
      { name: 'RESTful API Architecture', level: 'Advanced', highlighted: true },
      { name: 'WebSockets / Socket.io', level: 'Intermediate', highlighted: true },
      { name: 'Python', level: 'Intermediate', highlighted: false },
      { name: 'Spring Boot (Basics)', level: 'Familiar', highlighted: false },
    ],
  },
  {
    category: 'Database',
    icon: 'Database',
    description: 'Relational schemas, query optimization, indexing, and NoSQL document stores.',
    skills: [
      { name: 'PostgreSQL', level: 'Intermediate', highlighted: true },
      { name: 'MongoDB', level: 'Advanced', highlighted: true },
      { name: 'MySQL', level: 'Intermediate', highlighted: true },
      { name: 'Redis (Caching)', level: 'Intermediate', highlighted: true },
      { name: 'SQL Query Optimization', level: 'Intermediate', highlighted: false },
      { name: 'Prisma ORM / Mongoose', level: 'Intermediate', highlighted: false },
      { name: 'Database Normalization', level: 'Advanced', highlighted: false },
    ],
  },
  {
    category: 'AI/ML',
    icon: 'Brain',
    description: 'Machine learning fundamentals, deep learning computer vision, and API inference pipelines.',
    skills: [
      { name: 'Python for Data Science', level: 'Intermediate', highlighted: true },
      { name: 'PyTorch Basics', level: 'Intermediate', highlighted: true },
      { name: 'Scikit-Learn', level: 'Intermediate', highlighted: true },
      { name: 'OpenCV (Computer Vision)', level: 'Intermediate', highlighted: true },
      { name: 'NumPy & Pandas', level: 'Advanced', highlighted: false },
      { name: 'TensorFlow (Fundamentals)', level: 'Familiar', highlighted: false },
      { name: 'FastAPI Model Serving', level: 'Intermediate', highlighted: false },
    ],
  },
  {
    category: 'Tools',
    icon: 'Terminal',
    description: 'Developer tooling, version control, containerization, and foundational computer science.',
    skills: [
      { name: 'Git & GitHub', level: 'Advanced', highlighted: true },
      { name: 'Linux / Bash Scripting', level: 'Intermediate', highlighted: true },
      { name: 'Docker (Containerization)', level: 'Intermediate', highlighted: true },
      { name: 'Postman & API Testing', level: 'Advanced', highlighted: true },
      { name: 'Vite & Webpack', level: 'Advanced', highlighted: false },
      { name: 'Data Structures & Algorithms', level: 'Advanced', highlighted: true },
      { name: 'Operating Systems & Networks', level: 'Advanced', highlighted: false },
    ],
  },
];
