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

- **Não é full-bleed.** Os assets são 16:9; cobrir um viewport 9:19 mostraria só ~25% da
  largura (carro "com zoom"). O palco vira uma **caixa 4:3 na largura total** (`.stage-box`,
  `object-position: 52% 50%`) — mostra o carro inteiro — com máscara em gradiente no topo e
  na base para fundir o skylight/piso no fundo `#060607`.
- Copy block **abaixo** da caixa (não sobreposto), largura total, headline menor.
- Intro: wordmark e cue centrados no espaço abaixo da caixa.
- Mesmo tratamento na órbita (caption abaixo), no finale (caixa em fluxo, copy + configurador
  abaixo) e na versão estática.
- Rail de progresso oculto; "01/06" permanece. Pin ~500vh. Órbita ~180vh, vídeos 960w.
- Ideal futuro (se houver créditos Higgsfield): outpaint 9:16 dos 8 stills (2 cr cada) e
  voltar ao full-bleed no mobile; reframe dos vídeos custa 30–57 cr cada.

## Reduced motion

Sem pin: cada estágio vira uma `<figure>` estática empilhada com sua copy; órbita vira poster; finale normal.
