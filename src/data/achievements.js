/**
 * Achievements, Honors, Certifications & IEEE Chapter Activities
 * Tailored for Diptam Nandi (B.Tech CSE)
 * Feel free to edit, append, or replace entries.
 */

export const ACHIEVEMENT_CATEGORIES = [
  { id: "all", label: "All Achievements" },
  { id: "hackathons", label: "Hackathons" },
  { id: "certifications", label: "Certificates" },
  { id: "competitions", label: "Competitions" },
  { id: "ieee", label: "IEEE & Leadership" },
];

export const ACHIEVEMENTS = [
  // --- HACKATHONS ---
  {
    id: "hack-adobe",
    type: "certificate",
    category: "hackathons",
    title: "Adobe Hackathon",
    issuer: "Adobe",
    year: "2024",
    badge: "Participant",
    description: "Participated in the Adobe Hackathon, conceptualizing and building innovative digital solutions under strict time constraints.",
    tags: ["Hackathon", "Innovation", "Adobe"],
    credentialUrl: "https://drive.google.com/file/d/1ZVIj3JmjVqBTKHq-94q4aLeMwZU7X8Dw/view?usp=sharing",
    iconType: "Trophy"
  },
  {
    id: "hack-iit-kgp",
    type: "certificate",
    category: "hackathons",
    title: "IIT KGP Hackathon",
    issuer: "IIT Kharagpur",
    year: "2024",
    badge: "Competitor",
    description: "Competed in the prestigious IIT Kharagpur Hackathon, developing robust applications and collaborating with top engineering talent.",
    tags: ["Hackathon", "IIT KGP", "Development"],
    credentialUrl: "https://drive.google.com/file/d/1tOZ8CWESKPwhBJzYQ-a6W4Z2vUGJTtCb/view?usp=sharing",
    iconType: "Trophy"
  },
  {
    id: "hack-made-in-jis",
    type: "certificate",
    category: "hackathons",
    title: "MADE IN JIS (BUSINESS HACKATHON)",
    issuer: "JIS",
    year: "2024",
    badge: "Participant",
    description: "Participated in the Made in JIS Business Hackathon, pitching entrepreneurial tech solutions and business models.",
    tags: ["Business Hackathon", "Entrepreneurship", "Pitching"],
    credentialUrl: "https://drive.google.com/file/d/1ZZ9eNWzWOWS1poqUZVpssXhKFTf412wI/view?usp=sharing",
    iconType: "Award"
  },
  {
    id: "hack-technova",
    type: "certificate",
    category: "hackathons",
    title: "Technova",
    issuer: "Technova",
    year: "2024",
    badge: "Participant",
    description: "Competed in Technova, leveraging cutting-edge technology to solve real-world problems in a high-stakes competitive programming setting.",
    tags: ["Hackathon", "Technova", "Problem Solving"],
    credentialUrl: "https://drive.google.com/file/d/19hDDyWuLC5ANztzE0VFP35650t827FIW/view?usp=sharing",
    iconType: "Trophy"
  },
  {
    id: "hack-jis-tech-2k26",
    type: "certificate",
    category: "hackathons",
    title: "JIS TECH 2K26",
    issuer: "JIS TECH",
    year: "2026",
    badge: "Participant",
    description: "Active participant in JIS TECH 2K26, showcasing technical acumen and innovative project development in a competitive environment.",
    tags: ["Tech Fest", "Innovation", "Competition"],
    credentialUrl: "https://drive.google.com/file/d/19Z6RTkQwfTznp916GEv9CbrEy-WihAoy/view?usp=sharing",
    iconType: "Award"
  },

  // --- CERTIFICATIONS ---
  {
    id: "cert-wipro",
    type: "certificate",
    category: "certifications",
    title: "Wipro Internship by 1Stop",
    issuer: "Wipro & 1Stop",
    year: "2024",
    badge: "Internship Certificate",
    description: "Successfully completed an intensive internship program at Wipro in collaboration with 1Stop, gaining hands-on industry experience and practical technical skills.",
    tags: ["Internship", "Wipro", "1Stop"],
    credentialUrl: "https://drive.google.com/file/d/1xwFQbZdt5ZLypInqyjo8Dn_o6BXLyjI_/view?usp=sharing",
    iconType: "Award"
  },
  {
    id: "cert-1stop-data",
    type: "certificate",
    category: "certifications",
    title: "1Stop - Data Science Course",
    issuer: "1Stop",
    year: "2024",
    badge: "Course Completion",
    description: "Completed a comprehensive Data Science course through 1Stop, mastering data analysis, machine learning algorithms, and statistical modeling.",
    tags: ["Data Science", "Machine Learning", "Python"],
    credentialUrl: "https://drive.google.com/file/d/1009ewS4x0CZbvD4qTiBrY-NW3tJfwJ5p/view?usp=sharing",
    iconType: "Award"
  },
  {
    id: "cert-gen-ai",
    type: "certificate",
    category: "certifications",
    title: "Gen AI Course",
    issuer: "Gen AI Institute",
    year: "2024",
    badge: "Course Completion",
    description: "Completed specialized coursework in Generative AI, learning to build, prompt, and deploy cutting-edge language models.",
    tags: ["Generative AI", "LLMs", "Artificial Intelligence"],
    credentialUrl: "https://drive.google.com/file/d/11gDhVq7nmzr5EbDGPNo47Lm6vZryQtX4/view?usp=sharing",
    iconType: "Award"
  },
  {
    id: "cert-behavior-design",
    type: "certificate",
    category: "certifications",
    title: "Behavior Design Course",
    issuer: "Behavior Design",
    year: "2024",
    badge: "Course Completion",
    description: "Studied the principles of Behavior Design, understanding user psychology to build more engaging and user-centric products.",
    tags: ["Behavior Design", "UX/UI", "Psychology"],
    credentialUrl: "https://drive.google.com/file/d/1OWvSmib_6tkGzPOPvf-336wuEU2-bJLD/view?usp=sharing",
    iconType: "Award"
  },
  {
    id: "cert-os-admin",
    type: "certificate",
    category: "certifications",
    title: "OS Administration Course",
    issuer: "Administration Institute",
    year: "2024",
    badge: "Course Completion",
    description: "Mastered Operating System administration, covering core Linux/Windows system management, shell scripting, and security configurations.",
    tags: ["OS Administration", "Linux", "System Management"],
    credentialUrl: "https://drive.google.com/file/d/1XkW4ANZP95ABta8QZgg1M7BDyav1qXpn/view?usp=sharing",
    iconType: "Award"
  },

  // --- COMPETITIONS ---
  {
    id: "comp-ihmmc",
    type: "certificate",
    category: "competitions",
    title: "IHMMC 2025 - 2026",
    issuer: "IHMMC",
    year: "2026",
    badge: "Participant",
    description: "Participated and excelled in the IHMMC, demonstrating strong analytical and problem-solving capabilities.",
    tags: ["Competition", "Analytical Skills", "IHMMC"],
    credentialUrl: "https://drive.google.com/file/d/1TYcyeoB_HwCxoJuq6GoJ1Vciw1IDdrgU/view?usp=sharing",
    iconType: "Trophy"
  },

  // --- IEEE & LEADERSHIP ---
  {
    id: "ieee-comp-soc",
    type: "certificate",
    category: "ieee",
    title: "IEEE Computer Society Member",
    issuer: "IEEE",
    year: "2024",
    badge: "Active Member",
    description: "Active member of the IEEE Computer Society, engaging with the global technical community and participating in advanced computing initiatives.",
    tags: ["IEEE", "Computer Society", "Membership"],
    credentialUrl: "https://drive.google.com/file/d/1RcuFYVfCyxHLfaXeNKlhwEel1kLvHwPi/view?usp=sharing",
    iconType: "Users"
  },
  {
    id: "ieee-member",
    type: "certificate",
    category: "ieee",
    title: "IEEE Member",
    issuer: "IEEE",
    year: "2024",
    badge: "Active Member",
    description: "Recognized member of IEEE, committed to the advancement of technology and continuous professional development.",
    tags: ["IEEE", "Professional Development"],
    credentialUrl: "https://drive.google.com/file/d/1lAimQu26_ZC_JDZalYR_IbnZ1Yv0J6Mn/view?usp=sharing",
    iconType: "Users"
  }
];
