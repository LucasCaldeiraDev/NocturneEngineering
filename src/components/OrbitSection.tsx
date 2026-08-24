import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ORBIT } from '../lib/stages'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scroll-scrubbed 360° walk-around. The video is lazily attached when the
 * section approaches, and its currentTime is driven by scroll progress.
 */
export default function OrbitSection({ reduced }: { reduced: boolean }) {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const captionRef = useRef<HTMLParagraphElement>(null)
  const [failed, setFailed] = useState(false)

  useLayoutEffect(() => {
    if (reduced || failed) return
    const section = sectionRef.current
    const video = videoRef.current
    if (!section || !video) return

    const ctx = gsap.context(() => {
      const mobile = window.matchMedia('(max-width: 767px)').matches

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: mobile ? '+=180%' : '+=250%',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      })

      tl.fromTo(
        captionRef.current,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.08, ease: 'power2.out' },
        0.02,
      )
      tl.to(captionRef.current, { autoAlpha: 0, duration: 0.08 }, 0.9)
      tl.to({}, { duration: 0.02 }, 0.98) // keep the timeline spanning the full pin

      const attachScrub = () => {
        if (!video.duration || Number.isNaN(video.duration)) return
        tl.to(video, { currentTime: Math.max(video.duration - 0.05, 0), duration: 0.94 }, 0.03)
      }
      if (video.readyState >= 1) attachScrub()
      else video.addEventListener('loadedmetadata', attachScrub, { once: true })

      // Attach the real source only when the user gets close.
      ScrollTrigger.create({
        trigger: section,
        start: 'top 250%',
        once: true,
        onEnter: () => {
          if (!video.src) {
            video.src = mobile ? ORBIT.mobile : ORBIT.desktop
            video.load()
          }
        },
      })
    }, section)

    return () => ctx.revert()
  }, [reduced, failed])

  if (reduced || failed) {
    return (
      <section aria-label="Walk-around">
        <figure className="relative h-svh">
          <img
            src={ORBIT.poster}
            alt="The finished Nocturne GT-1 standing in the dark studio"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <figcaption className="hud-label text-ink/80 absolute bottom-10 w-full text-center">
            Take the walk — every angle was an argument.
          </figcaption>
        </figure>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Walk-around"
      className="bg-bg relative h-svh overflow-hidden"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        playsInline
        preload="none"
        poster={ORBIT.poster}
        aria-label="Slow camera orbit around the finished Nocturne GT-1"
        onError={() => setFailed(true)}
        tabIndex={-1}
      />
      <p
        ref={captionRef}
        className="hud-label text-ink/80 absolute bottom-12 w-full text-center"
        style={{ visibility: 'hidden' }}
      >
        Take the walk — every angle was an argument.
      </p>
    </section>
  )
}
