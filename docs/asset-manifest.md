# Asset Manifest — NOCTURNE GT-1

Geração: Higgsfield via MCP (autorizada pelo cliente). Imagens: `nano_banana_2`, 16:9, 2K (2 cr/img). Vídeo: `minimax_h3`, 16:9, 2K, 8s, start+end frame (32 cr).

## Estratégia de consistência

1. **S6 (master)** por text-to-image define design do carro, câmera, luz e composição.
2. Estágios anteriores derivados por **edição encadeada para trás** (S6→S5→S4→S3→S2→S1), sempre com a imagem anterior como referência → câmera/estúdio idênticos nos 6 quadros.
3. Órbita: image-to-video com **start_image = end_image = S6** → volta ao ângulo inicial (scrub e loop limpos).
4. QA de cada quadro (download + inspeção) antes de derivar o próximo. Falhou → 1 retry com prompt corrigido antes de replanejar.

## Câmera canônica (imutável em S1–S6)

3/4 frontal-esquerda, câmera a ~90 cm (altura do farol), lente 35 mm, carro inteiro no quadro ocupando centro-direita, piso vazio no inferior-esquerdo (área de copy), headroom moderado. Estúdio escuro, softbox único no teto, rim light fria, piso refletivo.

## Assets

| ID  | Estágio                                                   | Tipo                                  | Derivação             | Arquivo           |
| --- | --------------------------------------------------------- | ------------------------------------- | --------------------- | ----------------- |
| S6  | FINISH — carro completo, pintura Nocturne Blue, faróis ON | imagem master (T2I)                   | —                     | `stage-06-finish` |
| S5  | IGNITION — carroceria em primer carbono fosco, faróis ON  | edit de S6: troca material da pintura | `stage-05-ignition`   |
| S4  | BODY — mesmo carro, faróis OFF                            | edit de S5: apaga faróis              | `stage-04-body`       |
| S3  | WHEELS — sem carroceria: chassi + suspensão + rodas       | edit de S4: remove casca              | `stage-03-wheels`     |
| S2  | SUSPENSION — chassi + suspensão, sem rodas, em cavaletes  | edit de S3: remove rodas              | `stage-02-suspension` |
| S1  | CHASSIS — só o monocoque nu em cavaletes                  | edit de S2: remove suspensão          | `stage-01-chassis`    |
| V1  | ORBIT — 360° em torno do carro completo                   | I2V start=end=S6                      | `orbit-2k.mp4`        |

### Elementos imutáveis (S1–S6)

Câmera, lente, enquadramento, estúdio, luz, piso, posição do carro no quadro, quantidade de objetos (fora as peças do roteiro).

### Elementos transformáveis

Somente as peças do estágio (suspensão, rodas, carroceria, estado dos faróis, material da pintura) e os cavaletes (presentes apenas em S1–S2).

### Restrições globais (todos os prompts)

Sem texto, sem logos, sem badges, sem pessoas, sem watermark, sem fumaça, sem lens flare.

## Derivados (pós-processamento local)

| Arquivo                  | Fonte         | Spec                                            |
| ------------------------ | ------------- | ----------------------------------------------- |
| `stage-0X-*.webp`        | PNG 2K        | 1920w, WebP q80, ≤350 KB                        |
| `stage-0X-*-mobile.webp` | PNG 2K        | 1080w, WebP q78                                 |
| `orbit-desktop.mp4`      | V1            | ≤1440p, H.264 all-keyframe (scrub), alvo ≤14 MB |
| `orbit-mobile.mp4`       | V1            | 720p, alvo ≤6 MB                                |
| `orbit-poster.webp`      | frame 0 de V1 | 1920w                                           |
| `og.jpg`                 | S6            | 1200×630                                        |

## Fallback mobile

Mesmos quadros com crop `object-cover` central (carro centralizado). Órbita usa `orbit-mobile.mp4`; reduced-motion usa apenas o poster.

## Produção executada (2026-08-23)

Todos os assets foram gerados, inspecionados e aprovados no checklist abaixo.

| Asset                            | Job ID (Higgsfield)                    | Status     | Custo |
| -------------------------------- | -------------------------------------- | ---------- | ----- |
| S6 master (variante A escolhida) | `46cbb291-ece1-46f3-87f4-3408bc1e68f7` | aprovado   | 2 cr  |
| S6 variante B (descartada)       | `1531d9fb-f938-4f3e-bf76-5eaac80eae3a` | descartada | 2 cr  |
| S5 ignition                      | `68afa052-2524-4ffd-9e8a-5377d968f477` | aprovado   | 2 cr  |
| S4 body                          | `8f6a9d22-0af9-47eb-b117-4cb2ff4f6f03` | aprovado   | 2 cr  |
| S3 wheels                        | `b0418517-a81a-49e7-aa02-234f27146074` | aprovado   | 2 cr  |
| S2 suspension                    | `fb7b9265-b77b-451c-88df-4e2f5ff2a35d` | aprovado   | 2 cr  |
| S1 chassis                       | `936a33f4-b47e-4f24-8267-0a90c6cb78c1` | aprovado   | 2 cr  |
| V1 orbit 360° 8s 2K              | `1f1dad10-a278-4fe3-9f35-a95a399ba9f8` | aprovado   | 32 cr |

**Total fase 1: ~46 créditos.** Masters em `assets-src/`; derivados otimizados em `public/assets/`.

### Fase 2 — transições de montagem (2026-08-24)

Vídeos de montagem industrial entre pares de quadros (start_image = estágio N,
end_image = estágio N+1), minimax_h3 2K 16:9, scrubados pelo scroll com fallback
automático para os wipes:

| Asset  | Conteúdo                                    | Job ID                                 | Status   | Custo |
| ------ | ------------------------------------------- | -------------------------------------- | -------- | ----- |
| V12 6s | suspensões descem e parafusam               | `7b49f391-d0ff-4e9b-a604-1c028b896cc5` | aprovado | 24 cr |
| V23 6s | rodas prensam nos cubos; cavaletes recolhem | `9e796748-547e-45bd-86ce-1631791d1d9a` | aprovado | 24 cr |
| V34 6s | body marriage: casca desce sobre o chassi   | `f00a7e4e-a116-4053-9d1a-b243de536326` | aprovado | 24 cr |
| V45 4s | (falhou na fila — não cobrado)              | `de9edbf8-67bc-4bb2-8bdf-15eb26ab275e` | falhou   | 0 cr  |
| V45 5s | faróis dão boot (flicker → glow)            | `9c6f0c4f-b1e2-4739-aa5e-f21a7da16797` | aprovado | 20 cr |
| V56 6s | pintura flui do bico à traseira             | `63808ea3-0725-453a-8af1-09401cfa2d1a` | aprovado | 24 cr |

**Total fase 2: 116 créditos.**

### Fase 3 — conteúdo expandido (2026-08-24)

| Asset | Derivação | Job ID | Custo |
|---|---|---|---|
| `finish-graphite` (Graphite Storm) | edit do master S6, só a cor da pintura | `d58696d9-5a42-41e3-95f6-a514d997e6b7` | 2 cr |
| `finish-oxblood` (Oxblood) | edit do master S6, só a cor da pintura | `708468e7-a434-426d-bc57-3b85515c377c` | 2 cr |
| `build-film.mp4` (0:37, 9,7 MB) | concat ffmpeg das 5 transições + órbita | — | 0 cr |
| `dossier-*.webp` (6 close-ups 4:5) | crops sharp dos masters aprovados | — | 0 cr |

**Total fase 3: 4 créditos. Total geral do projeto: ~166 créditos.**

Ressalvas de QA registradas:

- O design do carro remete a um GT britânico real (sem emblemas). Aceito para concept
  fictício com disclaimer no rodapé; regenerar com design mais autoral é opcional.
- Na órbita, um micro-badge fantasma aparece no capô/tampa traseira em alguns frames —
  imperceptível em scrub, sem texto legível.

## Checklist de validação por quadro

- [ ] Câmera/altura/lente idênticas ao anterior
- [ ] Carro no mesmo lugar do quadro
- [ ] Nada de texto/logo/objeto extra
- [ ] Luz e reflexo do piso coerentes
- [ ] A única diferença é a peça do estágio
