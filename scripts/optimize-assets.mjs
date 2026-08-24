import sharp from 'sharp'
import { existsSync, mkdirSync, statSync } from 'node:fs'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import ffmpegPath from 'ffmpeg-static'

const SRC = 'assets-src'
const OUT = 'public/assets'
mkdirSync(OUT, { recursive: true })

const FRAMES = [
  ['stage-01.png', 'stage-01-chassis'],
  ['stage-02.png', 'stage-02-suspension'],
  ['stage-03.png', 'stage-03-wheels'],
  ['stage-04.png', 'stage-04-body'],
  ['stage-05.png', 'stage-05-ignition'],
  ['master-A.png', 'stage-06-finish'],
  ['finish-graphite.png', 'finish-graphite'],
  ['finish-oxblood.png', 'finish-oxblood'],
]

const kb = (p) => `${Math.round(statSync(p).size / 1024)} KB`

for (const [src, name] of FRAMES) {
  const input = `${SRC}/${src}`
  if (!existsSync(input)) {
    console.warn('missing, skipped:', input)
    continue
  }
  const desktop = `${OUT}/${name}.webp`
  const mobile = `${OUT}/${name}-mobile.webp`
  await sharp(input).resize({ width: 1920 }).webp({ quality: 82 }).toFile(desktop)
  await sharp(input).resize({ width: 1280 }).webp({ quality: 78 }).toFile(mobile)
  console.log(name, '→', kb(desktop), '/', kb(mobile))
}

if (existsSync(`${SRC}/master-A.png`)) {
  await sharp(`${SRC}/master-A.png`)
    .resize({ width: 1200, height: 630, fit: 'cover' })
    .jpeg({ quality: 82 })
    .toFile('public/og.jpg')
  console.log('og.jpg →', kb('public/og.jpg'))
}

// Videos: re-encode with every frame as a keyframe so scroll-scrubbing can
// seek to any position instantly.
const run = promisify(execFile)
const encodeScrub = async (input, outName, width, crf) => {
  await run(ffmpegPath, [
    '-y',
    '-i',
    input,
    '-an',
    '-c:v',
    'libx264',
    '-preset',
    'slow',
    '-g',
    '1',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    '-vf',
    `scale=${width}:-2`,
    '-crf',
    String(crf),
    `${OUT}/${outName}`,
  ])
  console.log(outName, '→', kb(`${OUT}/${outName}`))
}

const orbit = `${SRC}/orbit.mp4`
if (existsSync(orbit) && ffmpegPath) {
  await encodeScrub(orbit, 'orbit-desktop.mp4', 1920, 23)
  await encodeScrub(orbit, 'orbit-mobile.mp4', 1280, 26)
} else {
  console.log('orbit.mp4 not present yet — skipped orbit encodes')
}

const TRANSITIONS = [
  ['transition-1.mp4', 'transition-01-suspension'],
  ['transition-2.mp4', 'transition-02-wheels'],
  ['transition-3.mp4', 'transition-03-body'],
  ['transition-4.mp4', 'transition-04-ignition'],
  ['transition-5.mp4', 'transition-05-paint'],
]
for (const [src, name] of TRANSITIONS) {
  const input = `${SRC}/${src}`
  if (!existsSync(input) || !ffmpegPath) {
    console.log('missing, skipped:', input)
    continue
  }
  await encodeScrub(input, `${name}.mp4`, 1920, 23)
  await encodeScrub(input, `${name}-mobile.mp4`, 960, 27)
}
console.log('done')
