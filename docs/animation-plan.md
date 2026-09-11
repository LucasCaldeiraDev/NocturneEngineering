# Animation Plan

Única lib de animação: **GSAP + ScrollTrigger** (nada de Motion — evita dupla propriedade no mesmo elemento). Scroll suave nativo; Lenis não entra (scrub já suaviza; menos JS).

## Timeline mestre — AssemblySequence (pin ~700vh desktop / ~500vh mobile, scrub: 1)

Progress 0→1 dividido em 5 janelas de transição + intro + hold.

**Arquitetura em camadas (v2):** dentro de cada janela, um vídeo de montagem gerado
(start frame = estágio N, end frame = estágio N+1) é scrubado via `currentTime` por um
`gsap.ticker`. Os wipes de `clip-path` ficam NA CAMADA DE BAIXO como fallback automático:
um vídeo só é "armado" para a janela se já estava pronto (`readyState ≥ 2`) antes de a
janela começar — senão aquele passe usa o wipe, sem troca no meio da transição. Carga
progressiva: vídeo i recebe `src` quando o progresso cruza o início da janela i−1 (os
dois primeiros vídeos também são pré-aquecidos em `requestIdleCallback`).

**Governador de velocidade (v3):** `scrub: N` do GSAP suaviza por uma DURAÇÃO fixa, não
por velocidade — um salto grande no scroll (scrollbar arrastada, tecla End, ou um fling
que escapa do damping de touch) percorre a mesma distância maior na MESMA duração, ou
seja, proporcionalmente mais rápido, podendo varrer várias janelas antes dos vídeos
carregarem e pular estágios inteiros. Por isso `AssemblySequence` e `OrbitSection` não
usam `scrub` — cada um cria um `ScrollTrigger` simples (só pin + progresso bruto) e
avança a própria timeline manualmente (`tl.progress()`) a partir de um valor "governado":
suavizado por LERP para scroll normal, mas com um TETO DE VELOCIDADE real (não por-tick,
por segundo — escalado por `gsap.ticker.deltaRatio(60)` para não depender da taxa de
quadros) que garante um tempo mínimo de permanência em cada janela, não importa o quão
rápido ou por qual meio o scroll mudou. Quando a seção sai do range ativo do pin, o
progresso "encaixa" (snap) direto no valor final — sem isso, ela travaria congelada numa
transição pela metade se o usuário voltasse a rolar para dentro dela.
`gsap.config({ autoSleep: 0 })` (em `useScrollGovernor`) evita que o ticker do GSAP entre
em modo de baixa frequência por não haver tweens "tocando" no sentido tradicional.
Camada complementar: `ScrollTrigger.normalizeScroll` amortece a inércia de touch/wheel
(não cobre scrollbar/teclado — por isso o teto de velocidade acima é a garantia real).

| Janela | Trecho    | Vídeo (conteúdo)                                                    | Fallback abaixo                           |
| ------ | --------- | ------------------------------------------------------------------- | ----------------------------------------- |
| intro  | 0–0.055   | —                                                                   | wordmark + cue fade-out                   |
| S1→S2  | 0.10–0.24 | suspensão desce e parafusa nos 4 cantos                             | wipe de baixo→cima + flash                |
| S2→S3  | 0.26–0.40 | rodas entram pelas laterais e prensam nos cubos; cavaletes recolhem | wipe center-out + flash                   |
| S3→S4  | 0.42–0.58 | "body marriage": casca de carbono desce sobre o chassi              | wipe cima→baixo + flash forte             |
| S4→S5  | 0.60–0.72 | faróis dão boot (flicker duplo → glow âmbar constante)              | crossfade + glow âmbar radial             |
| S5→S6  | 0.74–0.88 | pintura Nocturne Blue flui do bico à traseira sobre o carbono       | sheen diagonal + crossfade                |
| hold   | 0.90–1    | —                                                                   | carro completo respira (scale 1.00→1.015) |

- Cada transição: imagem entrante também faz scale 1.03→1.0 (assentamento).
- Copy blocks: y 24px + fade, entrada/saída simétricas, reversível.
- Rail: 6 ticks; tick ativo preenche conforme a janela.
- Contador "0X / 06" troca no meio de cada janela.

## OrbitSection (pin ~250vh, scrub)

- `video.currentTime = progress * duration` com quickTo/lerp para suavizar seek.
- Vídeo all-keyframe (encode `-g 1`) → seek exato sem saltos.
- `preload="metadata"`; carga real só quando o pin anterior chega a ~70%.
- Caption "TAKE THE WALK" fade in/out nas pontas.
- Se o vídeo falhar/negar seek: fallback = poster com rotação sutil de highlight (CSS), página segue.

## HeroFinale (sem pin)

- Tagline em 2 linhas com stagger de entrada (once, `ScrollTrigger` play).
- CTAs: hover com inversão + underline âmbar (CSS puro).

## Regras

- Só `transform`, `opacity`, `clip-path` e `currentTime` — nada de layout anim.
- `will-change` apenas nos layers do palco durante o pin.
- Reduced motion: mata todos os triggers, layout estático empilhado (ver wireframe).
- Mobile: mesmas timelines com pin encurtado (~450vh / ~180vh) e flashes reduzidos.
- Tudo reversível: scrub bidirecional, sem `once` na sequência.
