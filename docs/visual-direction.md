# Direção visual — NOCTURNE

## Conceito

"Sala de máquinas vira galeria de arte." Estúdio quase preto, uma única luz honesta, e o carro como única fonte de cor. A engenharia é o luxo.

## Paleta (UI)

| Token     | Valor                    | Uso                             |
| --------- | ------------------------ | ------------------------------- |
| `bg`      | `#060607`                | fundo global                    |
| `surface` | `#0C0D10`                | strips, footer                  |
| `ink`     | `#EDEDEF`                | texto primário                  |
| `muted`   | `#8A8B92`                | texto secundário                |
| `hud`     | `#9BE8F5` (10–60% alpha) | rail, labels mono, linhas       |
| `ember`   | `#FFB454`                | momento ignition, hovers do CTA |
| `line`    | `#1C1D22`                | divisores                       |

Cor da pintura (só na fotografia): **Nocturne Blue** — azul-meia-noite metálico, quase preto na sombra.

## Tipografia

- **Display**: Archivo (variável, `wdth` 125 / `wght` 700–800), caixa-alta, tracking leve. Headlines e tagline.
- **Body**: Archivo `wdth` 100 / `wght` 400–500.
- **HUD/mono**: IBM Plex Mono 400/500, caixa-alta, letterspacing 0.12em, 11–13px.

## Luz e material (fotografia)

- Softbox retangular único no teto → highlight contínuo no capô/teto.
- Rim light fria discreta traseira-esquerda.
- Piso de concreto escuro polido, reflexo suave (não espelho perfeito).
- Sem fumaça, sem lens flare, sem pessoas, sem texto.

## Textura e acabamento (UI)

- Grain 2–3% via CSS sobre tudo (mata banding do fundo escuro).
- Vinheta sutil nas bordas do palco.
- Flash de encaixe: branco 8% por ~120ms no snap de cada peça.
- Glow âmbar radial na área dos faróis durante IGNITION.
- Sheen diagonal (banda clara translúcida) varrendo o quadro durante FINISH.

## O que NÃO fazer

- Nenhum gradiente decorativo de UI, nenhum glassmorphism.
- Nenhum texto/logo dentro das imagens geradas.
- Nenhuma cor além de `hud`/`ember` sobre a fotografia.
