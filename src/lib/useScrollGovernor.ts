import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** How long (seconds) a touch flick may keep coasting after the finger lifts. */
const MIN_MOMENTUM_DURATION = 0.6
const MAX_MOMENTUM_DURATION = 1.6

/**
 * Caps touch-flick momentum so a hard swipe can't fling the page past
 * several video-scrubbed transition windows before their footage has had
 * real wall-clock time to load. Without this, a fast flick shows the plain
 * wipe fallback instead of the real assembly footage for whichever window
 * it outran — the point of this governor is to keep that from happening.
 *
 * This only dampens the post-release momentum coast; it doesn't fight the
 * user's finger during an active drag. Keyboard and scrollbar-drag jumps
 * aren't touch/wheel input at all, so they're covered separately by the
 * per-frame time-step clamp inside each video scrubber (AssemblySequence,
 * OrbitSection) — that clamp is the hard guarantee against a visible pop;
 * this hook just makes reaching for it less likely.
 */
export function useScrollGovernor(reduced: boolean) {
  useLayoutEffect(() => {
    if (reduced) return
    // GSAP's ticker auto-sleeps (reduces to a crawl) after ~2s when it
    // doesn't see an actively-playing tween — which our manually-driven,
    // paused timelines (AssemblySequence, OrbitSection) never are. Without
    // this, the governor's own per-tick catch-up can stall to a handful of
    // updates per second instead of 60, defeating the whole point.
    gsap.config({ autoSleep: 0 })
    const normalizer = ScrollTrigger.normalizeScroll({
      type: 'touch,wheel',
      momentum: (self: Observer) =>
        gsap.utils.clamp(
          MIN_MOMENTUM_DURATION,
          MAX_MOMENTUM_DURATION,
          Math.abs(self.velocityY) / 1400,
        ),
    })
    return () => {
      if (normalizer && typeof normalizer.kill === 'function') normalizer.kill()
    }
  }, [reduced])
}
