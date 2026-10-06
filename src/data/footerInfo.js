/**
 * Footer Configuration & Identity Information
 * Editable data source for Footer left column details,
 * availability status, and atmospheric haze parameters.
 */

export const FOOTER_INFO = {
  // Identity & Title
  name: 'Diptam Nandi',
  role: 'B.Tech CSE • Software Engineer',
  
  // 1px divider width
  dividerWidth: '70%',

  // Optional availability pill (toggleable)
  availability: {
    enabled: true,
    label: 'Open to opportunities',
    dotColor: '#22d3ee',
  },

  // Info rows displayed with staggered entrance
  details: [
    {
      id: 'location',
      label: 'BASED IN',
      value: 'Kolkata, India',
    },
    {
      id: 'education',
      label: 'STUDYING',
      value: 'Computer Science, Asansol Engineering College',
    },
    {
      id: 'focus',
      label: 'FOCUS',
      value: 'Web, AI/ML, Full Stack',
    },
    {
      id: 'contact-cta',
      label: 'REACH ME',
      value: 'Press a key →',
      isAction: true,
    },
  ],
};

/**
 * Atmospheric Haze & Shadow Config
 * Tune mist blobs, radial backlight, and gradient shadow stops
 */
export const FOOTER_ATMOSPHERE_CONFIG = {
  // Sinking shadow overlay stops
  shadow: {
    desktopGradient:
      'linear-gradient(95deg, #050505 22%, rgba(5, 5, 5, 0.82) 40%, rgba(5, 5, 5, 0.25) 62%, transparent 78%), linear-gradient(0deg, rgba(5, 5, 5, 0.9) 0%, transparent 30%)',
    mobileGradient:
      'linear-gradient(180deg, #050505 15%, rgba(5, 5, 5, 0.82) 35%, rgba(5, 5, 5, 0.25) 60%, transparent 80%), linear-gradient(0deg, rgba(5, 5, 5, 0.9) 0%, transparent 30%)',
    edgeFadeRight: 'linear-gradient(270deg, #050505 0%, transparent 20%)',
    edgeFadeTop: 'linear-gradient(180deg, #050505 0%, transparent 18%)',
  },
  
  // Fog Blobs between Left Info & Right Keyboard
  blobs: {
    blob1: {
      color: 'rgba(34, 211, 238, 0.10)', // cyan
      width: '200px',
      height: '170px',
      blur: '34px',
      blurMobile: '20px',
      duration: '9s',
    },
    blob2: {
      color: 'rgba(80, 140, 255, 0.07)', // blue
      width: '240px',
      height: '120px',
      blur: '34px',
      blurMobile: '20px',
      duration: '12s',
    },
    radialGlow:
      'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(34, 211, 238, 0.07), transparent 70%)',
  },
};
