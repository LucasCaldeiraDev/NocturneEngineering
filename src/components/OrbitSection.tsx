import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ORBIT } from '../lib/stages'

gsap.registerPlugin(ScrollTrigger)

const SCRUB_START = 0.03
const SCRUB_END = 0.97
/** Same governor as AssemblySequence: caps the playhead's per-frame jump. */
const MAX_TIME_STEP = 0.35
/** Same velocity-ceiling governor as AssemblySequence — see its docs. */
const GOVERNOR_LERP = 0.14
const GOVERNOR_MAX_STEP = 0.01

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

    let tick: (() => void) | null = null

    const ctx = gsap.context(() => {
      const mobile = window.matchMedia('(max-width: 767px)').matches

      // Paused, driven manually from the tick loop below (not ScrollTrigger's
      // own scrub) — see AssemblySequence for why: a fixed-duration scrub
      // covers a big jump proportionally *faster*, which can skip the video
      // scrub ahead of what's loaded. A capped-velocity governor can't.
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } })

      let rawProgress = 0
      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: mobile ? '+=180%' : '+=250%',
        pin: true,
        anticipatePin: 1,
        onUpdate(self) {
          rawProgress = self.progress
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

      let displayProgress = 0

      tick = () => {
        if (!st.isActive) {
          // Off-screen: snap instead of governing, so the caption/video are
          // in the correct end state if the user scrolls back into view.
          displayProgress = rawProgress
          tl.progress(displayProgress)
          return
        }
        const delta = rawProgress - displayProgress
        if (Math.abs(delta) > 0.0004) {
          const dr = gsap.ticker.deltaRatio(60)
          const step = delta * GOVERNOR_LERP * dr
          const maxStep = GOVERNOR_MAX_STEP * dr
          displayProgress += Math.sign(step) * Math.min(Math.abs(step), maxStep)
        } else {
          displayProgress = rawProgress
        }
        tl.progress(displayProgress)

        if (!video.duration || Number.isNaN(video.duration) || video.seeking) return
        const frac = gsap.utils.clamp(0, 1, (displayProgress - SCRUB_START) / (SCRUB_END - SCRUB_START))
        const target = frac * Math.max(video.duration - 0.05, 0)
        const vdelta = target - video.currentTime
        if (Math.abs(vdelta) > 0.02) {
          const maxStep = MAX_TIME_STEP * gsap.ticker.deltaRatio(60)
          video.currentTime += Math.sign(vdelta) * Math.min(Math.abs(vdelta), maxStep)
        }
      }
      gsap.ticker.add(tick)

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

    return () => {
      if (tick) gsap.ticker.remove(tick)
      ctx.revert()
    }
  }, [reduced, failed])

  if (reduced || failed) {
    return (
      <section aria-label="Walk-around">
        <figure className="relative md:h-svh">
          <img
            src={ORBIT.poster}
            alt="The finished Nocturne GT-1 standing in the dark studio"
            className="aspect-[4/3] w-full object-cover object-[52%_50%] md:aspect-auto md:h-full md:object-center"
            loading="lazy"
          />
          <figcaption className="hud-label text-ink/80 w-full px-6 py-8 text-center md:absolute md:bottom-10 md:px-0 md:py-0">
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
      <div className="stage-box absolute inset-x-0 top-14 aspect-[4/3] md:inset-0 md:top-0 md:aspect-auto">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover object-[52%_50%] md:object-center"
          muted
          playsInline
          preload="none"
          poster={ORBIT.poster}
          aria-label="Slow camera orbit around the finished Nocturne GT-1"
          onError={() => setFailed(true)}
          tabIndex={-1}
        />
      </div>
      <p
        ref={captionRef}
        className="hud-label text-ink/80 absolute top-[calc(3.5rem+75vw+2.5rem)] w-full px-6 text-center md:top-auto md:bottom-12 md:px-0"
        style={{ visibility: 'hidden' }}
      >
        Take the walk — every angle was an argument.
      </p>
    </section>
  )
}
