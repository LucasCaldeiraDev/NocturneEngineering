import Preloader from './components/Preloader'
import Grain from './components/Grain'
import AssemblySequence from './components/AssemblySequence'
import StaticSequence from './components/StaticSequence'
import OrbitSection from './components/OrbitSection'
import HeroFinale from './components/HeroFinale'
import Dossier from './components/Dossier'
import BuildFilm from './components/BuildFilm'
import SpecsStrip from './components/SpecsStrip'
import Footer from './components/Footer'
import { usePrefersReducedMotion } from './lib/usePrefersReducedMotion'

export default function App() {
  const reduced = usePrefersReducedMotion()

  return (
    <>
      <a className="skip-link" href="#finale">
        Skip build sequence
      </a>
      <Preloader />
      <Grain />
      <main>
        <h1 className="sr-only">
          NOCTURNE GT-1 — a grand tourer assembled by your scroll. Engineered to be desired.
        </h1>
        {reduced ? <StaticSequence /> : <AssemblySequence />}
        <OrbitSection reduced={reduced} />
        <HeroFinale reduced={reduced} />
        <Dossier reduced={reduced} />
        <BuildFilm reduced={reduced} />
        <SpecsStrip reduced={reduced} />
        <Footer />
      </main>
    </>
  )
}
