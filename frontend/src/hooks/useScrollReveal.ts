import { useEffect, useRef, useState, useMemo, CSSProperties } from 'react';

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  /** Slide-up distance in px (default 24) */
  slideDistance?: number;
  /** Animation duration in ms (default 500) */
  duration?: number;
  /** Stagger delay in ms (default 0) */
  delay?: number;
  /** Animation type: 'fade' just fades in, 'slideUp' fades + slides up */
  type?: 'fade' | 'slideUp';
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -40px 0px',
    triggerOnce = true,
    slideDistance = 24,
    duration = 500,
    delay = 0,
    type = 'slideUp',
  } = options;

  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenSeen, setHasBeenSeen] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let rafId1: number;
    let rafId2: number;
    let observer: IntersectionObserver | null = null;

    rafId1 = requestAnimationFrame(() => {
      rafId2 = requestAnimationFrame(() => {
        if (!ref.current) return;

        observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              setHasBeenSeen(true);
              if (triggerOnce && observer) {
                observer.disconnect();
              }
            } else if (!triggerOnce) {
              setIsVisible(false);
            }
          },
          { threshold, rootMargin }
        );

        observer.observe(element);
      });
    });

    return () => {
      cancelAnimationFrame(rafId1);
      cancelAnimationFrame(rafId2);
      if (observer) observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  const style = useMemo((): CSSProperties => {
    const hidden: CSSProperties = {
      opacity: 0,
      transform: type === 'slideUp' ? `translateY(${slideDistance}px)` : 'none',
      transition: `opacity ${duration}ms cubic-bezier(0.25, 1, 0.5, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.25, 1, 0.5, 1) ${delay}ms`,
    };

    const visible: CSSProperties = {
      opacity: 1,
      transform: 'translateY(0)',
      transition: `opacity ${duration}ms cubic-bezier(0.25, 1, 0.5, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.25, 1, 0.5, 1) ${delay}ms`,
    };

    return isVisible ? visible : hidden;
  }, [isVisible, type, slideDistance, duration, delay]);

  return { ref, isVisible, hasBeenSeen, style };
}
