import React, { useEffect, useRef, useState } from 'react';

const DURATION = 1200;

// Thousands separated by dots, as elsewhere on the site.
function format(value) {
  return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Counts from zero to the value the first time the element scrolls into view.
export default function CountUp({ value, suffix = '' }) {
  const [shown, setShown] = useState(0);
  const element = useRef(undefined);

  useEffect(() => {
    const node = element.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!node || reduceMotion || !('IntersectionObserver' in window)) {
      setShown(value);
      return undefined;
    }
    let frame;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some(entry => entry.isIntersecting)) {
        return;
      }
      observer.disconnect();
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / DURATION, 1);
        // Ease out: most of the counting happens early, then it settles.
        setShown(value * (1 - Math.pow(1 - progress, 3)));
        if (progress < 1) {
          frame = requestAnimationFrame(step);
        }
      };
      frame = requestAnimationFrame(step);
    }, { threshold: 0.5 });
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return <strong ref={element}>{format(shown)}{suffix}</strong>;
}
