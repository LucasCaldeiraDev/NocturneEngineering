# NOCTURNE GT-1 — Engineered to be Desired

Landing page imersiva de página única: um grand tourer fictício é montado pelo scroll do
visitante — chassi → suspensão → rodas → carroceria → ignição → pintura → órbita de câmera →
hero shot. Peça de portfólio; a marca NOCTURNE é ficção declarada.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)
- GSAP + ScrollTrigger (pin + scrub das sequências; scrub de `video.currentTime` na órbita)
- Assets gerados no Higgsfield (nano banana 2 para a cadeia de quadros; MiniMax H3 para a
  órbita 360°) e otimizados com sharp + ffmpeg (vídeo re-encodado all-keyframe para seek exato)

## Comandos

```bash
npm install        # dependências
npm run dev        # dev server (porta 5173 ou PORT)
npm run build      # type-check + build de produção
npm run preview    # serve o build
npm run assets:optimize  # regenera public/assets a partir de assets-src/
```

## Seções

Montagem dirigida por scroll (6 estágios com vídeos de fábrica scrubados) → órbita 360° →
finale com configurador de pintura (3 acabamentos) → dossiê de engenharia (6 close-ups) →
ficha técnica completa → rodapé.

## Estrutura

- `docs/` — brief, research, sitemap, wireframe, direção visual, manifesto de assets,
  plano de animação e performance budget (fluxo completo da produção)
- `src/components/AssemblySequence.tsx` — palco pinado com os 6 quadros e a timeline mestre
- `src/components/OrbitSection.tsx` — vídeo 360° com currentTime dirigido pelo scroll
- `src/components/StaticSequence.tsx` — variante completa para `prefers-reduced-motion`
- `src/lib/stages.ts` — copy e assets de cada estágio
- `assets-src/` — masters PNG/MP4 vindos do Higgsfield (fora do bundle; gitignored)
- `public/assets/` — WebP/MP4 otimizados servidos pela página

## Acessibilidade e performance

- Sequência inteira disponível como documento estático sob `prefers-reduced-motion`
- Conteúdo essencial sempre em HTML (nunca só dentro de vídeo)
- Preloader gate apenas no primeiro quadro + fontes; órbita carrega sob demanda
- First view ≈ 0,6 MB (6 quadros WebP ≈ 490 KB); órbita 8 MB desktop / 3 MB mobile, lazy
