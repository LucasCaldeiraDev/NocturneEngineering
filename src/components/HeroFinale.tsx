import { useEffect, useRef, useState } from 'react'
import { FINISHES, STAGES } from '../lib/stages'
import { useReveal } from '../lib/useReveal'

export default function HeroFinale({ reduced }: { reduced: boolean }) {
  const sectionRef = useRef<HTMLElement>(null)
  const [finish, setFinish] = useState(0)
  const [variantsReady, setVariantsReady] = useState(false)
  useReveal(sectionRef, reduced)

  // Warm the paint variants before the section arrives so switching is instant.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          FINISHES.slice(1).forEach((f) => {
            const img = new Image()
            img.src = f.img
          })
          setVariantsReady(true)
          io.disconnect()
        }
      },
      { rootMargin: '600px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const hero = STAGES[5]

  return (
    <section
      ref={sectionRef}
      id="finale"
      aria-label="Nocturne GT-1 — engineered to be desired"
      className="relative flex min-h-svh items-end overflow-hidden"
    >
      <picture>
        <source media="(max-width: 767px)" srcSet={hero.imgMobile} />
        <img
          src={hero.img}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-[62%_50%] md:object-center"
          loading="lazy"
        />
      </picture>
      {FINISHES.slice(1).map((f, i) => (
        <img
          key={f.id}
          src={variantsReady ? f.img : undefined}
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-[62%_50%] transition-opacity duration-700 md:object-center"
          style={{ opacity: finish === i + 1 ? 1 : 0 }}
        />
      ))}
      <div aria-hidden className="copy-scrim absolute inset-x-0 bottom-0 h-96" />
      <div className="relative z-10 w-full px-6 pb-16 md:px-14 md:pb-24">
        <p data-reveal className="hud-label text-hud">
          The result
        </p>
        <h2 data-reveal className="display mt-4 text-5xl md:text-8xl">
          Engineered
          <br />
          to be desired.
        </h2>
        <p data-reveal className="hud-label text-muted mt-6">
          Nocturne GT-1 · A concept grand tourer · Limited to 499
        </p>

        <div data-reveal className="mt-8">
          <p className="hud-label text-muted">Choose your obsession</p>
          <div className="mt-3 flex items-center gap-3" role="radiogroup" aria-label="Paint finish">
            {FINISHES.map((f, i) => (
              <button
                key={f.id}
                type="button"
                role="radio"
                aria-checked={finish === i}
                onClick={() => setFinish(i)}
                title={f.name}
                className={`h-9 w-9 rounded-full border-2 transition-transform duration-200 ${
                  finish === i ? 'border-ink scale-110' : 'border-line hover:border-muted'
                }`}
                style={{ background: f.swatch }}
              >
                <span className="sr-only">{f.name}</span>
              </button>
            ))}
            <span className="hud-label text-ink/70 ml-2" aria-live="polite">
              {FINISHES[finish].name}
            </span>
          </div>
        </div>

        <div data-reveal className="mt-10 flex flex-wrap gap-4">
          <a className="btn btn-primary" href="#contact">
            Reserve the One
          </a>
          <a className="btn" href="#spec">
            Specification
          </a>
        </div>
      </div>
    </section>
  )
}
