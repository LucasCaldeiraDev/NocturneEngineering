/** Prefixes Vite's base URL so assets resolve under GitHub Pages subpaths. */
const a = (p: string) => `${import.meta.env.BASE_URL}${p}`

export type Wipe = 'none' | 'up' | 'center' | 'down' | 'fade' | 'sheen'

export interface Stage {
  id: string
  num: string
  name: string
  headline: string
  sub: string
  spec: string
  /** how this stage's frame is revealed when it becomes active */
  wipe: Wipe
  img: string
  imgMobile: string
  alt: string
}

export const STAGES: Stage[] = [
  {
    id: 'chassis',
    num: '01',
    name: 'Chassis',
    headline: 'Truth, before beauty.',
    sub: 'A bonded-aluminium monocoque, laid bare. Nothing to hide behind.',
    spec: 'MONOCOQUE · 212 KG',
    wipe: 'none',
    img: a('assets/stage-01-chassis.webp'),
    imgMobile: a('assets/stage-01-chassis-mobile.webp'),
    alt: 'Bare aluminium chassis of the Nocturne GT-1 resting on stands in a dark studio',
  },
  {
    id: 'suspension',
    num: '02',
    name: 'Suspension',
    headline: 'Control is installed.',
    sub: 'Double wishbones and adaptive dampers, torqued to spec.',
    spec: 'DOUBLE WISHBONE · ADAPTIVE',
    wipe: 'up',
    img: a('assets/stage-02-suspension.webp'),
    imgMobile: a('assets/stage-02-suspension-mobile.webp'),
    alt: 'Chassis with double-wishbone suspension assemblies fitted, still without wheels',
  },
  {
    id: 'wheels',
    num: '03',
    name: 'Wheels',
    headline: 'First contact.',
    sub: 'Four forged points where engineering meets the road.',
    spec: '21″ FORGED MONOBLOCK',
    wipe: 'center',
    img: a('assets/stage-03-wheels.webp'),
    imgMobile: a('assets/stage-03-wheels-mobile.webp'),
    alt: 'Rolling chassis with four dark forged wheels mounted',
  },
  {
    id: 'body',
    num: '04',
    name: 'Body',
    headline: 'Form arrives.',
    sub: 'A carbon shell drawn by wind, lowered into place.',
    spec: 'CARBON SHELL · CD 0.26',
    wipe: 'down',
    img: a('assets/stage-04-body.webp'),
    imgMobile: a('assets/stage-04-body-mobile.webp'),
    alt: 'Complete car body in unpainted matte carbon, headlights off',
  },
  {
    id: 'ignition',
    num: '05',
    name: 'Ignition',
    headline: 'It looks back.',
    sub: 'Matrix LED eyes open. The machine becomes a presence.',
    spec: 'ADAPTIVE MATRIX LED',
    wipe: 'fade',
    img: a('assets/stage-05-ignition.webp'),
    imgMobile: a('assets/stage-05-ignition-mobile.webp'),
    alt: 'The unpainted car with its LED headlights switched on, glowing in the dark studio',
  },
  {
    id: 'finish',
    num: '06',
    name: 'Finish',
    headline: 'Desire, applied.',
    sub: 'Seven hand-polished layers of Nocturne Blue.',
    spec: 'NOCTURNE BLUE · 7 LAYERS',
    wipe: 'sheen',
    img: a('assets/stage-06-finish.webp'),
    imgMobile: a('assets/stage-06-finish-mobile.webp'),
    alt: 'The finished Nocturne GT-1 in glossy midnight-blue paint, headlights on',
  },
]

/** Scroll-scrubbed assembly transition videos (start frame = stage N, end frame = stage N+1). */
export interface TransitionAsset {
  desktop: string
  mobile: string
}

export const TRANSITIONS: TransitionAsset[] = [
  {
    desktop: a('assets/transition-01-suspension.mp4'),
    mobile: a('assets/transition-01-suspension-mobile.mp4'),
  },
  {
    desktop: a('assets/transition-02-wheels.mp4'),
    mobile: a('assets/transition-02-wheels-mobile.mp4'),
  },
  {
    desktop: a('assets/transition-03-body.mp4'),
    mobile: a('assets/transition-03-body-mobile.mp4'),
  },
  {
    desktop: a('assets/transition-04-ignition.mp4'),
    mobile: a('assets/transition-04-ignition-mobile.mp4'),
  },
  {
    desktop: a('assets/transition-05-paint.mp4'),
    mobile: a('assets/transition-05-paint-mobile.mp4'),
  },
]

export const ORBIT = {
  desktop: a('assets/orbit-desktop.mp4'),
  mobile: a('assets/orbit-mobile.mp4'),
  // The orbit starts and ends on the finish frame, so it doubles as poster
  // (and is already cached from the assembly sequence).
  poster: a('assets/stage-06-finish.webp'),
}

/** Paint finishes offered in the finale configurator. Index 0 is the hero default. */
export interface Finish {
  id: string
  name: string
  swatch: string
  img: string
  imgMobile: string
}

export const FINISHES: Finish[] = [
  {
    id: 'nocturne-blue',
    name: 'Nocturne Blue',
    swatch: '#1b2a4a',
    img: a('assets/stage-06-finish.webp'),
    imgMobile: a('assets/stage-06-finish-mobile.webp'),
  },
  {
    id: 'graphite-storm',
    name: 'Graphite Storm',
    swatch: '#63666c',
    img: a('assets/finish-graphite.webp'),
    imgMobile: a('assets/finish-graphite-mobile.webp'),
  },
  {
    id: 'oxblood',
    name: 'Oxblood',
    swatch: '#4a161d',
    img: a('assets/finish-oxblood.webp'),
    imgMobile: a('assets/finish-oxblood-mobile.webp'),
  },
]

/** Engineering dossier — close-up crops cut from the master frames. */
export interface DossierItem {
  id: string
  num: string
  title: string
  line: string
  data: string[]
  img: string
  alt: string
}

export const DOSSIER: DossierItem[] = [
  {
    id: 'structure',
    num: '01',
    title: 'Structure',
    line: 'Bonded, not welded.',
    data: ['BONDED ALUMINIUM MONOCOQUE', 'TORSIONAL RIGIDITY · 38,400 NM/DEG', '212 KG BARE'],
    img: a('assets/dossier-structure.webp'),
    alt: 'Close-up of the bare aluminium monocoque sill and pillar structure',
  },
  {
    id: 'damping',
    num: '02',
    title: 'Damping',
    line: 'Reads the road a thousand times a second.',
    data: ['DOUBLE WISHBONE · ALL CORNERS', 'ADAPTIVE VALVES · 3 MODES', 'FORGED UPRIGHTS'],
    img: a('assets/dossier-damping.webp'),
    alt: 'Close-up of a coilover damper and brake disc on the bare chassis',
  },
  {
    id: 'contact',
    num: '03',
    title: 'Contact',
    line: 'Four patches of rubber. Zero excuses.',
    data: ['21″ FORGED MONOBLOCK', 'UNSPRUNG MASS −18%', '305-SECTION REAR'],
    img: a('assets/dossier-contact.webp'),
    alt: 'Close-up of a forged wheel mounted on the rolling chassis',
  },
  {
    id: 'skin',
    num: '04',
    title: 'Skin',
    line: 'Drawn by wind, cured in autoclave.',
    data: ['CARBON SHELL · 24 PLIES', 'CD 0.26', 'ONE-PIECE CLAMSHELL'],
    img: a('assets/dossier-skin.webp'),
    alt: 'Close-up of the unpainted carbon-fibre body surface',
  },
  {
    id: 'vision',
    num: '05',
    title: 'Vision',
    line: 'Eighty-four segments of intent.',
    data: ['ADAPTIVE MATRIX LED', '84 SEGMENTS PER UNIT', 'SIGNATURE DRL'],
    img: a('assets/dossier-vision.webp'),
    alt: 'Close-up of the lit LED headlight on the finished car',
  },
  {
    id: 'surface',
    num: '06',
    title: 'Surface',
    line: 'Eleven hours under the polisher’s hand.',
    data: ['NOCTURNE BLUE · 7 LAYERS', 'HAND-POLISHED · 11 H', 'CERAMIC SEALED'],
    img: a('assets/dossier-surface.webp'),
    alt: 'Close-up of the glossy midnight-blue paint over the door and shoulder line',
  },
]

/** Full specification sheet (all figures are part of the fiction). */
export const SPEC_SHEET: Array<{ group: string; rows: Array<[string, string]> }> = [
  {
    group: 'Powertrain',
    rows: [
      ['Engine', '4.0 L biturbo V8 + e-boost'],
      ['Output', '620 hp · 780 Nm'],
      ['Transmission', '8-speed dual clutch'],
      ['Drive', 'Rear wheel'],
    ],
  },
  {
    group: 'Performance',
    rows: [
      ['0–100 km/h', '2.9 s'],
      ['Top speed', '330 km/h'],
      ['100–0 km/h', '32 m'],
      ['Power-to-weight', '463 hp/t'],
    ],
  },
  {
    group: 'Chassis',
    rows: [
      ['Structure', 'Bonded aluminium monocoque'],
      ['Suspension', 'Double wishbone, adaptive'],
      ['Brakes', 'Carbon-ceramic'],
      ['Wheels', '21″ forged monoblock'],
    ],
  },
  {
    group: 'Dimensions',
    rows: [
      ['Length', '4,720 mm'],
      ['Width', '1,940 mm'],
      ['Height', '1,290 mm'],
      ['Dry weight', '1,340 kg'],
    ],
  },
]
