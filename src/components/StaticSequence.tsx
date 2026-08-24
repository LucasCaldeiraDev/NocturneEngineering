import { STAGES } from '../lib/stages'

/** Reduced-motion variant: the full narrative as a static, scrollable document. */
export default function StaticSequence() {
  return (
    <div>
      <header className="flex h-svh flex-col items-center justify-center px-6 text-center">
        <p className="hud-label text-hud">Nocturne Automotive</p>
        <p className="display mt-4 text-6xl md:text-8xl">Nocturne</p>
        <p className="hud-label text-muted mt-4">Concept GT-1 — the build, stage by stage</p>
      </header>
      {STAGES.map((s) => (
        <section key={s.id} aria-label={s.name} className="border-line border-t">
          <picture>
            <source media="(max-width: 767px)" srcSet={s.imgMobile} />
            <img
              src={s.img}
              alt={s.alt}
              className="h-[70svh] w-full object-cover object-[62%_50%] md:object-center"
              loading="lazy"
            />
          </picture>
          <div className="mx-auto max-w-3xl px-6 py-12">
            <p className="hud-label text-hud">
              {s.num} — {s.name}
            </p>
            <h2 className="display mt-3 text-3xl md:text-5xl">{s.headline}</h2>
            <p className="text-muted mt-3 leading-relaxed">{s.sub}</p>
            <p className="hud-label border-ember/60 text-ink/70 mt-4 border-l pl-3">{s.spec}</p>
          </div>
        </section>
      ))}
    </div>
  )
}
