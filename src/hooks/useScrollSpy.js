import { useState, useEffect } from 'react';

/**
 * Custom hook to spy on active section using IntersectionObserver
 * @param {string[]} sectionIds - Array of section element IDs (without #)
 * @param {object} options - IntersectionObserver options
 * @returns {string} activeId - The ID of the currently visible section
 */
export function useScrollSpy(sectionIds = [], options = {}) {
  const [activeId, setActiveId] = useState(sectionIds[0] || '');

  useEffect(() => {
    if (!sectionIds.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -55% 0px', // Trigger when section crosses upper-middle viewport
      threshold: [0, 0.25, 0.5, 0.75, 1],
      ...options,
    };

    const handleIntersect = (entries) => {
      // Find the entry with the highest intersection ratio that is intersecting
      const intersectingEntries = entries.filter((entry) => entry.isIntersecting);

      if (intersectingEntries.length > 0) {
        // Sort by greatest intersection ratio
        intersectingEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        setActiveId(intersectingEntries[0].target.id);
      }
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    elements.forEach((el) => observer.observe(el));

    // Handle scroll to top fallback
    const handleScroll = () => {
      if (window.scrollY < 100 && sectionIds.length > 0) {
        setActiveId(sectionIds[0]);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionIds, options]);

  return activeId;
}
