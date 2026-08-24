# Wireframe

## Palco (AssemblySequence) — desktop

```
┌────────────────────────────────────────────────────────┐
│ NOCTURNE (topo-esq, mono, sm)          01 / 06 (topo-dir)│
│                                                        │
│ ▍rail de progresso                                     │
│ ▍(esq, 6 ticks)          [ CARRO — centro-direita ]    │
│ ▍                                                      │
│                                                        │
│ 01 — CHASSIS                                           │
│ Truth, before beauty.        (inf-esq, sobre piso vazio)│
│ MONOCOQUE — 212 KG                                     │
└────────────────────────────────────────────────────────┘
```

- Media stage: 6 `<img>` empilhadas full-bleed (`object-cover`), composição com piso livre no canto inferior-esquerdo para a copy.
- Copy block: eyebrow mono (nº + nome), headline display, linha técnica mono.
- Intro overlay (progress 0): wordmark grande centralizado + cue "SCROLL TO BUILD ↓"; some nos primeiros 5% de scroll.

## OrbitSection

Full-bleed vídeo; caption mono centrada na base: "TAKE THE WALK". Sem outra UI.

## HeroFinale

```
│              [ HERO SHOT full-bleed ]                  │
│                                                        │
│        ENGINEERED                                       │
│        TO BE DESIRED.        (esq-inferior, display XL) │
│        NOCTURNE GT-1 · LIMITED TO 499                   │
│        [ RESERVE THE ONE ]   [ SPECIFICATION ]          │
```

## SpecsStrip

4 colunas mono: `2.9s 0–100` · `620 HP` · `1,340 KG` · `499 UNITS` (grid 2×2 no mobile).

## Footer

1 linha disclaimer (marca fictícia) + crédito "Designed & engineered by Lucas Caldeira" + ano.

## Mobile (≤768px)

- Palco idêntico, crop `cover` central (carro centralizado aguenta 9:16).
- Copy block ancorado na base, largura total, headline menor.
- Rail de progresso vira barra fina no topo. "01/06" permanece.
- HUD extra oculto. Pin ~450vh. Órbita ~180vh, vídeo 720p.

## Reduced motion

Sem pin: cada estágio vira uma `<figure>` estática empilhada com sua copy; órbita vira poster; finale normal.
