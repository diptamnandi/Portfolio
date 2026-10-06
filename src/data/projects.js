/**
 * Project Data Collection
 * Categories: 'Web' | 'AI/ML' | 'Java' | 'IoT' | 'Web3' | 'Hackathon' | 'Academic'
 */
export const PROJECT_CATEGORIES = [
  'All',
  'Web',
  'AI/ML',
  'Java',
  'IoT',
  'Web3',
  'Hackathon',
  'Academic',
];

export const PROJECTS = [
  {
    id: 'omnicare',
    image: '/images/projects/omnicare.jpg',
    title: 'Omnicare: Hospital Management System',
    category: 'Web',
    tagline: 'Role-based hospital portal with smart queue tokens and wait-time prediction.',
    problem:
      'Outpatient desks run on manual queues and paper registers, so patients cannot tell how long they will wait and staff have no single view of patients, appointments and counters.',
    solution:
      'A Flask web app with Admin, Doctor and Patient roles, OTP-based password reset, patient token requests that staff approve, and a dashboard for patients, appointments and counters. A rule-based estimator predicts wait time from queue position, counter service time, priority, peak hours and queue load.',
    techStack: ['Python', 'Flask', 'SQLite', 'Jinja2', 'HTML', 'CSS'],
    github: 'https://github.com/diptamnandi/Omnicare',
    demo: '',
    featured: true,
  },
  {
    id: 'ai-librarian',
    image: '/images/projects/ai-librarian.jpg',
    title: 'AI Librarian',
    category: 'AI/ML',
    tagline: 'Gemini-powered book recommender with OTP-verified accounts.',
    problem:
      'Students lose time finding books and study material that match what they actually need.',
    solution:
      'Users describe what they want to read and Gemini returns structured recommendations with author, reason, rating and ISBN. Includes email OTP login and password reset, a saved recommendation history, and a study materials page.',
    techStack: ['Python', 'Flask', 'Google Gemini API', 'Flask-Mail', 'SQLite', 'PostgreSQL', 'Gunicorn'],
    github: 'https://github.com/diptamnandi/AI-Librarian',
    demo: 'https://ai-librarian.onrender.com',
    featured: true,
  },
  {
    id: 'foodie-calorie-finder',
    image: '/images/projects/foodie-calorie-finder.jpg',
    title: 'Foodie Calorie Finder',
    category: 'Web',
    tagline: 'Type any meal and get its calories and nutrition instantly.',
    problem:
      'People rarely know the calories in what they eat, and looking up each ingredient by hand is slow.',
    solution:
      'A Django app that sends free-text food queries to the CalorieNinjas nutrition API and shows calories and nutrients in a friendly interface with activity illustrations.',
    techStack: ['Python', 'Django', 'CalorieNinjas API', 'SQLite', 'HTML', 'CSS'],
    github: 'https://github.com/diptamnandi/Calorie-APP',
    demo: '',
    featured: true,
  },
  {
    id: 'qr-attendance',
    image: '/images/projects/qr-attendance.jpg',
    title: 'Student Attendance Management System',
    category: 'Web',
    tagline: 'QR-based attendance with CSV export, built as a single-page web app.',
    problem:
      'Manual roll calls waste class time and are easy to get wrong.',
    solution:
      'Generate a QR code per student, scan it with the browser camera to mark attendance, keep check-in logs, switch between light and dark themes, and export attendance to CSV. Runs fully in the browser.',
    techStack: ['HTML', 'CSS', 'JavaScript', 'qrcode.js', 'html5-qrcode', 'localStorage'],
    github: 'https://github.com/diptamnandi/Attendence-System',
    demo: '',
    featured: true,
  },
  {
    id: 'nutrichef',
    image: '/images/projects/nutrichef.jpg',
    title: 'NutriChef: Healthy Recipe Maker',
    category: 'Web',
    tagline: 'Clean front-end for finding quick, healthy recipes by name.',
    problem:
      'Finding a simple healthy recipe usually means scrolling through long blog posts.',
    solution:
      'A two-page front-end: a NutriChef landing UI and a searchable Recipe Maker page, structured so recipe APIs such as Spoonacular or Edamam can be connected later.',
    techStack: ['HTML', 'Tailwind CSS', 'JavaScript', 'Google Fonts'],
    github: 'https://github.com/diptamnandi/recipe',
    demo: '',
    featured: false,
  },
  {
    id: 'weather-dashboard',
    image: '/images/projects/weather-dashboard.jpg',
    title: 'Weather Dashboard',
    category: 'Web',
    tagline: 'Live weather for any city, defaulting to Asansol.',
    problem:
      'Checking local weather means opening heavy apps full of ads.',
    solution:
      'A lightweight dashboard that fetches current conditions from the OpenWeatherMap API and shows temperature, humidity and wind speed in km/h, with city search.',
    techStack: ['HTML', 'CSS', 'JavaScript', 'OpenWeatherMap API'],
    github: 'https://github.com/diptamnandi/Enviorment',
    demo: '',
    featured: false,
  },
  {
    id: 'calendar-notes',
    image: '/images/projects/calendar-notes.jpg',
    title: 'Interactive Calendar with Notes',
    category: 'Web',
    tagline: 'A monthly calendar where every date can hold a note.',
    problem:
      'Simple calendars make it hard to jot down a quick note against a specific day.',
    solution:
      'Click any date to add, edit or delete a note, saved in the browser with localStorage so it persists without a backend.',
    techStack: ['HTML', 'CSS', 'JavaScript', 'localStorage'],
    github: 'https://github.com/diptamnandi/Reminder',
    demo: '',
    featured: false,
  },
  {
    id: 'sushiman',
    image: '/images/projects/sushiman.jpg',
    title: 'Sushiman: Restaurant Landing Page',
    category: 'Web',
    tagline: 'Responsive Japanese food landing page built with Vite.',
    problem:
      'Small restaurants need an attractive page that shows the menu and gets visitors to subscribe.',
    solution:
      'A responsive landing page with a hero, popular dishes, about and subscribe sections, built with Vite and plain HTML, CSS and JavaScript.',
    techStack: ['Vite', 'HTML', 'CSS', 'JavaScript'],
    github: 'https://github.com/diptamnandi/Food-Finder',
    demo: '',
    featured: false,
  },
];
