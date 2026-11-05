import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useScrollReveal — IntersectionObserver-based reveal.
 * Returns [ref, isVisible]. The .reveal CSS class handles animation.
 */
export function useScrollReveal(threshold = 0.08) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold, rootMargin: '0px 0px -40px 0px' }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [threshold]);

    return [ref, isVisible];
}

/**
 * useStaggerReveal — reveals each child with stagger delay.
 */
export function useStaggerReveal(threshold = 0.08) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold, rootMargin: '0px 0px -40px 0px' }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [threshold]);

    return [ref, isVisible];
}

/**
 * useGSAPReveal — GSAP ScrollTrigger stagger reveal for a group of elements.
 * @param {string} selector — CSS selector for child elements to stagger
 * @param {object} opts — GSAP from() vars + optional stagger, delay
 */
export function useGSAPReveal(selector, opts = {}) {
    const ref = useRef(null);

    useEffect(() => {
        if (!ref.current) return;
        const ctx = gsap.context(() => {
            gsap.from(selector, {
                opacity: 0,
                y: opts.y ?? 40,
                x: opts.x ?? 0,
                rotate: opts.rotate ?? 0,
                scale: opts.scale ?? 1,
                duration: opts.duration ?? 0.75,
                ease: opts.ease ?? 'power2.out',
                stagger: opts.stagger ?? 0.1,
                delay: opts.delay ?? 0,
                scrollTrigger: {
                    trigger: ref.current,
                    start: opts.start ?? 'top 80%',
                    toggleActions: 'play none none none',
                    ...opts.scrollTrigger,
                },
            });
        }, ref);
        return () => ctx.revert();
    }, [selector, opts]);

    return ref;
}

/**
 * useCounter — counts a number up from 0 to target when element enters viewport.
 * @param {number} target — the final value
 * @param {number} decimals — decimal places
 * @param {string} suffix — suffix like '%' or ''
 */
export function useCounter(target, decimals = 0, suffix = '') {
    const ref = useRef(null);
    const [display, setDisplay] = useState('0');

    useEffect(() => {
        if (!ref.current) return;
        const obj = { val: 0 };
        const st = ScrollTrigger.create({
            trigger: ref.current,
            start: 'top 85%',
            onEnter: () => {
                gsap.to(obj, {
                    val: target,
                    duration: 1.8,
                    ease: 'power2.out',
                    onUpdate: () => {
                        setDisplay(obj.val.toFixed(decimals) + suffix);
                    },
                });
            },
        });
        return () => st.kill();
    }, [target, decimals, suffix]);

    return [ref, display];
}

/**
 * useParallax — scroll-linked parallax offset.
 * Works with Framer Motion useScroll + useTransform.
 */
export { useRef, useState };
