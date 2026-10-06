import React, { useState, useEffect } from 'react';
import { Activity, BookOpen, Apple, QrCode, Leaf, CloudSun, CalendarDays, CircleDashed } from 'lucide-react';

const icons = {
  'omnicare': <Activity size={48} className="text-teal-400 opacity-80" strokeWidth={1.5} />,
  'ai-librarian': <BookOpen size={48} className="text-violet-400 opacity-80" strokeWidth={1.5} />,
  'foodie-calorie-finder': <Apple size={48} className="text-orange-400 opacity-80" strokeWidth={1.5} />,
  'qr-attendance': <QrCode size={48} className="text-cyan-400 opacity-80" strokeWidth={1.5} />,
  'nutrichef': <Leaf size={48} className="text-green-400 opacity-80" strokeWidth={1.5} />,
  'weather-dashboard': <CloudSun size={48} className="text-blue-400 opacity-80" strokeWidth={1.5} />,
  'calendar-notes': <CalendarDays size={48} className="text-indigo-400 opacity-80" strokeWidth={1.5} />,
  'sushiman': <CircleDashed size={48} className="text-coral-400 opacity-80" strokeWidth={1.5} style={{ color: '#ff7f50' }} />
};

export default function ProjectCover({ project, className = "" }) {
  const [imgStatus, setImgStatus] = useState('loading'); // loading, success, error

  const imageSrc = project.image || `/images/projects/${project.id}.webp`;

  useEffect(() => {
    setImgStatus('loading');
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => setImgStatus('success');
    img.onerror = () => setImgStatus('error');
  }, [imageSrc]);

  if (imgStatus === 'success') {
    return (
      <img
        src={imageSrc}
        alt={`Screenshot preview of ${project.title}`}
        loading="lazy"
        decoding="async"
        className={className}
      />
    );
  }

  // Generate SVG fallback
  return (
    <div className={`relative flex items-center justify-center bg-[#0b1012] overflow-hidden ${className}`}>
      {/* Faint Grid */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      
      {/* Soft tinted glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 blur-3xl opacity-20 bg-current" style={{ color: icons[project.id]?.props?.className?.match(/text-(\w+)-/)?.[1] || 'white' }} />
      </div>

      {/* Motif Icon */}
      <div className="relative z-10 flex items-center justify-center drop-shadow-lg">
        {icons[project.id] || <div className="w-12 h-12 rounded bg-neutral-800" />}
      </div>
    </div>
  );
}
