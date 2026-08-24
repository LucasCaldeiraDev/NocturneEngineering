import { useRef } from 'react'
import { DOSSIER } from '../lib/stages'
import { useReveal } from '../lib/useReveal'

export default function Dossier({ reduced }: { reduced: boolean }) {
  const sectionRef = useRef<HTMLElement>(null)
  useReveal(sectionRef, reduced, 0.08)

  return (
    <section
      ref={sectionRef}
      id="dossier"
      aria-label="Engineering dossier"
      className="bg-bg px-6 py-20 md:px-14 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <p data-reveal className="hud-label text-hud">
          The dossier
        </p>
        <h2 data-reveal className="display mt-4 max-w-3xl text-4xl md:text-6xl">
          Engineered in the open.
        </h2>
        <p data-reveal className="text-muted mt-4 max-w-xl text-sm leading-relaxed md:text-base">
          Six subsystems, photographed as they were built. Nothing on this car asks to be taken on
          faith.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
          {DOSSIER.map((d) => (
            <article key={d.id} data-reveal aria-label={`${d.num} ${d.title}`}>
              <div className="border-line overflow-hidden border">
                <img
                  src={d.img}
                  alt={d.alt}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                />
              </div>
              <p className="hud-label text-hud mt-5">
                {d.num} — {d.title}
              </p>
              <h3 className="display mt-2 text-xl md:text-2xl">{d.line}</h3>
              <ul className="mt-4 space-y-1.5">
                {d.data.map((row) => (
                  <li key={row} className="hud-label text-muted border-line border-l pl-3">
                    {row}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
