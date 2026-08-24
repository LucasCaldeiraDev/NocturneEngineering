import { useLayoutEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Fades in every [data-reveal] child of the section once, when it scrolls
 * into view. No-op under prefers-reduced-motion.
 */
export function useReveal(ref: RefObject<HTMLElement | null>, reduced: boolean, stagger = 0.1) {
  useLayoutEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.from('[data-reveal]', {
        autoAlpha: 0,
        y: 36,
        duration: 0.9,
        ease: 'power3.out',
        stagger,
        scrollTrigger: { trigger: el, start: 'top 70%', once: true },
      })
    }, el)
    return () => ctx.revert()
  }, [ref, reduced, stagger])
}
