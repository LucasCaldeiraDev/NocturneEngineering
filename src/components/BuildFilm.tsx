import { useEffect, useRef, useState } from 'react'
import { FILM } from '../lib/stages'
import { useReveal } from '../lib/useReveal'

/** The assembled cut of every build stage — user-initiated playback, lazy source. */
export default function BuildFilm({ reduced }: { reduced: boolean }) {
  const sectionRef = useRef<HTMLElement>(null)
  const [ready, setReady] = useState(false)
  useReveal(sectionRef, reduced)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setReady(true)
          io.disconnect()
        }
      },
      { rootMargin: '400px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="film"
      aria-label="The build film"
      className="bg-surface border-line border-y px-6 py-20 md:px-14 md:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <p data-reveal className="hud-label text-hud">
          The film
        </p>
        <h2 data-reveal className="display mt-4 text-4xl md:text-6xl">
          {FILM.duration} — chassis to desire.
        </h2>
        <p data-reveal className="text-muted mt-4 max-w-xl text-sm leading-relaxed md:text-base">
          Every stage of the build, cut into one continuous piece. Press play, or scroll back up and
          direct it yourself.
        </p>
        <div data-reveal className="border-line mt-10 border">
          <video
            className="block w-full"
            controls
            playsInline
            preload="none"
            poster={FILM.poster}
            src={ready ? FILM.src : undefined}
            aria-label="The Nocturne GT-1 build film: chassis, suspension, wheels, body, ignition, paint, and a full orbit"
          />
        </div>
      </div>
    </section>
  )
}
