# Performance Budget

## Alvos (4G rápido, notebook médio)

- LCP < 2.5s · CLS = 0 · INP < 200ms
- JS inicial (gz): ≤ 160 KB (React ~45 + GSAP ~28 + app ~30)
- CSS (gz): ≤ 20 KB
- Fontes: 2 famílias variáveis, subset latin, `display=swap`, ≤ 90 KB total

## Mídia

| Asset                                                 | Budget                         |
| ----------------------------------------------------- | ------------------------------ |
| 6 quadros desktop (WebP 1920w)                        | ≤ 350 KB cada / ≤ 2.0 MB total |
| 6 quadros mobile (WebP 1080w)                         | ≤ 180 KB cada                  |
| 5 transições de montagem desktop (1920w all-keyframe) | ≤ 10 MB cada / ≤ 45 MB total   |
| 5 transições de montagem mobile (960w)                | ≤ 4 MB cada                    |
| orbit-desktop.mp4 (all-keyframe 1920w)                | ≤ 14 MB                        |
| orbit-mobile.mp4 (1280w)                              | ≤ 6 MB                         |
| poster + og                                           | ≤ 250 KB                       |

## Estratégia de carga

1. Preloader gate: **apenas** S1 (quadro visível) + fontes. Demais quadros com `fetchpriority=low`/lazy em paralelo pós-first-paint. First paint continua ≤ ~0.7 MB.
2. Transições: `preload="none"`; vídeo i recebe `src` quando o scroll cruza o início da janela anterior (V1 no primeiro tick pós-mount). Se não estiver pronto quando a janela chega, o wipe assume aquele passe — nada bloqueia o scroll.
3. Vídeo da órbita: `src` injetado por trigger a ~250% antes da seção.
4. `srcset` desktop/mobile por media query (`<picture>`); vídeos escolhem arquivo por `matchMedia` no momento da carga.
5. Sem terceiro-party, sem analytics no MVP, zero chaves no frontend.

## Verificações antes de entregar

- `npm run build` limpo + preview
- Console sem erros/warnings
- Rede: total transferido no first view ≤ 3 MB (sem órbita)
- Scroll reverso sem jank visível
- Teste desktop (1440px), tablet (768px), mobile (390px)
