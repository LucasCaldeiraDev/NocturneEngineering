# Sitemap — página única

```
/
├── <Preloader>            gate: quadro S1 + fontes; wordmark NOCTURNE
├── <AssemblySequence>     PIN ~600vh — palco fixo, 6 quadros
│     ├── intro overlay    wordmark + "scroll to build"
│     ├── 01 CHASSIS
│     ├── 02 SUSPENSION
│     ├── 03 WHEELS
│     ├── 04 BODY
│     ├── 05 IGNITION      (faróis acendem)
│     └── 06 FINISH        (pintura surge)
├── <OrbitSection>         PIN ~250vh — vídeo 360° scrubbed
├── <HeroFinale>           hero shot + tagline + configurador de pintura (3 finishes) + CTAs
├── <Dossier>              6 close-ups de engenharia + dados (id="dossier")
├── <BuildFilm>            filme de 0:37 com todos os estágios (id="film")
├── <SpecsStrip>           4 stats hero + ficha técnica completa em 4 grupos (id="spec")
└── <Footer>               disclaimer de ficção + crédito + contato (id="contact")
```

## Fluxo de scroll

- Total ~9–10 viewports de rolagem. Pin liberado após a órbita; finale/specs/footer rolam normal.
- Voltar o scroll desfaz a montagem (timeline reversível, `scrub`).

## Rotas

Página única, sem router. Âncoras: `#spec`, `#contact`.
