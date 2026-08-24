import { useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { STAGES } from '../lib/stages'

/** Gates first paint on stage 01 + fonts, with a hard 6 s safety valve. */
export default function Preloader() {
  const [state, setState] = useState<'loading' | 'leaving' | 'gone'>('loading')

  useEffect(() => {
    document.documentElement.classList.add('no-scroll')
    const img = new Image()
    img.src = STAGES[0].img
    const imgReady = img
      .decode()
      .catch(() => {})
      .then(() => {})
    const fontsReady = 'fonts' in document ? document.fonts.ready.then(() => {}) : Promise.resolve()
    const minTime = new Promise((r) => setTimeout(r, 800))
    const safety = new Promise((r) => setTimeout(r, 6000))
    let alive = true
    Promise.race([Promise.all([imgReady, fontsReady, minTime]), safety]).then(() => {
      if (alive) setState('leaving')
    })
    return () => {
      alive = false
      document.documentElement.classList.remove('no-scroll')
    }
  }, [])

  useEffect(() => {
    if (state !== 'leaving') return
    const t = setTimeout(() => {
      setState('gone')
      document.documentElement.classList.remove('no-scroll')
      ScrollTrigger.refresh()
    }, 700)
    return () => clearTimeout(t)
  }, [state])

  if (state === 'gone') return null

  return (
    <div
      role="status"
      aria-label="Loading"
      aria-hidden={state === 'leaving'}
      className={`bg-bg fixed inset-0 z-[80] flex flex-col items-center justify-center transition-opacity duration-700 ${
        state === 'leaving' ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <p className="display text-3xl">Nocturne</p>
      <div className="bg-line mt-6 h-px w-40 overflow-hidden">
        <div className="loader-bar bg-hud h-full w-1/3" />
      </div>
      <p className="hud-label text-muted mt-4">Preparing the build</p>
    </div>
  )
}
