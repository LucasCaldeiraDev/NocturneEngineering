import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { STAGES, TRANSITIONS } from '../lib/stages'

gsap.registerPlugin(ScrollTrigger)

/**
 * Transition windows on the master timeline (virtual duration = 1).
 * Window i reveals stage i+1. Gaps between windows are reading holds.
 * Inside each window the generated assembly video is scrubbed; the
 * clip-path wipes below act as an automatic fallback when a video
 * has not finished loading by the time its window starts.
 */
const T = [
  { at: 0.1, dur: 0.14 }, // 01→02 suspension descends and bolts in
  { at: 0.26, dur: 0.14 }, // 02→03 wheels press onto the hubs
  { at: 0.42, dur: 0.16 }, // 03→04 body marriage (structural climax)
  { at: 0.6, dur: 0.12 }, // 04→05 ignition — headlights boot up
  { at: 0.74, dur: 0.14 }, // 05→06 paint flows over the carbon
]
const MIDS = T.map((w) => w.at + w.dur / 2)
/** Progress at which each transition video starts loading (one window ahead). */
const LOAD_AT = [0.01, T[0].at, T[1].at, T[2].at, T[3].at]
/**
 * Caps how far a video's playhead can jump in a single frame — the last
 * line of defense against a visible pop, independent of what drove the jump.
 */
const MAX_TIME_STEP = 0.35

/**
 * GSAP's `scrub: N` eases the timeline toward the scroll-derived progress
 * over a FIXED duration of N seconds, regardless of how far it has to
 * travel. That means a huge jump (scrollbar drag, End key, or a hard flick
 * outrunning the touch governor) covers its distance in the SAME time as a
 * tiny one — i.e. proportionally much *faster* — which can sweep straight
 * through several transition windows before their videos have had any
 * chance to load, skipping stages entirely instead of just falling back to
 * the wipe. So the timeline here is driven manually: every tick, this
 * "governed" progress value takes a step toward the real scroll progress
 * that is smoothed for normal scrolling (LERP) but hard-capped in size
 * (MAX_STEP) — a true velocity ceiling, not a duration. That guarantees a
 * minimum dwell time in front of and inside every window, no matter how
 * fast or how the scroll position changed. Both constants are expressed
 * per 60fps frame and scaled by `gsap.ticker.deltaRatio(60)` every tick, so
 * a dropped frame (slow device, throttled tab, background tab) can't quietly
 * raise the effective ceiling — it stays a real-time velocity cap, not a
 * per-callback one.
 */
const GOVERNOR_LERP = 0.11
const GOVERNOR_MAX_STEP = 0.0075

const CLIP_FROM: Record<string, string> = {
  up: 'inset(100% 0% 0% 0%)',
  center: 'inset(0% 50% 0% 50%)',
  down: 'inset(0% 0% 100% 0%)',
}
const CLIP_TO = 'inset(0% 0% 0% 0%)'

export default function AssemblySequence() {
  const sectionRef = useRef<HTMLElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  const stageRefs = useRef<(HTMLDivElement | null)[]>([])
  const imgRefs = useRef<(HTMLImageElement | null)[]>([])
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const copyRefs = useRef<(HTMLDivElement | null)[]>([])
  const tickRefs = useRef<(HTMLSpanElement | null)[]>([])
  const flashRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const sheenRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const mm = gsap.matchMedia()
    mm.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767px)' }, (ctx) => {
      const { mobile } = ctx.conditions as { mobile: boolean }
      const stages = stageRefs.current
      const imgs = imgRefs.current
      const videos = videoRefs.current
      const copies = copyRefs.current

      // Initial states: only stage 01 visible, all copy hidden, intro on.
      STAGES.forEach((s, i) => {
        const el = stages[i]
        if (!el || i === 0) return
        if (s.wipe === 'fade' || s.wipe === 'sheen') {
          gsap.set(el, { opacity: 0 })
        } else {
          gsap.set(el, { clipPath: CLIP_FROM[s.wipe] })
        }
        gsap.set(imgs[i], { scale: 1.04 })
      })
      gsap.set(copies, { autoAlpha: 0, y: 26 })
      gsap.set([flashRef.current, glowRef.current], { opacity: 0 })
      gsap.set(sheenRef.current, { xPercent: -140, skewX: -12, opacity: 0 })
      gsap.set(introRef.current, { autoAlpha: 1 })
      gsap.set(videos, { autoAlpha: 0 })

      // Paused, ungoverned by ScrollTrigger's own scrub — see GOVERNOR_* docs
      // above. A plain ScrollTrigger below only pins the section and reports
      // raw progress; the tick loop drives tl.progress() itself.
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } })

      let rawProgress = 0
      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: mobile ? '+=500%' : '+=700%',
        pin: true,
        anticipatePin: 1,
        onUpdate(self) {
          rawProgress = self.progress
        },
      })

      // Intro overlay hands off to stage copy 01.
      tl.to(introRef.current, { autoAlpha: 0, duration: 0.05, ease: 'power1.in' }, 0.005)
      tl.to(copies[0], { autoAlpha: 1, y: 0, duration: 0.045, ease: 'power2.out' }, 0.05)

      T.forEach((w, i) => {
        const incoming = i + 1
        const stage = STAGES[incoming]
        const el = stages[incoming]
        const img = imgs[incoming]
        if (!el || !img) return

        // Copy handoff.
        tl.to(copies[i], { autoAlpha: 0, y: -18, duration: 0.035, ease: 'power1.in' }, w.at - 0.005)
        tl.to(
          copies[incoming],
          { autoAlpha: 1, y: 0, duration: 0.05, ease: 'power2.out' },
          w.at + w.dur * 0.45,
        )

        // Fallback reveal below the video layer.
        if (stage.wipe === 'fade') {
          tl.to(el, { opacity: 1, duration: w.dur * 0.85, ease: 'power2.inOut' }, w.at)
          tl.fromTo(
            glowRef.current,
            { opacity: 0 },
            { opacity: 0.55, duration: w.dur * 0.5, ease: 'power2.out' },
            w.at + w.dur * 0.15,
          )
          tl.to(
            glowRef.current,
            { opacity: 0, duration: w.dur * 1.4, ease: 'power2.out' },
            w.at + w.dur * 0.75,
          )
        } else if (stage.wipe === 'sheen') {
          tl.to(sheenRef.current, { opacity: 1, duration: w.dur * 0.15 }, w.at)
          tl.to(sheenRef.current, { xPercent: 420, duration: w.dur, ease: 'power1.inOut' }, w.at)
          tl.to(sheenRef.current, { opacity: 0, duration: w.dur * 0.2 }, w.at + w.dur * 0.8)
          tl.to(el, { opacity: 1, duration: w.dur * 0.6, ease: 'power1.inOut' }, w.at + w.dur * 0.2)
        } else {
          tl.to(el, { clipPath: CLIP_TO, duration: w.dur * 0.8, ease: 'power3.inOut' }, w.at)
        }

        // Incoming frame settles.
        tl.to(img, { scale: 1, duration: w.dur, ease: 'power2.out' }, w.at + w.dur * 0.15)

        // Snap flash at the moment the part locks in (ignition gets the glow instead).
        if (stage.wipe !== 'fade') {
          const fAt = w.at + w.dur * 0.8
          const strength = stage.wipe === 'down' ? 0.12 : 0.08
          tl.fromTo(
            flashRef.current,
            { opacity: 0 },
            { opacity: strength, duration: 0.01, ease: 'power1.in' },
            fAt,
          )
          tl.to(flashRef.current, { opacity: 0, duration: 0.025, ease: 'power1.out' }, fAt + 0.01)
        }
      })

      // Final hold — the finished car breathes.
      tl.fromTo(
        stackRef.current,
        { scale: 1 },
        { scale: 1.015, duration: 0.1, ease: 'power1.inOut' },
        0.9,
      )

      // Assembly-video layer: loaded progressively, scrubbed by the smoothed
      // timeline progress, armed per window only when ready before the window
      // starts (so the wipe fallback never gets swapped mid-transition).
      // On phones, videos far behind the playhead release their buffers.
      const armed: boolean[] = T.map(() => false)
      const visible: boolean[] = T.map(() => false)
      const isReady = (v: HTMLVideoElement) =>
        v.readyState >= 2 && !Number.isNaN(v.duration) && v.duration > 0

      const attach = (v: HTMLVideoElement, i: number) => {
        v.dataset.srcSet = '1'
        v.src = mobile ? TRANSITIONS[i].mobile : TRANSITIONS[i].desktop
        v.load()
      }
      const release = (v: HTMLVideoElement, i: number) => {
        delete v.dataset.srcSet
        v.removeAttribute('src')
        v.load()
        armed[i] = false
      }
      const hide = (i: number) => {
        const v = videos[i]
        if (v && visible[i]) {
          visible[i] = false
          gsap.set(v, { autoAlpha: 0 })
        }
      }

      let displayProgress = 0

      const tick = () => {
        if (!st.isActive) {
          // Off-screen (scrolled fully past, or not reached yet): snap
          // instead of governing — there's nothing to protect the user
          // from seeing, and the section must be in its correct end state
          // if they scroll back into it.
          displayProgress = rawProgress
          tl.progress(displayProgress)
          T.forEach((_, i) => hide(i))
          return
        }

        // Governor: smooth for normal scrolling, hard-capped for extreme jumps.
        // Scaled by real elapsed time (deltaRatio) so a dropped frame can't
        // sneak a bigger jump through, and a stalled tick can't stall progress.
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

        const sp = displayProgress
        let active = 0
        for (const m of MIDS) if (sp >= m) active++
        if (counterRef.current) {
          counterRef.current.textContent = `${STAGES[active].num} / 06`
        }
        tickRefs.current.forEach((t, i) => t?.setAttribute('data-active', String(i <= active)))

        T.forEach((w, i) => {
          const v = videos[i]
          if (!v) return
          const end = w.at + w.dur
          if (!v.dataset.srcSet) {
            if (sp >= LOAD_AT[i] && (!mobile || sp <= end + 0.03)) attach(v, i)
          } else if (mobile && (sp > end + 0.06 || sp < LOAD_AT[i] - 0.06)) {
            hide(i)
            release(v, i)
            return
          }
          const inWindow = sp >= w.at && sp < end
          if (!inWindow) {
            armed[i] = isReady(v)
            hide(i)
            return
          }
          if (!armed[i]) return
          if (!visible[i]) {
            visible[i] = true
            gsap.set(v, { autoAlpha: 1 })
          }
          const target = ((sp - w.at) / w.dur) * Math.max(v.duration - 0.05, 0)
          if (!v.seeking) {
            const vDelta = target - v.currentTime
            if (Math.abs(vDelta) > 0.02) {
              const maxStep = MAX_TIME_STEP * gsap.ticker.deltaRatio(60)
              v.currentTime += Math.sign(vDelta) * Math.min(Math.abs(vDelta), maxStep)
            }
          }
        })
      }
      gsap.ticker.add(tick)

      // Warm the first two transitions during idle time, well before the
      // user starts scrolling, so those opening windows rarely need their
      // wipe fallback even under a fast flick — without blocking first paint.
      const warmEarly = () => {
        ;[0, 1].forEach((i) => {
          const v = videos[i]
          if (v && !v.dataset.srcSet) attach(v, i)
        })
      }
      const hasIdle = typeof window.requestIdleCallback === 'function'
      const idleId = hasIdle
        ? window.requestIdleCallback(warmEarly, { timeout: 4000 })
        : window.setTimeout(warmEarly, 2500)

      return () => {
        gsap.ticker.remove(tick)
        if (hasIdle) window.cancelIdleCallback(idleId)
        else window.clearTimeout(idleId)
        st.kill()
        tl.kill()
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="Build sequence"
      className="bg-bg relative h-svh overflow-hidden"
    >
      <div ref={stackRef} className="vignette absolute inset-0">
        {STAGES.map((s, i) => (
          <div
            key={s.id}
            ref={(el) => {
              stageRefs.current[i] = el
            }}
            className="absolute inset-0"
            style={{ willChange: 'clip-path, opacity' }}
          >
            <picture>
              <source media="(max-width: 767px)" srcSet={s.imgMobile} />
              <img
                ref={(el) => {
                  imgRefs.current[i] = el
                }}
                src={s.img}
                alt={s.alt}
                className="absolute inset-0 h-full w-full object-cover object-[62%_50%] md:object-center"
                style={{ willChange: 'transform' }}
                fetchPriority={i === 0 ? 'high' : 'low'}
                draggable={false}
              />
            </picture>
          </div>
        ))}

        {/* Assembly transition videos (scrubbed; wipes below are the fallback) */}
        {TRANSITIONS.map((t, i) => (
          <video
            key={t.desktop}
            ref={(el) => {
              videoRefs.current[i] = el
            }}
            className="absolute inset-0 h-full w-full object-cover object-[62%_50%] md:object-center"
            muted
            playsInline
            preload="none"
            disablePictureInPicture
            tabIndex={-1}
            aria-hidden
            style={{ visibility: 'hidden', opacity: 0, willChange: 'opacity' }}
          />
        ))}

        <div
          ref={glowRef}
          aria-hidden
          className="absolute top-[54%] left-[58%] h-[48vmin] w-[48vmin] -translate-x-1/2 -translate-y-1/2 rounded-full md:left-[70%]"
          style={{
            background:
              'radial-gradient(closest-side, rgba(255,180,84,0.5), rgba(255,180,84,0.12) 55%, transparent 75%)',
            filter: 'blur(28px)',
          }}
        />
        <div ref={sheenRef} aria-hidden className="sheen" />
      </div>

      <div ref={flashRef} aria-hidden className="absolute inset-0 bg-white" />

      <div aria-hidden className="copy-scrim absolute inset-x-0 bottom-0 h-72" />

      {/* HUD chrome */}
      <div className="hud-label text-ink/80 hud-chrome absolute top-6 left-6 md:left-10">
        Nocturne
      </div>
      <div
        ref={counterRef}
        aria-hidden
        className="hud-label text-hud/80 hud-chrome absolute top-6 right-6 md:right-10"
      >
        01 / 06
      </div>

      {/* Progress rail */}
      <div
        aria-hidden
        className="absolute top-1/2 left-6 hidden -translate-y-1/2 flex-col gap-2 md:flex"
      >
        {STAGES.map((s, i) => (
          <span
            key={s.id}
            ref={(el) => {
              tickRefs.current[i] = el
            }}
            className="rail-tick"
            data-active={i === 0}
          />
        ))}
      </div>

      {/* Stage copy */}
      {STAGES.map((s, i) => (
        <div
          key={s.id}
          ref={(el) => {
            copyRefs.current[i] = el
          }}
          className="absolute bottom-14 left-6 max-w-md pr-6 md:bottom-20 md:left-14"
          style={{ visibility: 'hidden' }}
        >
          <p className="hud-label text-hud">
            {s.num} — {s.name}
          </p>
          <h2 className="display mt-3 text-4xl md:text-6xl">{s.headline}</h2>
          <p className="text-muted mt-3 max-w-sm text-sm leading-relaxed md:text-base">{s.sub}</p>
          <p className="hud-label border-ember/60 text-ink/70 mt-4 border-l pl-3">{s.spec}</p>
        </div>
      ))}

      {/* Intro overlay */}
      <div ref={introRef} className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="hud-label text-hud hud-chrome">Nocturne Automotive</p>
        <p className="display hud-chrome mt-10 text-[13vw] leading-none md:text-[9vw]">Nocturne</p>
        <p className="hud-label hud-chrome text-ink/70 mt-10">Concept GT-1</p>
        <div className="absolute bottom-10 flex flex-col items-center gap-3">
          <p className="hud-label text-ink/70">Scroll to build</p>
          <span className="cue-line" aria-hidden />
        </div>
      </div>
    </section>
  )
}
