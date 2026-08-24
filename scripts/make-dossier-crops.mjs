import sharp from 'sharp'
import { mkdirSync, statSync } from 'node:fs'

const SRC = 'assets-src'
const OUT = 'public/assets'
mkdirSync(OUT, { recursive: true })

// Close-up crops for the Dossier section, cut from the approved master frames.
// Source frames are 2752x1536; every crop is 880x1100 (4:5).
const CROPS = [
  { src: 'stage-01.png', name: 'dossier-structure', left: 900, top: 420 },
  { src: 'stage-02.png', name: 'dossier-damping', left: 320, top: 380 },
  { src: 'stage-03.png', name: 'dossier-contact', left: 1420, top: 400 },
  { src: 'stage-04.png', name: 'dossier-skin', left: 620, top: 436 },
  { src: 'stage-06.png', name: 'dossier-vision', left: 1500, top: 350 },
  { src: 'stage-06.png', name: 'dossier-surface', left: 1050, top: 220 },
]
const W = 880
const H = 1100

const kb = (p) => `${Math.round(statSync(p).size / 1024)} KB`

for (const c of CROPS) {
  const source = c.src === 'stage-06.png' ? `${SRC}/master-A.png` : `${SRC}/${c.src}`
  const out = `${OUT}/${c.name}.webp`
  await sharp(source)
    .extract({ left: c.left, top: c.top, width: W, height: H })
    .webp({ quality: 82 })
    .toFile(out)
  console.log(c.name, '→', kb(out))
}
console.log('done')
