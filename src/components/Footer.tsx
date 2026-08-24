export default function Footer() {
  return (
    <footer id="contact" className="px-6 py-14 md:px-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="display text-2xl">Nocturne</p>
          <p className="text-muted mt-3 max-w-md text-xs leading-relaxed">
            NOCTURNE is a fictional marque created for this concept experience. Every number on this
            page is part of the fiction.
          </p>
        </div>
        <p className="hud-label text-muted">Designed &amp; engineered by Lucas Caldeira · 2026</p>
      </div>
    </footer>
  )
}
