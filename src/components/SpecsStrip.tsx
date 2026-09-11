import { useRef } from 'react'
import { SPEC_SHEET } from '../lib/stages'
import { useReveal } from '../lib/useReveal'

const HEADLINE_STATS: Array<[string, string]> = [
  ['2.9 s', '0–100 km/h'],
  ['620', 'hp'],
  ['1,340', 'kg dry'],
  ['499', 'units, ever'],
]

export default function SpecsStrip({ reduced }: { reduced: boolean }) {
  const sectionRef = useRef<HTMLElement>(null)
  useReveal(sectionRef, reduced, 0.06)

  return (
    <section
      ref={sectionRef}
      id="spec"
      aria-label="Specification"
      className="border-line bg-bg border-y"
    >
      <div className="divide-line mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4 md:divide-x">
        {HEADLINE_STATS.map(([value, label]) => (
          <div key={label} data-reveal className="px-4 py-10 sm:px-8 md:py-14">
            <p className="display text-2xl sm:text-3xl md:text-4xl">{value}</p>
            <p className="hud-label text-muted mt-2">{label}</p>
          </div>
        ))}
      </div>

      <div className="border-line border-t">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-10 px-8 py-12 sm:grid-cols-2 lg:grid-cols-4 md:py-16">
          {SPEC_SHEET.map((group) => (
            <div key={group.group} data-reveal className="py-4">
              <h3 className="hud-label text-hud">{group.group}</h3>
              <dl className="mt-4">
                {group.rows.map(([term, value]) => (
                  <div
                    key={term}
                    className="border-line flex items-baseline justify-between gap-4 border-b py-2.5"
                  >
                    <dt className="hud-label text-muted">{term}</dt>
                    <dd className="text-ink text-right text-sm">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
        <p className="hud-label text-muted/70 mx-auto max-w-6xl px-8 pb-10 text-center">
          Concept figures — every number is part of the fiction.
        </p>
      </div>
    </section>
  )
}
